'use strict';

var mysql = require('mysql'),
    config = require('./config'),
    pool = mysql.createPool({
      host : config.db.mysql.host,
      user : config.db.mysql.user,
      password : config.db.mysql.password,
      database : config.db.mysql.database
    });

/**
 * mysql configuration
 */
module.exports = function(app) {
  app.configure('development', function(){
    app.use(function(req, res, next) {
      req.mysql = pool;
      next();
    });
  });

  app.configure('production', function(){

  });
};