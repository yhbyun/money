'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest');

describe('GET /api/v1/moneybooks', function() {
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
});
describe('POST /api/v1/moneybooks', function() {
  it('should respond with status', function(done) {
    request(app)
      .post('/api/v1/moneybooks')
      .send({ member_id: '1', item: 'water', amount: '1200', date: '2014-04-21'})
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
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
        console.log('[test_moneybook] PUT res.text='+res.text); 
        done();
      });
  });
});

describe('DELETE /api/v1/moneybooks/:id', function() {
  var test_id = 1000;
  /*
  before(function(done) {
    request(app)
      .post('/api/v1/moneybooks')
      .send({ member_id: '1', item: 'item to delete', amount: '1200', date: new Date()})
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('status', 'ok');
        console.log('[test_moneybook] DELETE before res.text='+res.text);
        test_id = res.id;
        done();
      });
  });
  */
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
