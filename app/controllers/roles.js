'use strict';

const Joi = require('Joi');
const RolesService = require('../services/roles');

/**
 * Get the specific Role
 */
module.exports.getOne = (req, res, next) => {
  Joi.validate(
    req.params,
    Joi.object().keys({
      id: Joi.string().required()
    }),
    (validationErr, params) => {
      if (validationErr) {
        next(validationErr);
      } else {
        RolesService.getOne(params.id)
          .then((results) => res.json(results))
          .catch(next);
      }
    });
};

/**
 * Get all Resources
 */
module.exports.get = (req, res, next) => {
  RolesService.getAll()
    .then((data) => res.json(data))
    .catch(next);
};

/**
 * Create a new Role
 */
module.exports.post = (req, res, next) => {
  Joi.validate(
    req.body,
    Joi.object().keys({
      _id: Joi.string().required(),
      name: Joi.string().required()
    }),
    (validationErr, body) => {
      if (validationErr) {
        next(validationErr);
      } else {
        RolesService.create(body)
          .then((data) => res.status(201).json(data))
          .catch(next);
      }
    });
};

/**
 * Update Role
 */
module.exports.put = (req, res, next) => {
  Joi.validate(
    req.params,
    Joi.object().keys({
      id: Joi.string().required()
    }),
    (err, params) => {
      if (err) {
        next(err);
      } else {
        Joi.validate(
          req.body,
          Joi.object().keys({
            name: Joi.string().required()
          }),
          (validationErr, body) => {
            if (validationErr) {
              next(validationErr);
            } else {
              RolesService.update(params.id, body)
                .then((data) => res.json(data))
                .catch(next);
            }
          });
      }
    });
};

/**
 * Delete the specific Role
 */
module.exports.del = (req, res, next) => {
  Joi.validate(
    req.params,
    Joi.object().keys({
      id: Joi.string().required()
    }),
    (validationErr, params) => {
      if (validationErr) {
        next(validationErr);
      } else {
        RolesService.remove(params.id)
          .then((data) => res.json(data))
          .catch(next);
      }
    });
};
