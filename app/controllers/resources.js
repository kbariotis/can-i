'use strict';

const Joi = require('Joi');
const ResourcesService = require('../services/resources');

/**
 * Get the specific Resource
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
        ResourcesService.getOne(params.id)
          .then((results) => res.json(results))
          .catch(next);
      }
    });
};

/**
 * Get all Resources
 */
module.exports.get = (req, res, next) => {
  ResourcesService.getAll()
    .then((results) => res.json(results))
    .catch(next);
};

/**
 * Create a new Resource
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
        ResourcesService.create(body)
          .then((results) => res.status(201).json(results))
          .catch(next);
      }
    });
};

/**
 * Update Resource
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
              ResourcesService.update(params.id, body)
                .then((results) => res.json(results))
                .catch(next);
            }
          });
      }
    });
};

/**
 * Delete the specific Resource
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
        ResourcesService.remove(params.id)
          .then((results) => res.json(results))
          .catch(next);
      }
    });
};
