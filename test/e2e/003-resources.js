'use strict';

const request = require('supertest');
const expect = require('should');

describe('Resources', () => {
  let id;

  it('Get all', (done) => {
    request('http://localhost:3001')
      .get('/v1/resources')
      .expect(200)
      .end((err, res) => {
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('Post a new Resource', (done) => {
    request('http://localhost:3001')
      .post('/v1/resources')
      .send({
        _id: 'access_admin_area',
        name: 'Access Admin Area'
      })
      .expect(201)
      .end((err, res) => {
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        id = res.body._id;
        done();
      });
  });

  it('Get One', (done) => {
    request('http://localhost:3001')
      .get('/v1/resources/' + id)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        done();
      });
  });

  it('Put', (done) => {
    request('http://localhost:3001')
      .post('/v1/resources/' + id)
      .send({
        name: 'Access Configuration'
      })
      .expect(201)
      .end((err, res) => {
        res.body.should.have.property('name');
        done();
      });
  });

  it('Put on unknown ID', (done) => {
    request('http://localhost:3001')
      .post('/v1/resources/566899386a470f5d1714945a')
      .send({
        name: 'Access Configuration'
      })
      .expect(404, done);
  });

  it('Delete', (done) => {
    request('http://localhost:3001')
      .delete('/v1/resources/' + id)
      .expect(200, done);
  });
});
