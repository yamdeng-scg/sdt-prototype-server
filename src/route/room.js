'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

/*

1.현재시간 방 통계 정보
 : /?query=getCurrentTimeStats GET

2.진행중인 방 정보
 : /?query=findIngState GET

3.대기를 기다리고 있는 방 목록
 : /?query=findReadyState GET

4.상태가 종료인 방 검색
 : /?query=findSearchCloseState GET

5.상태이전 상담 목록
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

// 명언 등록 or command
// 명언 command execute : query : updateWiseSay, updateWiseSayLikeContent
router.post('/', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let queryParameter = req.query;
  let queryName = queryParameter.queryName;
  if (queryName) {
    dbService
      .executeQueryById(queryName, jsonBody)
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
  let queryName = queryParameter.queryName;
  if (queryName) {
    dbService
      .selectQueryById(queryName, queryParameter)
      .then((result) => {
        let responseResult = result;
        if (queryName === 'getWiseSay') {
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
