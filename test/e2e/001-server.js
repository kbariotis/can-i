const request = require('supertest');

describe('Server', () => {
  it('Got up successfully', (done) => {
    request('http://localhost:3001')
      .get('/')
      .expect(405, done);
  });
});
