'use strict';

const SocketError = require('./SocketError');

module.exports = function (socket) {
  return function (error) {
    if (error instanceof SocketError) {
      socket.emit('socket-error', error);
    } else {
      socket.emit('socket-error', new SocketError('socket error : ', [error]));
    }
  };
};
