'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const Constant = require('../config/constant');
const queryIdPrefix = 'room.';

/*

1.현재 시간 방 통계 정보
 : /?query=getCurrentTimeStats GET

2.진행인 방 목록
 : /?query=findIngState GET

3.대기인 방 목록
 : /?query=findReadyState GET

4.종료인 방 검색
 : /?query=findSearchCloseState GET

(roomJoinHistory) 5.이전 상담 검색
  : /?query=findSearchJoinHistory GET

6.방 종료
  : /:id/closeRoom PUT

7.방 이관
  : /:id/transfeRoom PUT

8.방 이관
  : /?query=matchRoom POST

9.방 상세
 : /:id GET

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

  1.현재 시간 방 통계 정보
     : /?query=getCurrentTimeStats GET

  2.진행인 방 목록
    : /:id GET



    1.현재 시간 방 통계 정보
 : /?query=getCurrentTimeStats GET

2.진행인 방 목록
 : /?query=findIngState GET

3.대기인 방 목록
 : /?query=findReadyState GET

4.종료인 방 검색
 : /?query=findSearchCloseState GET
 */

/*

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
      paramObject.sort = 'last_message_create_date asc';
    } else {
      paramObject.sort = 'end_date desc';
    }
  }
  // if (queryId.indexOf('findIngState') != -1) {
  //   let checkSelf = paramObject.checkSelf;
  //   if (checkSelf === Constant.YES) {
  //     paramObject.memberId = paramObject.loginId;
  //   } else if (loginProfile.authLevel < 4) {
  //     paramObject.memberId = null;
  //   } else {
  //     paramObject.memberId = paramObject.loginId;
  //   }
  // }
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
      paramObject.message = '';
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
      if (queryId.indexOf('get') === 0) {
        responseResult = result[0];
      }
      res.send(responseResult);
    })
    .catch(errorRouteHandler(next));
});

// 이하

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
