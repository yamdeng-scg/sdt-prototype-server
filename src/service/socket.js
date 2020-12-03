'use strict';

const jwt = require('jsonwebtoken');
const errorSocketHandler = require('../error/socketHandler');
const Config = require('../config/config');
const SocketError = require('../error/SocketError');
const logger = require('../util/logger');
const dbService = require('./db');
const companyService = require('./company');
const helper = require('../util/helper');
const _ = require('lodash');

const service = {};

let socketIo = null;

// io 모듈 셋팅
service.setSocketIo = function (io) {
  socketIo = io;
};

// 에러 전송
service.sendError = function (socket, error) {
  socket.emit('app-error', error);
};

// 이벤트 전송 : 단일 소켓
service.sendEvent = function (socket, eventName, data) {
  socket.emit(eventName, data);
};

// 이벤트 전송 : 룸 기준(나를 제외하고)
service.sendEventByRoomIdExceptMe = function (socket, roomId, eventName, data) {
  socket.to(roomId).emit(eventName, data);
};

// 이벤트 전송 : 룸 기준(나를 포함)
service.sendEventByRoomId = function (roomId, eventName, data) {
  socketIo.in(roomId).emit(eventName, data);
};

// 이벤트 전송 : 단일 소켓
service.sendEvent = function (socket, eventName, data) {
  socket.emit(eventName, data);
};

