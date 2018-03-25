'use strict';

var winston = require('winston');

var config = winston.config;
var logger = new winston.Logger({
  transports: [new winston.transports.Console({
    timestamp: function timestamp() {
      return new Date(Date.now()).toISOString().substr(0, 22).replace('T', ' ');
    },
    formatter: function formatter(options) {
      return options.timestamp() + ' ' + config.colorize(options.level, options.level.toUpperCase()) + ' ' + (options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
    }
  })]
});

module.exports = logger;