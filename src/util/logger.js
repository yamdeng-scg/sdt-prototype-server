'use strict';

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// };

const config = require('../config/config');
const process = require('process');
const isDevRun = process.env.NODE_ENV === 'production' ? false : true;
const chalk = require('chalk');
const winston = require('winston');

let logFileName = config.LOG_FILE_NAME;
if (process.env.LOG_FILE_NAME) {
  logFileName = process.env.LOG_FILE_NAME;
}

// fileLogTransport
const DailyRotateFile = require('winston-daily-rotate-file');
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      datePattern: '',
      filename: logFileName + '.%DATE%',
      maxSize: config.LOG_MAX_FILE_SIZE,
      maxFiles: config.LOG_MAX_FILE_COUNT
    })
  ]
});

module.exports = {
  debug: function (message) {
    logger.log({
      level: 'debug',
      message: message
    });
    if (isDevRun) {
      console.log(chalk.blue(message));
    }
  },
  info: function (message) {
    logger.log({
      level: 'info',
      message: message
    });
    if (isDevRun) {
      console.log(chalk.green(message));
    }
  },
  warn: function (message) {
    logger.log({
      level: 'warn',
      message: message
    });
    if (isDevRun) {
      console.log(chalk.yellow(message));
    }
  },
  error: function (message) {
    logger.log({
      level: 'error',
      message: message
    });
    if (isDevRun) {
      console.log(chalk.red(message));
    }
  }
};
