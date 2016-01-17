'use strict';

const Joi = require('Joi');
const mongo = require('../lib/db');
const throwjs = require('throw.js');

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
        mongo.get().collection('resources')
          .findOne(
          {
            _id: params.id
          },
          (findErr, model) => {
            if (findErr) {
              next(findErr);
            } else {
              if (!model) {
                next(new throwjs.notFound());
              } else {
                res.json(model);
              }
            }
          });
      }
    });
};

module.exports.get = (req, res, next) => {
  mongo.get().collection('resources')
    .find({})
    .toArray((err, data) => {
      if (err) {
        next(err);
      } else {
        res.json(data);
      }
    });
};

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
        mongo.get().collection('resources')
          .insert(body, (insertErr) => {
            if (insertErr) {
              next(insertErr);
            } else {
              res.status(201).json(body);
            }
          });
      }
    });
};

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
              mongo.get().collection('resources')
                .findOne({
                  _id: params.id
                }, (findOneErr, model) => {
                  if (findOneErr) {
                    next(findOneErr);
                  } else {
                    if (!model) {
                      next(new throwjs.notFound());
                    } else {
                      mongo.get().collection('resources')
                        .update(
                        {
                          _id: params.id
                        },
                        {
                          name: body.name
                        },
                        (updateErr) => {
                          if (updateErr) {
                            next(updateErr);
                          } else {
                            const resource = model;
                            resource.name = body.name;
                            res.status(200).json(resource);
                          }
                        });
                    }
                  }
                });
            }
          });
      }
    });
};

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
        mongo.get().collection('resources')
          .findOne({
            _id: params.id
          }, (findOneErr, model) => {
            if (findOneErr) {
              next(findOneErr);
            } else {
              if (!model) {
                next(new throwjs.notFound());
              } else {
                mongo.get().collection('resources')
                  .remove(
                  {
                    _id: params.id
                  },
                  (removeErr) => {
                    if (removeErr) {
                      next(removeErr);
                    } else {
                      res.json({});
                    }
                  });
              }
            }
          });
      }
    });
};
