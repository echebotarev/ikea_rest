const { MongoClient } = require('mongodb');

const assert = require('assert');
const config = require('./config');

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
  },

  find(ids) {
    return new Promise((res, rej) => {
      Client.db.collection(config.get('mongo:productCollectionName')).find({
        $or: ids
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
MongoClient.connect(
  config.get('mongo:uri'),
  { useUnifiedTopology: true },
  (err, client) => {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    Client.db = client.db(config.get('mongo:dbname'));
    Client.db
      .collection(config.get('mongo:productCollectionName'))
      .createIndex(
        { identifier: 1 }
      );
  }
);

module.exports = Client;
