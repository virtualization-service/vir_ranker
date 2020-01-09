var exports = module.exports = {}

exports.rank = (newRequest, currentRank) => {
  if (!newRequest) { // Request is Null or Undefined
    console.error("param : 'newRequest' should be an object")
    return
  }
  if (!currentRank || !Array.isArray(currentRank)) { // Request is Null or Undefined
    console.error("param : 'currentRank' should be an array")
    return
  }

  let res = []

  if(currentRank.length == 0){
    setRank(newRequest, res)
  }

  if(currentRank.length > 0){
    res = currentRank
    let requestKeys = Object.keys(newRequest)
    let priorKeys = res.map(x => x.name)
    let newKeys = requestKeys.filter(x => !priorKeys.includes(x))

    addNewKeys(newKeys, res, newRequest)

    updateRank(requestKeys, res, newRequest)
  }

  res.sort( (x, y) => x.rank > y.rank)

  resolveDups(res)

  return res

}

let resolveDups = (res) => {
  for(let i = 0; i < res.length; i++){
    if(i+1 < res.length && res[i].rank === res[i+1].rank){
      for(let j = i + 1; j < res.length; j++) {
        res[j].rank = res[j].rank * 2;
      }
    }
  }
}

let updateRank = (requestkeys, res, newRequest) => {
  requestkeys.forEach(element => {
    let ele = res.filter(x => x.name === element)[0]
    if(!(ele.uniqueValues.includes(newRequest[ele.name][0]))){
      ele.uniqueValues.push(newRequest[ele.name][0])
      ele.rank = Math.pow(2, ele.uniqueValues.length - 1)
    }else{
      ele.rank = Math.pow(2, ele.uniqueValues.length - 1)
    }
  })
}

let addNewKeys = (newKeys, res, newRequest) => {
  if(newKeys !== undefined && newKeys.length > 0) {
    newKeys.forEach(element => {
      res.push({
        name: element,
        rank: 1,
        uniqueValues: [newRequest[element][0]]
      })
    })
  }
}

let setRank = (newRequest, res) => {
  let keys = Object.keys(newRequest)
  keys.forEach(element => {
    res.push({
      name: element,
      rank : 1,
      uniqueValues: [newRequest[element][0]]
    })
  })
}