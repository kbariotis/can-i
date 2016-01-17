'use strict';

const server = require('http').createServer();
const app = require('./app/server');
const connection = require('./app/lib/db');
const logger = require('./app/lib/logger');
const config = require('./config/env.json')[process.env.NODE_ENV || 'development'];
const BPromise = require('bluebird');

const boot = () => {
  return new BPromise((resolve, reject) => {
    connection.init()
      .then(() => {
        server.on('request', app);
        server.on('error', (err) => {
          reject(err);
        });
        server.listen(config.port, () => {
          logger.info('Listening on ' + server.address().port);
          resolve();
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = boot();
