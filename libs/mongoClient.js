const { MongoClient } = require('mongodb');

const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/ikea';

const Client = {
  db: null,
  findOne(id, type) {
    return new Promise((res, rej) => {
      Client.db.collection('ikea_spider').find({
        itemType: type,
        identifier: id
      }).toArray((err, docs) => {
        if (err) {
          return rej(err);
        }

        return res(docs);
      });
    });
  }
};

// Use connect method to connect to the server
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  Client.db = db;
});

module.exports = Client;
