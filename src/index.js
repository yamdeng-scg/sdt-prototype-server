'use strict';

const logger = require('./util/logger');
const process = require('process');

// PORT 아규먼트가 전달이 않되어있을때는 8080 PORT를 default로 server run
let serverListenPort = process.env.PORT || 8090;

let app = null;
try {
  app = require('./app');
} catch (error) {
  logger.error(
    'app init error : ' + error + error.stack ? ' stack : ' + error.stack : ''
  );
  process.exit(-1);
}

app.listen(serverListenPort, () => {
  logger.info('Sdt Prototype Server ' + serverListenPort);
});

// 전역 promise 오류(reject) catch
process.on('unhandledRejection', (error, promise) => {
  logger.error('unhandledRejection error : ' + error);
  logger.error('unhandledRejection promise : ' + promise);
  if (error.stack) {
    logger.error('unhandledRejection stack : ' + error.stack);
  }
});

// catch all
process.on('uncaughtException', function (err) {
  logger.error('uncaughtException : ' + err);
});

// disconnect
process.on('disconnect', function () {
  logger.error('disconnect call');
});

// disconnect
process.on('exit', function () {
  logger.error('exit call');
});

process.on('SIGTERM', function () {
  logger.error('SIGTERM call');
  process.exit(-1);
});

process.on('SIGKILL', function () {
  logger.error('SIGKILL call');
});
