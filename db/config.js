const MongoClient = require('mongodb').MongoClient;

const MongoURL= 'mongodb://127.0.0.1:27017/';

const client = new MongoClient(MongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

module.exports = client;

