let app = require("../processMessage")

// TODO - CASE 1 - NEW REQUEST WITH NO PRIOR RECORDS
describe("when new request is input and no prior requests are present", () => {
  let newRequest = {
    a: [1],
    b: [2]
  }

  let currentRank = []
  it("should assign default rank to each property and return", () => { 
    let res = app.rank(newRequest, currentRank) 
    expect(res[0]['name']).toEqual("a"); 
    expect(res[1]['name']).toEqual("b"); 
    expect(res[0]['rank']).toEqual(1);
    expect(res[1]['rank']).toEqual(2); 
    expect(res[0]['uniqueValues'][0]).toEqual(1);
    expect(res[1]['uniqueValues'][0]).toEqual(2)
  })
}) 

//TODO - CASE 2 NEW REQUEST WITH 1 PRIOR RECORD
describe("when new request is input and 1 prior request is present", () => {
  //TODO - CASE 2.1 - NEW REQUEST CONTAINS SAME FIELDS AND VALUES AS OF PRIOR RECORD
  describe("provided new request contains same fields and values are of prior request", () => {
    let newRequest = { a: [1], b: [2] };
    it("should keep the same ranking as of before", () => {
      let currentRank = [ {name: 'a', rank: 1, uniqueValues : [1]}, {name: 'b', rank : 2, uniqueValues:[2]}]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("a");
      expect(res[1].name).toEqual("b"); 
      expect(res[0].rank).toEqual(1);
      expect(res[1].rank).toEqual(2); 
      expect(res[0].uniqueValues[0]).toEqual(1);
      expect(res[1].uniqueValues[0]).toEqual(2);
      expect(res[0].uniqueValues.length).toEqual(1); 
      expect(res[1].uniqueValues.length).toEqual(1);
    });
  });

  //TODO: CASE 2.2 - NEW REQUEST CONTAINS SAME FIELDS BUT SOME DIFFERENT VALUES AS OF PRIOR RECORD
  describe("provided new request contains same fields but different Values for some fields", () => {
    let newRequest = {a: [1], b: [3] };
    it("should update the ranking of some fields", () =>{ 
      let currentRank = [{name : 'a', rank: 1, uniqueValues : [1]}, {name : 'b', rank: 2, uniqueValues : [2]}]
      let res = app.rank(newRequest, currentRank) 
      expect(res[0].name).toEqual("a"); 
      expect(res[1].name).toEqual("b"); 
      expect(res[0].rank).toEqual(1); 
      expect(res[1].rank).toEqual(2);
      expect(res[0].uniqueValues[0]).toEqual(1);
      expect(res[1].uniqueValues[0]).toEqual(2); 
      expect(res[1].uniqueValues[1]).toEqual(3); 
      expect(res[0].uniqueValues.length).toEqual(1); 
      expect(res[1].uniqueValues.length).toEqual(2);
    })
  })
  // TODO - CASE 2.3 NEW REQUEST CONTAINS SAME FIELDS BUT ALL DIFFERENT VALUES AS OF PRIOR RECORD
  describe("provided new request contains same fields but different values for all fields",() => {
    let newRequest = { a: [2], b : [3] };
    it("should update the ranking of all fields", () => {
      let currentRank = [{name: 'a', rank : 1, uniqueValues: [1]}, {name: 'b', rank: 2, uniqueValues : [2]}]
      let res = app.rank(newRequest, currentRank)
    
      expect(res[0].name).toEqual("a"); 
      expect(res[1].name).toEqual("b");
      expect(res[0].rank).toEqual(1); 
      expect(res[1].rank).toEqual(2);
      expect(res[0].uniqueValues[0]).toEqual(1);
      expect(res[0].uniqueValues[1]).toEqual(2) 
      expect(res[1].uniqueValues[0]).toEqual(2); 
      expect(res[1].uniqueValues[1]).toEqual(3);
      expect(res[0].uniqueValues.length).toEqual(2); 
      expect(res[1].uniqueValues.length).toEqual(2);
    });
  })

  // TODO - CASE 2.4 - NEW REQUEST CONTAINS SOME NEW FIELDS FIELDS BUT MATCHING VALUE FOR OLD FIELDS
  describe("provided new request contains new fields but same values for old fields", () => {
    let newRequest = { a: [1], b: [2], c: [3] }; 
    it("should update the ranking of new fields", () => {
      let currentRank = [{name : 'a', rank: 1, uniqueValues: [1]}, {name : 'b', rank: 2, uniqueValues : [2]}]
      let res = app.rank(newRequest, currentRank);

      expect(res[0].name).toEqual("a"); 
      expect(res[1].name).toEqual("b"); 
      expect(res[2].name).toEqual("c");
      expect(res[0].rank).toEqual(1); 
      expect(res[1].rank).toEqual(2); 
      expect(res[2].rank).toEqual(3);
      expect(res[0].uniqueValues[0]).toEqual(1);
      expect(res[1].uniqueValues[0]).toEqual(2) 
      expect(res[2].uniqueValues[0]).toEqual(3)
      expect(res[0].uniqueValues.length).toEqual(1);
      expect(res[1].uniqueValues.length).toEqual(1);
      expect(res[2].uniqueValues.length).toEqual(1);
    })
  })

  // TODO - CASE 2.5 - NEW REQUEST CONTAINS SOME NEW FIELDS FIELDS BUT SOME DIFFERENT VALUE FOR OLD FIELDS
  describe("provided new request contains new fields and different values for some old fields", () =>{
    let newRequest = {a: [2], b: [2], c: [3] };
    it("should update the ranking of new fields", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1]}, 
        {name: 'b', rank: 2, uniqueValues: [2]}
      ] 
      let res  = app.rank(newRequest, currentRank);
      //console.log(res)
      expect(res[0].name).toEqual("b"); 
      expect(res[1].name).toEqual("c"); 
      expect(res[2].name).toEqual("a");

      expect(res[0].rank).toEqual(1);
      expect(res[1].rank).toEqual(2);
      expect(res[2].rank).toEqual(3);

      expect(res[0].uniqueValues[0]).toEqual(2); 
      expect(res[1].uniqueValues[0]).toEqual(3); 
      expect(res[2].uniqueValues[0]).toEqual(1);
      expect(res[2].uniqueValues[1]).toEqual(2)

      expect(res[0].uniqueValues.length).toEqual(1) 
      expect(res[1].uniqueValues.length).toEqual(1)
      expect(res[2].uniqueValues.length).toEqual(2)
    })
  })

  //TODO - CASE 2.6 NEW REQUEST CONTAINS SOME NEW FIELDS FIELDS BUT ALL DIFFERENT VALUE FOR OLD FIELOS
  describe ("provided new request contains new fields and different values for all old fields", () => { 
    let newRequest ={ a: [2], b: [1], c: [3] } 
    it("should update the ranking of new fields", () => {
      let currentRank = [{name: 'a', rank: 1, uniqueValues: [1]}, {name: 'b', rank: 2, uniqueValues: [2]}]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("c"); 
      expect(res[1].name).toEqual("a");
      expect(res[2].name).toEqual("b");
      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      expect(res[0].uniqueValues.length).toEqual(1)
      expect(res[1].uniqueValues.length).toEqual(2) 
      expect(res[2].uniqueValues.length).toEqual(2)
    })
  })

  // TODO - CASE 2.7- NEW REQUEST CONTAINS ALL NEW FIELDS 
  describe("provided new request contains all new", () => {
    let newRequest = {c: [3], d: [4]}
    it("should update the ranking of new Fields", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1]}, 
        {name: 'b', rank: 2, uniqueValues: [2]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("a"); 
      expect(res[1].name).toEqual("b");
      expect(res[2].name).toEqual("c");
      expect(res[3].name).toEqual("d");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      expect(res[3].rank).toEqual(4) 
      
      expect(res[0].uniqueValues.length).toEqual(1)
      expect(res[1].uniqueValues.length).toEqual(1) 
      expect(res[2].uniqueValues.length).toEqual(1)
      expect(res[3].uniqueValues.length).toEqual(1)
    })
  })
})

