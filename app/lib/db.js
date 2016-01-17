'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../../config/env.json')[process.env.NODE_ENV || 'development'];
const url = config.db.uri;

const Connection = () => {};

module.exports = Connection;

Connection.get = () => {
  if (typeof Connection.db === 'undefined') {
    return Connection.init();
  }
  return Connection.db;
};

Connection.init = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        Connection.db = conn;
        resolve(conn);
      }
    });
  });
};