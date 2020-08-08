const { MongoClient } = require('mongodb');
const uri = "mongodb://lrqi_db:lrqi_db_pwd@lrqidb-shard-00-00-wksjy.mongodb.net:27017,lrqidb-shard-00-01-wksjy.mongodb.net:27017,lrqidb-shard-00-02-wksjy.mongodb.net:27017/test?ssl=true&replicaSet=LRQIDB-shard-0&authSource=admin&retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const findRank = async function (operation) {
  const filter = { 'operation': operation };
  const projection = {
    '_id': 0
  };
  await client.connect().catch(err => { console.log(err); });
  if (!client) {
    return;
  } 
  let db = client.db("tms_logs_D");
  const collection = db.collection('rankers');
  console.log('Collection')
  const response = await collection.find(filter, { projection: projection }).toArray();
  return JSON.stringify(response);
};

module.exports = {
  findRank
}