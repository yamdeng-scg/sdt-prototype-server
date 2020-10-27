'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

/*

1.고객 정보 수정(욕설, 부적절한 메시지 사용 최신화)
 : /:id/updateSwearInsultCount PUT

2.고객 관심고객으로 수정
 : /:id/enableBlackStatus PUT

3.고객 관심고객 해제
 : /:id/disbleBlackStatus PUT

4.고객의 욕설 count 증가
 : /:id/plusSwearCount PUT

5.고객의 부적절한 count 증가
 : /:id/plusInsultCount PUT

6.고객 상세
 : /:id GET

(X) 7.고객 상세(spaker)
 : ?queryId=getBySpeakerId&speakerId=:speakerId GET

(X) 8.고객 상세(gasapp_member_number)
 : ?queryId=getByGasappMemberNumber&gasappMemberNumber=:gasappMemberNumber GET

 9.관심고객 목록
  : ?queryId=findBlockMember GET

(X) 10.등록 : regist
 : / POST

(X) 11.상세 정보(방 포함)
 : ?queryId=getDetailRoom GET

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
