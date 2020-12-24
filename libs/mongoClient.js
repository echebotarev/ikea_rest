const { MongoClient } = require('mongodb');

const dayjs = require('dayjs');

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

  /**
   * [{ identifier: [id] }, ...]
   * */
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
  },

  get(type) {
    return new Promise((res, rej) => {
      Client.db.collection(config.get('mongo:productCollectionName')).find({
        itemType: type
      }).toArray((err, docs) => {
        if (err) {
          return rej(err);
        }

        return res(docs);
      });
    });
  }
};

function getDbName(shift = 0, dbs) {
  const date = dayjs().subtract(shift * 24, 'hour').format('DDMMYYYY');
  const db = dbs.find(dbItem => dbItem.name.includes(date));

  if (db) {
    return db.name;
  }

  return getDbName(shift + 1, dbs);
}

// Use connect method to connect to the server
MongoClient.connect(
  config.get('mongo:uri'),
  { useUnifiedTopology: true },
  async (err, client) => {
    assert.equal(null, err);
    console.log('Connected successfully to Base');

    const listDbs = await client.db('Test').admin().listDatabases();
    const dbname = getDbName(0, listDbs.databases);

    Client.db = client.db(dbname);

    Client.db
      .collection(config.get('mongo:productCollectionName'))
      .createIndex(
        { identifier: 1 }
      );
  }
);

module.exports = Client;
