'use strict';

const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');
const throwjs = require('throw.js');
const roles = require('../controllers/roles');
const resources = require('../controllers/resources');
const permissions = require('../controllers/permissions');

router
  .get('/v1/roles/:id', roles.getOne)
  .get('/v1/roles', roles.get)
  .post('/v1/roles', roles.post)
  .post('/v1/roles/:id', roles.put)
  .delete('/v1/roles/:id', roles.del);

router
  .get('/v1/resources/:id', resources.getOne)
  .get('/v1/resources', resources.get)
  .post('/v1/resources', resources.post)
  .post('/v1/resources/:id', resources.put)
  .delete('/v1/resources/:id', resources.del);

router
  .get('/v1/permissions/:roleId', permissions.getAllowedPermissions)
  .get('/v1/permissions/:roleId/:resourceId', permissions.isAllowed)
  .post('/v1/permissions/:roleId/:resourceId', permissions.allow)
  .post('/v1/permissions/:roleId/', permissions.allow)
  .delete('/v1/permissions/:roleId/:resourceId', permissions.disallow)
  .delete('/v1/permissions/:roleId', permissions.disallow);

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
