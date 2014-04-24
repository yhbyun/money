'use strict';

var path = require('path');
module.exports = {
  env: 'test',
  db: {
    mysql: {
      host : '192.168.33.21',
      user : 'root',
      password : 'root',
      database : 'moneybook'
    }
  },
  log: {
    loglevel: 'debug', // debug, info, notice, warning, error, crit, alert, emerge
    logfilename: path.resolve(__dirname, '../../../logs/money-test.log'),
    errfilename: path.resolve(__dirname, '../../../logs/money-test-error.log'),
  }
};