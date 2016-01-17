'use strict';

const Joi = require('Joi');
const mongo = require('../lib/db');
const throwjs = require('throw.js');
const BPromise = require('bluebird');

module.exports.getAllowedPermissions = (req, res, next) => {
  Joi.validate(
    req.params,
    Joi.object().keys({
      roleId: Joi.string().required()
    }),
    (validationErr, params) => {
      if (validationErr) {
        next(validationErr);
      } else {
        mongo.get().collection('permissions')
          .find(
          {
            role_id: params.roleId
          },
          (findErr, data) => {
            if (findErr) {
              next(findErr);
            } else {
              res.json(data);
            }
          });
      }
    });
};

module.exports.isAllowed = (req, res, next) => {
  Joi.validate(
    req.params,
    Joi.object().keys({
      roleId: Joi.string().required(),
      resourceId: Joi.string().required()
    }),
    (validationErr, params) => {
      if (validationErr) {
        next(validationErr);
      } else {
        mongo.get().collection('permissions')
          .findOne(
          {
            role_id: params.roleId,
            resource_id: params.resourceId
          },
          (findErr, data) => {
            if (findErr) {
              next(findErr);
            } else {
              if (data) {
                res.json(data);
              } else {
                next(new throwjs.notFound());
              }
            }
          });
      }
    });
};

module.exports.allow = (req, res, next) => {
  Joi.validate(
    req.params,
    Joi.object().keys({
      roleId: Joi.string().required(),
      resourceId: Joi.string()
    }),
    (validationErr, params) => {
      if (validationErr) {
        next(validationErr);
      } else {
        if (params.resourceId) {
          mongo.get().collection('permissions')
            .insert(
            {
              role_id: params.roleId,
              resource_id: params.resourceId
            },
            (insertErr) => {
              if (insertErr) {
                next(insertErr);
              } else {
                res.json();
              }
            });
        } else {
          Joi.validate(
            req.body,
            Joi.array().items(Joi.string()),
            (bodyValidationErr, body) => {
              if (bodyValidationErr) {
                next(bodyValidationErr);
              } else {
                BPromise
                  .map(body, (resourceId) => {
                    return new BPromise((resolve, reject) => {
                      mongo.get().collection('permissions')
                        .insert(
                        {
                          role_id: params.roleId,
                          resource_id: resourceId
                        },
                        (removeErr) => {
                          if (removeErr) {
                            reject(removeErr);
                          } else {
                            resolve();
                          }
                        }
                      );
                    });
                  })
                  .then(() => {
                    res.json();
                  })
                  .catch((err) => {
                    next(err);
                  });
              }
            });
        }
      }
    });
};

module.exports.disallow = (req, res, next) => {
  Joi.validate(
    req.params,
    Joi.object().keys({
      roleId: Joi.string().required(),
      resourceId: Joi.string()
    }),
    (validationErr, params) => {
      if (validationErr) {
        next(validationErr);
      } else {
        if (params.resourceId) {
          mongo.get().collection('permissions')
            .remove(
            {
              role_id: params.roleId,
              resource_id: params.resourceId
            },
            (removeErr) => {
              if (removeErr) {
                next(removeErr);
              } else {
                res.json();
              }
            });
        } else {
          Joi.validate(
            req.body,
            Joi.array().items(Joi.string()),
            (bodyValidationErr, body) => {
              if (bodyValidationErr) {
                next(bodyValidationErr);
              } else {
                mongo.get().collection('permissions')
                  .remove(
                  {
                    role_id: params.roleId,
                    resource_id: {
                      $in: body
                    }
                  },
                  (removeErr) => {
                    if (removeErr) {
                      next(removeErr);
                    } else {
                      res.json();
                    }
                  }
                );
              }
            });
        }
      }
    });
};
