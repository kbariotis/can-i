'use strict';

const request = require('supertest');
const expect = require('should');

describe('Roles', () => {
  let id;

  it('Get all', (done) => {
    request('http://localhost:3001')
      .get('/v1/roles')
      .expect(200)
      .end((err, res) => {
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('Post a new Role', (done) => {
    request('http://localhost:3001')
      .post('/v1/roles')
      .send({
        _id: 'user',
        name: 'User'
      })
      .expect(201)
      .end((err, res) => {
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        id = res.body._id;
        done();
      });
  });

  it('Deny posting a duplicated Role', (done) => {
    request('http://localhost:3001')
      .post('/v1/roles')
      .send({
        _id: 'user',
        name: 'User'
      })
      .expect(409, done);
  });

  it('Get One', (done) => {
    request('http://localhost:3001')
      .get('/v1/roles/' + id)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        done();
      });
  });

  it('Put', (done) => {
    request('http://localhost:3001')
      .post('/v1/roles/' + id)
      .send({
        name: 'User Updated'
      })
      .expect(201)
      .end((err, res) => {
        res.body.should.have.property('name');
        done();
      });
  });

  it('Put on unknown ID', (done) => {
    request('http://localhost:3001')
      .post('/v1/roles/566899386a470f5d1714945a')
      .send({
        name: 'User Updated'
      })
      .expect(404, done);
  });

  it('Delete', (done) => {
    request('http://localhost:3001')
      .delete('/v1/roles/' + id)
      .expect(200, done);
  });
});
