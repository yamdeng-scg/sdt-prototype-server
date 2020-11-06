'use strict';

module.exports = function SocketError(message, error) {
  this.message = '' + message;
  this.error = error;
};
