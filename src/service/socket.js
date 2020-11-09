'use strict';

const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const errorSocketHandler = require('../error/socketHandler');
const Config = require('../config');
const SocketError = require('../error/SocketError');
const logger = require('../util/logger');
const dbService = require('./db');
const companyService = require('./company');

const service = {};

service.sendEvent = function (socket, eventName, data) {
  socket.emit(eventName, data);
};

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

  socket.on('room-detail', (data, socketCallBack) => {
    let dbParam = { id: data.roomId };
    dbService
      .selectQueryById('room.getDetail', dbParam)
      .then((result) => {
        socketCallBack(result[0]);
        service.sendEvent(socket, 'room-detail', result[0]);
      })
      .catch(errorSocketHandler(socket));
    // let dbParam = { speakerId: data.speakerId };
    // dbService
    //   .selectQueryById('room.getDetailBySpeakerId', dbParam)
    //   .then((result) => {
    //     socketCallBack(result[0]);
    //     service.sendEvent(socket, 'room-detail', result[0]);
    //   })
    //   .catch(errorSocketHandler(socket));
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
  // securityKey=1aec31172508a8
  let socketConnectQuery = socket.handshake.query;
  let appId = socketConnectQuery.appId;
  let companyId = socketConnectQuery.companyId || '1';
  let name = socketConnectQuery.name;
  let telNumber = socketConnectQuery.telNumber;
  companyService
    .getAppProfile(appId, name, telNumber)
    .then((profile) => {
      let dbParam = {
        companyId: companyId,
        telNumber: profile.telNumber,
        name: profile.name,
        gasappMemberNumber: appId
      };
      return dbService.executeQueryById('customer.regist', dbParam).then(() => {
        return dbService
          .selectQueryById('customer.getByGasappMemberNumber', {
            companyId: companyId,
            gasappMemberNumber: appId
          })
          .then((result) => {
            let promiseList = [];
            let autoMessage1 = null;
            let autoMessage2 = null;

            promiseList.push(
              dbService
                .selectQueryById('template.getAutoMessageRandom', {
                  companyId: companyId,
                  type: 1
                })
                .then((result) => {
                  autoMessage1 = result[0];
                })
            );
            promiseList.push(
              dbService
                .selectQueryById('template.getAutoMessageRandom', {
                  companyId: companyId,
                  type: 2
                })
                .then((result) => {
                  autoMessage2 = result[0];
                })
            );
            return Promise.all(promiseList).then(() => {
              let customerInfo = result[0];
              socket.companyId = companyId;
              socket.profile = customerInfo;
              socket.isCustomer = true;
              socket.emit('welcome', {
                customer: customerInfo,
                autoMessageList: [autoMessage1, autoMessage2]
              });
            });
          });
      });
    })
    .catch(errorSocketHandler(socket));
};

service.loginMember = function (socket) {
  // 회원 로그인 시키고 socket에 정보 셋팅하고 welcome 메시지 보내기
  let sockeyConnectQuery = socket.handshake.query;
  let memberId = sockeyConnectQuery.memberId;
  let companyId = sockeyConnectQuery.companyId || '1';
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
          socket.companyId = companyId;
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
