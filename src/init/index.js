'use strict';

// const CONFIG = require('../config');
// const os = require('os');
// const process = require('process');
const logger = require('../util/logger');
const dbService = require('../service/db');
// const mailService = require('../service/mail');
// const taskService = require('../service/task');
// const initDataInsert = require('./initDataInsert');

let gcManual = function () {
  setTimeout(() => {
    // logger.info('first gc : ' + global.gc);
    if (global && global.gc) {
      logger.info('first gc call');
      global.gc();
    }
    setTimeout(() => {
      // logger.info('second gc : ' + global.gc);
      if (global && global.gc) {
        logger.info('second gc call');
        global.gc();
      }
      setInterval(() => {
        // logger.info('gc : ' + global.gc);
        if (global && global.gc) {
          logger.info('interval gc call');
          global.gc();
        }
      }, 60000);
    }, 15000);
  }, 10000);
};

module.exports = function (app) {
  logger.info('init app : ' + app);

  dbService.initQuery();
  // db connection 정보 유지 + 초기 data 넣기
  dbService.connect().then(() => {
    gcManual();
  });
};
