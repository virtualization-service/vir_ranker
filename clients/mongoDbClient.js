const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DB_CONNECTION_STRING
//const uri = "mongodb://lrqi_db:lrqi_db_pwd@lrqidb-shard-00-00-wksjy.mongodb.net:27017,lrqidb-shard-00-01-wksjy.mongodb.net:27017,lrqidb-shard-00-02-wksjy.mongodb.net:27017/test?ssl=true&replicaSet=LRQIDB-shard-0&authSource=admin&retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const fetchCollection = async function (operation,collectionName) {
  let filter = { 'operation': operation };
  let projection = {
    '_id': 0
  };
  await client.connect().catch(err => { console.log(err); });
  if (!client) {
    return;
  } 
  let db = client.db("tms_logs_D");
  const collection = db.collection(collectionName);
  const response = await collection.find(filter, { projection: projection }).toArray();
  return JSON.stringify(response);
};

module.exports = {
  fetchCollection
}