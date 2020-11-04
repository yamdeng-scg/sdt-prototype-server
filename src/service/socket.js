'use strict';

const logger = require('../util/logger');

const service = {};

service.connect = function (socket) {
  socket.on('room-detail', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('join', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('message', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('end', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('save-history', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('delete-message', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('send-event', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('read-message', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('end-member', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('message-all', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('message-more', (msg) => {
    logger.info('message : ' + msg);
  });

  socket.on('disconnect', (data) => {
    logger.info('disconnecte : ' + data);
  });
};

module.exports = service;
