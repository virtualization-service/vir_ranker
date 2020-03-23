const fetch = require('node-fetch')
const URL = process.env.DB_SERVICE_URL ? process.env.DB_SERVICE_URL : 'http://data-saver-virtualization.apps.us-east-1.starter.openshift-online.com/api/data/ranker'
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const getRanker = async (operationName) => {
  let url = URL + '?operation=' + operationName
  let request = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }

  try {
    res = await fetch(url, request)
    if(!res.ok){
      throw new Error('Fetch Error: ' + res.status + ' - ' + await res.text())
    }
  }catch(error){
    console.error('Error during fetch of rank "' + url +'": ', error)
    throw error
  }

  return await res.json()

}

module.exports = {
  getRanker
}
