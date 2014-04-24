var path = require('path');
var config = require('../lib/config/config');
var winston = require('winston');
module.exports = function(filename) {
  if ('undefined' === typeof filename) filename = config.log.logfilename;
  console.log('[logger] filename='+filename+', process.env.NODE_ENV='+process.env.NODE_ENV);
  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level : config.log.loglevel
      }),
      new winston.transports.File({
        level : config.log.loglevel,
        json : false,
        filename : filename,
        datePattern: 'yyyy-MM-dd.log'
      })
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename : config.log.errfilename
      })
    ]
  });
  //logger.setLevels(winston.config.syslog.levels);
  logger.exitOnError = false;
  return logger;
};

