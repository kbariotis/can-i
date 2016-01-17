'use strict';

const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');
const throwjs = require('throw.js');

router
  .get('/v1/roles/:id', require('../controllers/roles').getOne)
  .get('/v1/roles', require('../controllers/roles').get)
  .post('/v1/roles', require('../controllers/roles').post)
  .post('/v1/roles/:id', require('../controllers/roles').put)
  .delete('/v1/roles/:id', require('../controllers/roles').del);

router
  .get('/v1/resources/:id', require('../controllers/resources').getOne)
  .get('/v1/resources', require('../controllers/resources').get)
  .post('/v1/resources', require('../controllers/resources').post)
  .post('/v1/resources/:id', require('../controllers/resources').put)
  .delete('/v1/resources/:id', require('../controllers/resources').del);

router
  .get('/v1/permissions/:roleId', require('../controllers/permissions').getAllowedPermissions)
  .get('/v1/permissions/:roleId/:resourceId', require('../controllers/permissions').isAllowed)
  .post('/v1/permissions/:roleId/:resourceId', require('../controllers/permissions').allow)
  .post('/v1/permissions/:roleId/', require('../controllers/permissions').allow)
  .delete('/v1/permissions/:roleId/:resourceId', require('../controllers/permissions').disallow)
  .delete('/v1/permissions/:roleId', require('../controllers/permissions').disallow);

router
  .use('*', (req, res, next) => {
    logger.error('Method not allowed: ');
    next(new throwjs.methodNotAllowed());
  });

router
  .use((err, req, res, next) => {
    logger.error(err);

    if (req.app.get('env') !== 'development' &&
        req.app.get('env') !== 'test') {
      delete err.stack;
    }

    res.status(err.statusCode || 500).json(err);
  });

module.exports = router;
