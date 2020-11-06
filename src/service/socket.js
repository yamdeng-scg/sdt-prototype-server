'use strict';

const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const errorSocketHandler = require('../error/socketHandler');
const Config = require('../config');
const SocketError = require('../error/SocketError');
const logger = require('../util/logger');
const dbService = require('./db');

const service = {};

service.connect = function (socket) {
  let sockeyConnectQuery = socket.handshake.query;
  let appId = sockeyConnectQuery.appId;

  if (appId) {
    // 고객 connect 처리
    service.loginCustomer(socket);
  } else {
    // 상담사 connect 처리
    service.loginMember(socket);
  }

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

  socket.on('leave', (msg) => {
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

service.loginCustomer = function (socket) {
  // 고객 로그인 시키고 socket에 정보 셋팅하고 welcome 메시지 보내기
  // securityKey=1aec31172508a8
  let sockeyConnectQuery = socket.handshake.query;
  let appId = sockeyConnectQuery.appId;
  let companyId = sockeyConnectQuery.companyId || '1';
  dbService
    .selectQueryById('customer.getByGasappMemberNumber', {
      companyId: companyId,
      gasappMemberNumber: appId
    })
    .then((result) => {
      let customerInfo = result[0];
      socket.profile = customerInfo;
      socket.isCustomer = true;
      socket.emit('welcome', {
        customer: customerInfo,
        message: 'aaa'
      });
    })
    .catch(errorSocketHandler(socket));
};

service.loginMember = function (socket) {
  // 회원 로그인 시키고 socket에 정보 셋팅하고 welcome 메시지 보내기
  let sockeyConnectQuery = socket.handshake.query;
  let memberId = sockeyConnectQuery.memberId;
  // let companyId = sockeyConnectQuery.companyId || '1';
  let token = sockeyConnectQuery.token;
  let profileId = memberId;
  let profile = null;
  try {
    logger.info('token : ' + token);
    profile = jwt.verify(token, Config.JSONTOKEN_SECRETKEY);
    profileId = profile.id;
    dbService
      .selectQueryById('member.getDetail', { id: profileId })
      .then((result) => {
        if (result.length > 0) {
          let profile = result[0];
          socket.profile = profile;
          socket.isCustomer = false;
          socket.emit('welcome', {
            member: profile
          });
        } else {
          service.sendError(socket, new SocketError('존재하지 않는 ID 입니다'));
        }
      })
      .catch(errorSocketHandler(socket));
  } catch (err) {
    service.sendError(socket, new SocketError('인증정보가 존재하지 않습니다'));
  }
};

service.sendError = function (socket, error) {
  socket.emit('error', error);
};

module.exports = service;
