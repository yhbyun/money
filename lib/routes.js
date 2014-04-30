'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

var moneybookHandler = require('./routes/moneybook');

var userHandler = require('./routes/user');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  
  // moneybook
  app.get('/api/v1/moneybooks', moneybookHandler.get);
  app.post('/api/v1/moneybooks', moneybookHandler.post);
  app.put('/api/v1/moneybooks/:id', moneybookHandler.put);
  app.delete('/api/v1/moneybooks/:id', moneybookHandler.delete);

  app.get('/api/v1/state-months', moneybookHandler.getStateMonths);
  app.get('/api/v1/auto-items', moneybookHandler.getAutoItems);

  // add user
  app.post('/api/v1/users', userHandler.post);
  app.put('/api/v1/users/:id', userHandler.put);


  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
