'use strict';

process.env.NODE_ENV = 'test';

var Logger = require('../../../lib/logger');
var log = new Logger();

var should = require('should'),
    assert = require("assert"),
    app = require('../../../server'),
    request = require('supertest');

describe('POST /api/v1/users-login', function() {
  it('should respond with status', function(done) {
    request(app)
      .post('/api/v1/users-login')
      .send({ email: 'jhkim@ecplaza.net', password: 'ybE8a6K'})
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        log.debug('[users-login].........res.text='+res.text);
        res.text.should.include('status', 'ok');
        log.debug('[users-login] end... request.headers.cookie='+request.headers);
        done();
      });
  });
});
