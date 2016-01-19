'use strict';

const mongo = require('../lib/db');
const throwjs = require('throw.js');
const BPromise = require('bluebird');

class RolesService {

  getAll () {
    return new BPromise((resolve, reject) => {
      mongo.get().collection('roles')
        .find({})
        .toArray((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
    });
  }

  getOne (_id) {
    return new BPromise((resolve, reject) => {
      mongo.get().collection('roles')
        .findOne(
        {
          _id
        },
        (findErr, data) => {
          if (findErr) {
            reject(findErr);
          } else {
            if (data) {
              resolve(data);
            } else {
              reject(new throwjs.notFound());
            }
          }
        });
    });
  }

  update (_id, data) {
    return new Promise((resolve, reject) => {
      mongo.get().collection('roles')
        .findOne({
          _id
        }, (findOneErr, model) => {
          if (findOneErr) {
            reject(findOneErr);
          } else {
            if (!model) {
              reject(new throwjs.notFound());
            } else {
              mongo.get().collection('roles')
                .update(
                {
                  _id
                },
                {
                  name: data.name
                },
                (updateErr) => {
                  if (updateErr) {
                    reject(updateErr);
                  } else {
                    const role = model;
                    role.name = data.name;
                    resolve(role);
                  }
                });
            }
          }
        });
    });
  }

  remove (_id) {
    return new Promise((resolve, reject) => {
      mongo.get().collection('roles')
        .findOne({
          _id
        }, (findOneErr, model) => {
          if (findOneErr) {
            reject(findOneErr);
          } else {
            if (!model) {
              reject(new throwjs.notFound());
            } else {
              mongo.get().collection('roles')
                .remove(
                {
                  _id
                },
                (removeErr) => {
                  if (removeErr) {
                    reject(removeErr);
                  } else {
                    resolve({});
                  }
                });
            }
          }
        });
    });
  }

  create (data) {
    return new Promise((resolve, reject) => {
      mongo.get().collection('roles')
        .findOne({
          _id: data._id
        }, (findOneErr, model) => {
          if (findOneErr) {
            reject(findOneErr);
          } else {
            if (model) {
              reject(new throwjs.conflict());
            } else {
              mongo.get().collection('roles')
                .insert(data, (insertErr) => {
                  if (insertErr) {
                    reject(insertErr);
                  } else {
                    resolve(data);
                  }
                });
            }
          }
        });
    });
  }
}

module.exports = new RolesService();