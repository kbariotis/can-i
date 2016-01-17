'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');

app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    res.type('image/x-icon').end();
  } else {
    next();
  }
});

app.use(compression());

app.use(morgan(':date :method :url :status :response-time ms'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('./routes/api'));

module.exports = app;
