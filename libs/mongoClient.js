const { MongoClient } = require('mongodb');

const assert = require('assert');
const config = require('./config');

// Connection URL
const url = config.get('mongo:uri');

const Client = {
  db: null,
  findOne(id, type) {
    return new Promise((res, rej) => {
      Client.db.collection(config.get('mongo:productCollectionName')).find({
        itemType: type,
        identifier: id
      }).toArray((err, docs) => {
        if (err) {
          return rej(err);
        }

        return res(docs[0]);
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
