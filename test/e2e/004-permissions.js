'use strict';

const request = require('supertest');
const expect = require('should');

describe('Resources', () => {
  let roleId;
  let resourceId;

  before((done) => {
    request('http://localhost:3001')
      .post('/v1/roles')
      .send({
        _id: 'user',
        name: 'User'
      })
      .expect(201)
      .end((err, res) => {
        roleId = res.body._id;

        request('http://localhost:3001')
          .post('/v1/resources')
          .send({
            _id: 'access_admin_area',
            name: 'Access Admin Area'
          })
          .expect(201)
          .end((err, res) => {
            resourceId = res.body._id;

            done(err);
          });
      });
  });

  it('Allow User to Access Admin Area', (done) => {
    request('http://localhost:3001')
      .post('/v1/permissions/' + roleId + '/' + resourceId)
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });

  it('Disallow User to Access Admin Area', (done) => {
    request('http://localhost:3001')
      .delete('/v1/permissions/' + roleId + '/' + resourceId)
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });

  it('Allow User to Access Admin Area (passed in the body)', (done) => {
    request('http://localhost:3001')
      .post('/v1/permissions/' + roleId)
      .send([resourceId])
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });

  it('Disallow User to Access Admin Area (passed in the body)', (done) => {
    request('http://localhost:3001')
      .delete('/v1/permissions/' + roleId)
      .send([resourceId])
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });

  after((done) => {
    request('http://localhost:3001')
      .delete('/v1/roles/' + roleId)
      .expect(201)
      .end((err, res) => {
        request('http://localhost:3001')
          .delete('/v1/resources/' + resourceId)
          .expect(200, done);
      });
  });
});
