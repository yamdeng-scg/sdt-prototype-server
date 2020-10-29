'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const Constant = require('../config/constant');
const AppError = require('../error/AppError');
const queryIdPrefix = 'room.';

/*

(roomJoinHistory) 5.이전 상담 검색
  : /?query=findSearchJoinHistory GET

10.방 상세 정보(speaker id 기준)
 : /?query=getDetailBySpeakerId

11.고객의 조인 히스토리 정보 최신화
 : /:id/updateJoinHistory PUT

12.방 종료 상세 정보 : getRoomJoinHistoryDetail
 : /:id/roomJoinHistory/:roomJoinHistoryId GET

13.메시지 조회
 : /?query=findSearchRangeById GET

*/

/*

  방 조회
  
  1.현재 시간 방 통계 정보 : getCurrentTimeStats

  2.진행인 방 목록 : findIngState

  3.대기인 방 목록 : findReadyState

  4.종료인 방 검색 : findSearchCloseStateㄴ

*/
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let queryId = paramObject.queryId;
  queryId = queryIdPrefix + queryId;
  let loginProfile = req.loginProfile;
  if (queryId.indexOf('findReadyState') != -1) {
    if (paramObject.sort && paramObject.sort === 'joinDate') {
      paramObject.sort = 'last_message_create_date asc';
    } else {
      paramObject.sort = 'end_date desc';
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
    } else if (paramObject.searchType === 'customer') {
      paramObject.message = '';
      paramObject.memberName = '';
      paramObject.customerName = paramObject.searchValue || '';
    } else if (paramObject.searchType === 'member') {
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
      type: paramObject.type,
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

// 명언 등록 or command
// 명언 command execute : query : updateWiseSay, updateWiseSayLikeContent
router.post('/', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let queryParameter = req.query;
  let queryId = queryParameter.queryId;
  if (queryId) {
    dbService
      .executeQueryById(queryId, jsonBody)
      .then((result) => {
        res.send(result);
      })
      .catch(errorRouteHandler(next));
  } else {
    dbService
      .insert('wise_say', jsonBody)
      .then((result) => {
        res.send(result);
      })
      .catch(errorRouteHandler(next));
  }
});

// 명언 수정
router.put('/:id', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let id = req.params.id;
  dbService
    .update('wise_say', jsonBody, id)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 명언 수정 전체
router.put('/', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  dbService
    .updateAll('wise_say', jsonBody)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 명언 상세
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .selectOne('wise_say', id)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 명언 삭제(전체)
router.delete('/', function (req, res, next) {
  dbService
    .deleteAll('wise_say')
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 명언 삭제
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('wise_say', id)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 명언 조회 : query : findWiseSayAll, getWiseSay, findWiseSayByContent
router.get('/', function (req, res, next) {
  let queryParameter = req.query;
  let queryId = queryParameter.queryId;
  if (queryId) {
    dbService
      .selectQueryById(queryId, queryParameter)
      .then((result) => {
        let responseResult = result;
        if (queryId === 'getWiseSay') {
          responseResult = result[0];
        }
        res.send(responseResult);
      })
      .catch(errorRouteHandler(next));
  } else {
    dbService
      .select('wise_say')
      .then((result) => {
        res.send(result);
      })
      .catch(errorRouteHandler(next));
  }
});

module.exports = router;
