let app = require('../processMessage')

describe("when new request is input and no prior requests are present", () => {
  let newRequest = {
    a: [1],
    b: [2]
  }
  let currentRank = []

  it('should assign default rank to each property and return', () => {
    let res = app.rank(newRequest, currentRank)

    expect(res[0]['name']).toEqual("a")
    expect(res[1]['name']).toEqual("b")
    expect(res[0]['rank']).toEqual(1)
    expect(res[1]['rank']).toEqual(2)
    expect(res[0]['uniqueValues'][0]).toEqual(1)
    expect(res[1]['uniqueValues'][0]).toEqual(2)
  })
})