'use strict';

const SocketError = require('./SocketError');

module.exports = function (socket) {
  return function (error) {
    if (error instanceof SocketError) {
      socket.emit('error', error);
    } else {
      socket.emit('error', new SocketError('socket error : ', [error]));
    }
  };
};
