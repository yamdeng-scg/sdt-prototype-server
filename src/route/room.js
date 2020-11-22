'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const Constant = require('../config/constant');
const AppError = require('../error/AppError');
const queryIdPrefix = 'room.';

/*

  방 조회
  
  1.현재 시간 방 통계 정보 : getCurrentTimeStats

  2.진행인 방 목록 : findIngState

  3.대기인 방 목록 : findReadyState

  4.종료인 방 검색 : findSearchCloseState

*/
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let queryId = paramObject.queryId;
  queryId = queryIdPrefix + queryId;
  let loginProfile = req.loginProfile;
  if (queryId.indexOf('findReadyState') != -1) {
    if (paramObject.sort && paramObject.sort === 'joinDate') {
      paramObject.sort = 'last_message_create_date desc';
    } else {
      paramObject.sort = 'wait_start_date asc';
    }
  }
  if (queryId.indexOf('State') != -1) {
    let checkSelf = paramObject.checkSelf;
    if (checkSelf === Constant.YES) {
      paramObject.memberId = paramObject.loginId;
    } else if (loginProfile.authLevel < 4) {
      paramObject.memberId = null;
    } else {
      paramObject.memberId = paramObject.loginId;
    }
    if (paramObject.searchType === 'message') {
      paramObject.memberName = '';
      paramObject.customerName = '';
      paramObject.message = paramObject.searchValue || '';
    } else if (paramObject.searchType === 'customerName') {
      paramObject.message = '';
      paramObject.memberName = '';
      paramObject.customerName = paramObject.searchValue || '';
    } else if (paramObject.searchType === 'memberName') {
      paramObject.message = '';
      paramObject.customerName = '';
      paramObject.memberName = paramObject.searchValue || '';
    } else {
      paramObject.message = '';
      paramObject.customerName = '';
      paramObject.memberName = '';
    }
  }
  dbService
    .selectQueryById(queryId, paramObject)
    .then((result) => {
      let responseResult = result;
      if (queryId.indexOf('get') !== -1) {
        responseResult = result[0];
      }
      res.send(responseResult);
    })
    .catch(errorRouteHandler(next));
});

// 방 상세
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = { id: id };
  let queryId = queryIdPrefix + 'getDetail';
  dbService
    .selectQueryById(queryId, paramObject)
    .then((data) => {
      res.send(data[0]);
    })
    .catch(errorRouteHandler(next));
});

// 방 상담사 매칭시키기
router.post('/:id/matchRoom', function (req, res, next) {
  let paramObject = req.paramObject;
  paramObject.memberId = paramObject.loginId;
  const id = req.params.id;
  paramObject.roomId = id;
  dbService
    .selectQueryById(queryIdPrefix + 'getDetail', { id: id })
    .then((result) => {
      let roomInfo = result[0];
      if (roomInfo.memberId !== null) {
        throw new AppError('이미 상담중인 방입니다.');
      } else {
        dbService
          .executeQueryById(queryIdPrefix + 'matchRoom', paramObject)
          .then(() => {
            dbService
              .selectQueryById(queryIdPrefix + 'getDetail', { id: id })
              .then((result) => {
                let roomInfo = result[0];
                res.send(roomInfo);
              });
          })
          .catch(errorRouteHandler(next));
      }
    })
    .catch(errorRouteHandler(next));
});

// 방 종료
router.post('/:id/closeRoom', function (req, res, next) {
  let paramObject = req.paramObject;
  const id = req.params.id;
  dbService
    .executeQueryById(queryIdPrefix + 'closeRoom', {
      roomId: id,
      loginId: paramObject.loginId
    })
    .then(() => {
      dbService
        .selectQueryById(queryIdPrefix + 'getDetail', { id: id })
        .then((result) => {
          let roomInfo = result[0];
          res.send(roomInfo);
        });
    })
    .catch(errorRouteHandler(next));
});

// 방 이관
router.post('/:id/transferRoom', function (req, res, next) {
  let paramObject = req.paramObject;
  const id = req.params.id;
  dbService
    .executeQueryById(queryIdPrefix + 'transferRoom', {
      transferType: paramObject.transferType,
      memberId: paramObject.memberId,
      roomId: id,
      loginId: paramObject.loginId
    })
    .then(() => {
      dbService
        .selectQueryById(queryIdPrefix + 'getDetail', { id: id })
        .then((result) => {
          let roomInfo = result[0];
          res.send(roomInfo);
        });
    })
    .catch(errorRouteHandler(next));
});

// 이전 상담 검색
router.get('/:id/findSearchJoinHistory', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = { roomId: id, message: paramObject.message };
  let queryId = queryIdPrefix + 'findSearchJoinHistory';
  dbService
    .selectQueryById(queryId, dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
