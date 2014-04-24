'use strict';

var path = require('path');
module.exports = {
  env: 'production',
  log: {
    loglevel: 'info', // debug, info, notice, warning, error, crit, alert, emerge
    logfilename: path.resolve(__dirname, '../../../logs/money-prd.log'),
    errfilename: path.resolve(__dirname, '../../../logs/money-prd-error.log'),
  }};