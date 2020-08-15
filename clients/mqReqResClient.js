const rabbitMqClient = require('./rabbitMqClient')
const processor = require('../processMessage').rank
const fetchCollection = require('./mongoDbClient').fetchCollection

let actualClientPromise
let srcQueue = process.env.SRC_QUEUE_NAME ? process.env.SRC_QUEUE_NAME : 'ranker'
let exchange = process.env.EXCHANGE ? process.env.EXCHANGE : 'configuration'

const initializeClient = () => {
  if(!actualClientPromise){
    actualClientPromise = performInitialization()
  }
  return actualClientPromise
}

const performInitialization = () => {
  console.log("mqRequestResponseClient - performInitialization")
  return new Promise(async (resolve, reject) => {
    let actualClient
    try {
      actualClient = await rabbitMqClient.connect()
      await actualClient.createQueue(srcQueue)
      await actualClient.createExchange(exchange, 'topic')
      await actualClient.bindQueue(srcQueue, exchange, 'parser.completed')

      await actualClient.onMessage(srcQueue, handleQueueMessage)
      resolve(actualClient)
      console.log('mqRequestResponseClient - successfully created queue[' + srcQueue + ']')
    }catch(error){
      console.error('mqRequestResponseClient - Failed to create queue', error)
      reject(error)
    }
  })
}

const handleQueueMessage = async (responseMsg) => {
  console.log('Handling response message')
  try {
    let msg = JSON.parse(responseMsg.content.toString())
    let rank = await fetchCollection(msg.operation,'rankers')
    let parsedRank = JSON.parse(rank)

    let newRank = processor(msg.request.formatted_data, parsedRank.data)
    let res = {"operation": msg.operation, "data": newRank}

    performRequest(Buffer.from(JSON.stringify(res)))
  }catch(error) {
    console.error('Could not parse the error message. Using entire response for error', error)
  }
}

const performRequest = async (msg) => {
  let actualClient = await initializeClient()

  console.log('Placing message into exchange [destination : ' + exchange + ']')
  return await actualClient.sendMessage(exchange, 'ranker.completed', msg)
}

module.exports = {
  performRequest,
  initializeClient
}