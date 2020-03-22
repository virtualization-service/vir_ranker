const amqp = require('amqplib/callback_api')

let rMQ_URL = process.env.MQ_URL || 'amqp://dupejgwz:vkWl0C7Oh0S5jGNK5Ua48A4-HXSv5QY9@shrimp.rmq.cloudamqp.com/dupejgwz'


let isLocal = process.env.VCAP_SERVICES == null
let rmqService = process.env.RMQ_SERVICE || 'cf-rabbitmq'
if (!isLocal) {
  try {
    let vcap_services = JSON.parse(process.env.VCAP_SERVICES)
    let uri = vcap_services[rmqService][0]['credentials']['uri']
    if (uri != null) {
      rMQ_URL = uri
    }
    console.log('Getting RMQ url from VCAP_SERVICES = ', rMQ_URL)
  }catch(error){
    console.error('Unable to retrieve Rabbit MQ Url from vcap services, by default env.MQ_URL will be used', error)
  }
}


const connectInternal = (callback) => {
  if(rMQ_URL) {
    console.log('Using URL: ', rMQ_URL)
    amqp.connect(rMQ_URL, callback)
  }else{
    amqp.connect(callback)
  }
}

const connect = async (unackedLimit) => {
  return new Promise((resolve, reject) => {
    connectInternal((err, conn) => {
      if(err){
        console.error('Error while creating mq connection', err)
        reject(err)
      }
      conn.createChannel((err, ch) => {
        if(err){
          console.error('Error while creatign mq channel', err)
          reject(err)
        }
        if(unackedLimit)
          console.log('Attempting to set prefetch to ' + unackedLimit + ', ' + typeof unackedLimit)
        ch.prefetch(parseInt(unackedLimit), false)
        resolve(getClientMethods(ch))
      })
    })
  })
}

const getClientMethods = (channel) => {
  return {
    onMessage: (queueName, callback) => {
      channel.consume(queueName, (message) => {
        new Promise(async (resolve, reject) => {
          try{
            await callback(message)
          }catch(error){
            console.error('Unhandled Error in MQ client callback from ' + queueName + ' queue: ', error)
          }finally{
            try{
              channel.ack(message)
            }catch(ackError){
              console.error('Error arttempting to ack message: ', ackError)
            }
            resolve()
          }
        })
      })
    },

    createAndBindTemporaryQueue: async (queueName, bindingExchange, bindingRoutingKey) => {
      await channel.assertQueue(queueName, 
        {
          exclusive: true,
          durable: true,
          autoDelete: true
        })
      await channel.bindQueue(queueName, bindingExchange, bindingRoutingKey)
    },

    createQueue: async (queueName) => {
      await channel.assertQueue(queueName, 
        {
          durable: true
        })
    },

    createExchange: async (exchangeName, type) => {
      await channel.assertExchange(exchangeName, type, 
        {
          durable: true
        })
    },

    bindQueue: async (queueName, bindingExchange, bindingRoutingKey) => {
      await channel.bindQueue(queueName, bindingExchange, bindingRoutingKey)
    },

    sendMessage: (exchange, routingKey, message, options) => {
      console.log('Sending message', routingKey)
      return channel.publish(exchange, routingKey, message, options)
    }
  }
}

module.exports = {
  connect
}
