'use strict';

const SocketError = require('./SocketError');

module.exports = function (socket) {
  return function (error) {
    if (error instanceof SocketError) {
      socket.emit('app-error', error);
    } else {
      socket.emit('app-error', new SocketError('socket error : ', [error]));
    }
  };
};
