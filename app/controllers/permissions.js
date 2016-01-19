'use strict';

const Joi = require('Joi');
const mongo = require('../lib/db');
const throwjs = require('throw.js');
const BPromise = require('bluebird');
const RolesService = require('../services/roles');
const ResourcesService = require('../services/resources');

/**
 * Get allowed Resources for a given Role
 */
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
        RolesService.getOne(params.id)
          .then((role) => {
            mongo.get().collection('permissions')
              .find(
              {
                role_id: role._id
              },
              (findResourcesErr, resources) => {
                if (findResourcesErr) {
                  next(findResourcesErr);
                } else {
                  res.json(resources);
                }
              });
          })
          .catch(next);
      }
    });
};

/**
 * Determine if the given Role has access to the specific Resource
 */
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

/**
 * Allow a Role to have access to specific Resources
 */
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
          BPromise.join(
            RolesService.getOne(params.roleId),
            ResourcesService.getOne(params.resourceId)
          )
            .spread((role, resource) => {
              mongo.get().collection('permissions')
                .insert(
                {
                  role_id: role._id,
                  resource_id: resource._id
                },
                (insertErr) => {
                  if (insertErr) {
                    next(insertErr);
                  } else {
                    res.json();
                  }
                });
            })
            .catch(next);
        } else {
          Joi.validate(
            req.body,
            Joi.array().items(Joi.string()),
            (bodyValidationErr, body) => {
              if (bodyValidationErr) {
                next(bodyValidationErr);
              } else {
                RolesService.getOne(params.roleId)
                  .then(() => {
                    return BPromise
                      .map(body, ResourcesService.getOne);
                  })
                  .each((resource) => {
                    return new BPromise((resolve, reject) => {
                      mongo.get().collection('permissions')
                        .insert(
                        {
                          role_id: params.roleId,
                          resource_id: resource._id
                        },
                        (removeErr) => {
                          if (removeErr) {
                            reject(removeErr);
                          } else {
                            res.json({});
                          }
                        }
                      );
                    });
                  })
                  .catch(next);
              }
            });
        }
      }
    });
};

/**
 * Revoke access from Role to the specific Resources
 */
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
          BPromise.join(
            RolesService.getOne(params.roleId),
            ResourcesService.getOne(params.resourceId)
          )
            .spread((role, resource) => {
              mongo.get().collection('permissions')
                .remove(
                {
                  role_id: role._id,
                  resource_id: resource._id
                },
                (removeErr) => {
                  if (removeErr) {
                    next(removeErr);
                  } else {
                    res.json({});
                  }
                });
            })
            .catch(next);
        } else {
          Joi.validate(
            req.body,
            Joi.array().items(Joi.string()),
            (bodyValidationErr, body) => {
              if (bodyValidationErr) {
                next(bodyValidationErr);
              } else {
                RolesService.getOne(params.roleId)
                  .then(() => {
                    return BPromise
                      .map(body, ResourcesService.getOne);
                  })
                  .then(() => {
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
                          res.json({});
                        }
                      }
                    );
                  })
                  .catch(next);
              }
            });
        }
      }
    });
};
