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
    let allKeys = priorKeys.concat(newKeys)
    //console.log(requestKeys, priorKeys, newKeys, allKeys, res)

    addNewKeys(newKeys, res, newRequest)

    updateRank(allKeys, res, newRequest)
    //console.log('Rank after update', res)
  }

  res.sort( (x, y) => x.rank - y.rank)
  //console.log('Rank after sort', res)

  resolveDupsAndReset(res)

  return res

}

let resolveDupsAndReset = (res) => {
  for(let i = 0; i < res.length; i++){
    if(i+1 < res.length && res[i].rank === res[i+1].rank){
      for(let j = i + 1; j < res.length; j++) {
        res[j].rank = res[j].rank + 1
      }
    }
  }

  for(let i = 0; i < res.length; i++){
    res[i].rank = i + 1
  }

}

let updateRank = (allKeys, res, newRequest) => {
  allKeys.forEach(element => {
    let ele = res.filter(x => x.name === element)[0]
    if(newRequest[ele.name] != undefined && !(ele.uniqueValues.includes(newRequest[ele.name][0]))){
      ele.uniqueValues.push(newRequest[ele.name][0])
      ele.rank = ele.uniqueValues.length
    }else{
      ele.rank = ele.uniqueValues.length
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