// TODO - CASE 2 - NEW REQUEST WITH MANY PRIOR RECORDS
describe("when new request is input and many prior request is present", () => {
  // TODO - CASE 3.1 - NEW REQUEST CONTAINS SAME FIELDS AND VALUES AS OF PRIOR RECORDS
  describe("provided new request contains same fields as of prior records", () => {
    let newRequest = {a: [1], b:[2], c: [3]}
    it("should keep the same ranking as of before", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1,2]}, 
        {name: 'b', rank: 2, uniqueValues: [2,3]},
        {name: 'c', rank: 3, uniqueValues: [3,4]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("a"); 
      expect(res[1].name).toEqual("b");
      expect(res[2].name).toEqual("c");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      
      expect(res[0].uniqueValues.length).toEqual(2)
      expect(res[1].uniqueValues.length).toEqual(2) 
      expect(res[2].uniqueValues.length).toEqual(2)
    })
  })

  // TODO - CASE 3.2 - NEW REQUEST CONTAINS SAME FIELDS BUT SOME DIFFERENT VALUES AS OF PRIOR RECOR
  describe("provided new request contains same fields but different values for some of the old fields", () => {
    let newRequest = {a: [1], b:[6], c: [5]}
    it("should update the ranking", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1,2]}, 
        {name: 'b', rank: 2, uniqueValues: [2,3]},
        {name: 'c', rank: 3, uniqueValues: [2,3,4]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("a"); 
      expect(res[1].name).toEqual("b");
      expect(res[2].name).toEqual("c");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      
      expect(res[0].uniqueValues.length).toEqual(2)
      expect(res[1].uniqueValues.length).toEqual(3) 
      expect(res[2].uniqueValues.length).toEqual(4)
    })
  })

  // TODO - CASE 3.3 - NEW REQUEST CONTAINS SAME FIELDS BUT ALL DIFFERENT VALUES AS OF PRIOR RECORD
  describe("provided new request contains same fields but different values for all old fields", () => {
    let newRequest = {a: [3], b:[4], c: [5]}
    it("should update the ranking", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1,2]}, 
        {name: 'b', rank: 2, uniqueValues: [2,3]},
        {name: 'c', rank: 3, uniqueValues: [2,3,4]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("a"); 
      expect(res[1].name).toEqual("b");
      expect(res[2].name).toEqual("c");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      
      expect(res[0].uniqueValues.length).toEqual(3)
      expect(res[1].uniqueValues.length).toEqual(3) 
      expect(res[2].uniqueValues.length).toEqual(4)
    })
  })

  // TODO - CASE 3.4 - NEW REQUEST CONTAINS SOME NEW FIELDS BUT MATCHING VALUES FOR OLD FIELDS
  describe("provided new request contains new fields and matching values for old fields", () => {
    let newRequest = {a: [1], b:[2], c: [3], d: [4], e: [5]}
    it("should update the ranking", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1,2]}, 
        {name: 'b', rank: 2, uniqueValues: [2,3]},
        {name: 'c', rank: 3, uniqueValues: [2,3,4]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("d"); 
      expect(res[1].name).toEqual("e");
      expect(res[2].name).toEqual("a");
      expect(res[3].name).toEqual("b");
      expect(res[4].name).toEqual("c");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      expect(res[3].rank).toEqual(4) 
      expect(res[4].rank).toEqual(5) 
      
      expect(res[0].uniqueValues.length).toEqual(1)
      expect(res[1].uniqueValues.length).toEqual(1) 
      expect(res[2].uniqueValues.length).toEqual(2)
      expect(res[3].uniqueValues.length).toEqual(2)
      expect(res[4].uniqueValues.length).toEqual(3)
    })
  })

  // TODO - CASE 3.5 - NEW REQUEST CONTAINS SOME NEW FIELDS BUT SOME DIFFERENT VALUES FOR OLD FIELDS
  describe("provided new request contains some new fields and different values for some of the old fields", () => {
    let newRequest = {a: [3], b:[4], c: [3], d: [4], e: [5]}
    it("should update the ranking", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1,2]}, 
        {name: 'b', rank: 2, uniqueValues: [2,3]},
        {name: 'c', rank: 3, uniqueValues: [2,3,4]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("d"); 
      expect(res[1].name).toEqual("e");
      expect(res[2].name).toEqual("a");
      expect(res[3].name).toEqual("b");
      expect(res[4].name).toEqual("c");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      expect(res[3].rank).toEqual(4) 
      expect(res[4].rank).toEqual(5) 
      
      expect(res[0].uniqueValues.length).toEqual(1)
      expect(res[1].uniqueValues.length).toEqual(1) 
      expect(res[2].uniqueValues.length).toEqual(3)
      expect(res[3].uniqueValues.length).toEqual(3)
      expect(res[4].uniqueValues.length).toEqual(3)
    })
  })

  // TODO - CASE 3.6 - NEW REQUEST CONTAINS SOME NEW FIELDS BUT DIFFERENT VALUES FOR ALL OLD FIELDS
  describe("provided new request contains some new fields and different values for all old fields", () => {
    let newRequest = {a: [3], b:[4], c: [5], d: [4], e: [5]}
    it("should update the ranking", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1,2]}, 
        {name: 'b', rank: 2, uniqueValues: [2,3]},
        {name: 'c', rank: 3, uniqueValues: [2,3,4]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("d"); 
      expect(res[1].name).toEqual("e");
      expect(res[2].name).toEqual("a");
      expect(res[3].name).toEqual("b");
      expect(res[4].name).toEqual("c");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      expect(res[3].rank).toEqual(4) 
      expect(res[4].rank).toEqual(5) 
      
      expect(res[0].uniqueValues.length).toEqual(1)
      expect(res[1].uniqueValues.length).toEqual(1) 
      expect(res[2].uniqueValues.length).toEqual(3)
      expect(res[3].uniqueValues.length).toEqual(3)
      expect(res[4].uniqueValues.length).toEqual(4)
    })
  })

  // TODO - CASE 3.7 - NEW REQUEST CONTAINS ALL NEW FIELDS
  describe("provided new request contains all new fields", () => {
    let newRequest = {d: [4], e: [5]}
    it("should update the ranking", () => {
      let currentRank = [
        {name: 'a', rank: 1, uniqueValues: [1,2]}, 
        {name: 'b', rank: 2, uniqueValues: [2,3]},
        {name: 'c', rank: 3, uniqueValues: [2,3,4]}
      ]
      let res = app.rank(newRequest, currentRank)
      expect(res[0].name).toEqual("d"); 
      expect(res[1].name).toEqual("e");
      expect(res[2].name).toEqual("a");
      expect(res[3].name).toEqual("b");
      expect(res[4].name).toEqual("c");

      expect(res[0].rank).toEqual(1) 
      expect(res[1].rank).toEqual(2)
      expect(res[2].rank).toEqual(3) 
      expect(res[3].rank).toEqual(4) 
      expect(res[4].rank).toEqual(5) 
      
      expect(res[0].uniqueValues.length).toEqual(1)
      expect(res[1].uniqueValues.length).toEqual(1) 
      expect(res[2].uniqueValues.length).toEqual(2)
      expect(res[3].uniqueValues.length).toEqual(2)
      expect(res[4].uniqueValues.length).toEqual(3)
    })
  })

})