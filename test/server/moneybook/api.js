'use strict';

process.env.NODE_ENV = 'test';

var Logger = require('../../../lib/logger');
var log = new Logger();

var should = require('should'),
    assert = require("assert"),
    app = require('../../../server'),
    request = require('supertest');

describe('GET /api/v1/moneybooks', function() {
/*
  it('should respond with status', function(done) {
    request(app)
      .get('/api/v1/moneybooks')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('status', 'ok');
        done();
      });
  });
*/
  it('should size of result same as page_size parameter', function(done) {
    request(app)
      .get('/api/v1/moneybooks?page_size=3&page_no=')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('status', 'ok');
        var data = JSON.parse(res.text).results.data;
        log.debug('.........res.text='+res.text);
        assert.equal(3, data.length);
        done();
      });
  });
});
/*
describe('POST /api/v1/moneybooks', function() {
  it('should respond with status', function(done) {
    request(app)
      .post('/api/v1/moneybooks')
      .send({ member_id: '1', item: 'water', amount: '1200', date: '2014-04-21'})
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        log.debug('.........res.text='+res.text);
       res.text.should.include('status', 'ok');
        done();
      });
  });
});
describe('PUT /api/v1/moneybooks/:id', function() {
  it('should respond with status', function(done) {
    request(app)
      .put('/api/v1/moneybooks/3')
      .send({ id: '3', member_id: '1', item: 'water(big)', amount: '2300', date: '2014-04-20'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('status', 'ok');
        log.debug('[test_moneybook] PUT res.text='+res.text); 
        done();
      });
  });
});
describe('DELETE /api/v1/moneybooks/:id', function() {
  var test_id = 1000;
  before(function(done) {
    request(app)
      .post('/api/v1/moneybooks')
      .send({ member_id: '1', item: 'item to delete', amount: '1200', date: new Date()})
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('status', 'ok');

        var res_text = JSON.parse(res.text);
        test_id = res_text.results.id;
        done();
      });
  });
  it('should respond with status', function(done) {
    request(app)
      .del('/api/v1/moneybooks/'+test_id)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('status', 'ok');
        done();
      });
  });
});
describe('GET /api/v1/auto-items', function() {
  it('should respond with status', function(done) {
    request(app)
      .get('/api/v1/auto-items?q=orange')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('status', 'ok');
        done();
      });
  });
  it('should respond with status fail', function(done) {
    request(app)
      .get('/api/v1/auto-items') // without q parameter !!
      .expect(200)
      .end(function(err, res) {
       if (err) return done(err);
        res.text.should.include('status', 'fail');
        done();
    });
  });
});
describe('GET /api/v1/state-months', function() {
  it('should respond with status', function(done) {
    request(app)
      .get('/api/v1/state-months?q=orange&page_size=2')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        log.debug('.........res.text='+res.text);
        res.text.should.include('status', 'ok');
        done();
      });
  });
  it('should respond with status', function(done) {
    request(app)
      .get('/api/v1/state-months') // without q parameter !!
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        log.debug('.........res.text='+res.text);
        res.text.should.include('status', 'ok');
        done();
    });
  });
});
*/