// 소켓 연결 : 고객, 회원(상담사) 동일하게 사용
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

  // 방 상세
  socket.on('room-detail', (data, socketCallBack) => {
    let dbParam = { id: data.roomId };
    dbService
      .selectQueryById('room.getDetail', dbParam)
      .then((result) => {
        // socketCallBack(result[0]);
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

  // 방 조인
  socket.on('join', (data, socketCallBack) => {
    let dbParam = { roomId: data.roomId, speakerId: data.speakerId };
    socket.join(data.roomId);
    dbService
      .executeQueryByIdTogetherResult('room.joinRoom', dbParam)
      .then((result) => {
        let joinResult = result.result[1][0];
        let maxMessageId = joinResult['@maxMessageId'];
        let readLastMessageId = joinResult['@readLastMessageId'] || 0;
        // 마지막 메시지가 null 이거나 마지막 읽음 메시지와 마지막 메시지가 동일하면 읽음 여부를 전달하지 않는다(그외는 전달)
        if (maxMessageId) {
          if (maxMessageId !== readLastMessageId) {
            service.sendEventByRoomIdExceptMe(
              socket,
              data.roomId,
              'read-message',
              {
                roomId: data.roomId,
                startId: readLastMessageId,
                endId: maxMessageId,
                speakerId: data.speakerId
              }
            );
          }
        }
        // 방을 온라인 상태로 변경
        if (socket.isCustomer) {
          dbService
            .executeQueryById('room.updateOnline', {
              roomId: data.roomId,
              isOnline: 1
            })
            .catch(errorSocketHandler(socket));
        }
        // 메시지 목록을 반환
        let listSearchParam = {
          roomId: data.roomId,
          speakerId: data.speakerId,
          messageAdminType: null,
          startId: null,
          intervalDay: Config.DEFAULT_MESSAGE_INTERVAL_DAY,
          pageSize: Config.DEFAULT_MESSAGE_MORE_PAGE_SIZE
        };
        dbService
          .selectQueryById('message.findByRoomIdToSpeaker', listSearchParam)
          .then((result) => {
            let messageList = _.sortBy(result, ['createDate']);
            // socketCallBack(messageList);
            service.sendEvent(socket, 'message-list', messageList);
          })
          .catch(errorSocketHandler(socket));
      });
  });

  // 메시지 전송
  socket.on('message', (data) => {
    logger.info('message : ' + data);
    let companyId = socket.companyId;
    let profile = socket.profile;
    let roomId = data.roomId;
    let speakerId = data.speakerId || profile.speakerId;
    let isCustomer = socket.isCustomer;
    let messageParam = {
      companyId: companyId,
      roomId: roomId,
      speakerId: speakerId,
      mesasgeType: data.mesasgeType || 0,
      isSystemMessage: data.isSystemMessage || 0,
      message: data.message,
      messageAdminType: data.messageAdminType || 0,
      isEmployee: isCustomer ? 0 : 1,
      messageDetail: data.messageDetail || '',
      templateId: data.templateId || null
    };
    dbService
      .executeQueryByIdTogetherResult('message.create', messageParam)
      .then((dbResult) => {
        let newMessage = dbResult.result[0][0];
        service.sendEventByRoomId(
          roomId,
          'message',
          helper.changeKeyToCamelCase(newMessage)
        );
        if (socket.isCustomer) {
          // 고객이 작성한 메시지이고 조인 메시지id와 마지막 생성된 메시지가 동일한 경우에
          if (newMessage.joinMessasgeId === newMessage.id) {
            service.sendEventByRoomId('speaker' + companyId, 'receive-event', {
              eventName: 'reload-ready-room'
            });
          }
        }
      });
  });

  // 고객의 상담 종료
  socket.on('end', (data, socketCallBack) => {
    logger.info('end : ' + data);
    let profile = socket.profile;
    let roomId = profile.roomId;
    let dbParam = { roomId: roomId, loginId: null };
    dbService
      .selectQueryById('room.closeRoom', dbParam)
      .then(() => {
        // socketCallBack({ success: true });
      })
      .catch(errorSocketHandler(socket));
  });

  // 챗봇 이력 저장
  socket.on('save-history', (data, socketCallBack) => {
    logger.info('save-history : ' + data);
    let history = data.history;
    let roomId = data.roomId;
    let dbParam = { roomId: roomId, history: JSON.stringify(history) };
    dbService
      .selectQueryById('room.updateJoinHistory', dbParam)
      .then(() => {
        // socketCallBack({ success: true });
      })
      .catch(errorSocketHandler(socket));
  });

  // 메시지 삭제
  socket.on('delete-message', (data, socketCallBack) => {
    logger.info('delete-messages : ' + data);
    let id = data.id;
    dbService
      .selectQueryById('message.getReadCountByMessageId', { id: id })
      .then((result) => {
        let countInfo = result[0];
        let readCount = countInfo.readCount;
        if (readCount <= 0) {
          service.sendError(socket, new SocketError('읽은 메시지입니다'));
        } else {
          return dbService
            .selectQueryById('message.deleteMessageRead', {
              id: id
            })
            .then(() =>
              dbService.selectQueryById('message.delete', {
                id: id
              })
            )
            .then(() => {
              // socketCallBack({ success: true });
            });
        }
      })
      .catch(errorSocketHandler(socket));
  });

  // 이벤트 전달
  socket.on('send-event', (data) => {
    logger.info('send-event : ' + data);
    let companyId = socket.companyId;
    service.sendEventByRoomIdExceptMe(
      'speaker' + companyId,
      'receive-event',
      data
    );
  });

  // 메시지 읽음
  socket.on('read-message', (data, socketCallBack) => {
    logger.info('read-message : ' + data);
    let roomId = data.roomId;
    let speakerId = data.speakerId;
    let startId = data.startId;
    let endId = data.endId;
    let dbParam = {
      roomId: roomId,
      speakerId: speakerId,
      startId: startId,
      endId: endId
    };
    dbService
      .executeQueryById('message.readMessage', dbParam)
      .then(() => {
        service.sendEventByRoomId(data.roomId, 'read-message', {
          roomId: data.roomId,
          startId: startId,
          endId: endId,
          speakerId: data.speakerId
        });
        // socketCallBack({ success: true });
      })
      .catch(errorSocketHandler(socket));
  });

  // 상담사 상담 종료
  socket.on('leave', (data) => {
    logger.info('leave : ' + data);
    socket.leave(data.roomId);
  });

  // 메시지 더 보기
  socket.on('message-list', (data, socketCallBack) => {
    logger.info('message-list : ' + data);
    // 메시지 목록을 반환
    let listSearchParam = {
      roomId: data.roomId,
      speakerId: data.speakerId,
      messageAdminType: data.messageAdminType || null,
      startId: data.startId || null,
      intervalDay: Config.DEFAULT_MESSAGE_INTERVAL_DAY,
      pageSize: Config.DEFAULT_MESSAGE_MORE_PAGE_SIZE
    };
    dbService
      .selectQueryById('message.findByRoomIdToSpeaker', listSearchParam)
      .then((result) => {
        let messageList = _.sortBy(result, ['createDate']);
        service.sendEvent(socket, 'message-list', messageList);
        // socketCallBack(messageList);
      })
      .catch(errorSocketHandler(socket));
  });

  // 소켓 종료
  socket.on('disconnect', (data) => {
    logger.info('disconnect : ' + data);
    // 방을 오프라인 상태로 변경
    if (socket.isCustomer) {
      dbService
        .executeQueryById('room.updateOnline', {
          roomId: data.roomId,
          isOnline: 0
        })
        .catch(errorSocketHandler(socket));
    }
  });
};

// 고객 로그인
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

// 회원 로그인
service.loginMember = function (socket) {
  // 회원 로그인 시키고 socket에 정보 셋팅하고 welcome 메시지 보내기
  let sockeyConnectQuery = socket.handshake.query;
  let memberId = sockeyConnectQuery.memberId;
  let companyId = sockeyConnectQuery.companyId || '1';
  let token = sockeyConnectQuery.token;
  let profileId = memberId;
  let profile = null;
  // 이벤트 전달을 해주기 위해서 회원 connect시에 항상 회사방에 조인을 걸어 둔다
  socket.join('speaker' + companyId);
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

module.exports = service;
