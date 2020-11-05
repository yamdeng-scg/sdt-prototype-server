'use strict';

const AppError = require('../error/AppError');

module.exports = function (socket) {
  return function (error) {
    if (error instanceof AppError) {
      socket.emit('error', error);
    } else {
      socket.emit('error', new AppError('server error', [error]));
    }
  };
};
