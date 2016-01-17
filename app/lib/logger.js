'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      humanReadableUnhandledException: true,
      json: false
    }),
    new (require('winston-daily-rotate-file'))({
      level: 'info',
      filename: './logs/logs.log',
      colorize: true,
      json: false,
      humanReadableUnhandledException: true
    })
  ]
});

module.exports = logger;
