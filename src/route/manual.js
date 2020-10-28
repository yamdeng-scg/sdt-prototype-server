'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

/*

1.등록된 manual의 태그 목록 가져오기
 : /?query=findTagAll GET

2.매뉴얼 검색
 : / GET
 : /?query=findSearch GET

3.다음 매뉴얼
 : /?query=nextManual GET

4.매뉴얼 즐겨찾기 추가
 : /:id/favorite POST

5.매뉴얼 즐겨찾기 삭제
 : /:id/favorite DELETE

6.매뉴얼 생성
 : / POST

7.매뉴얼 수정
 : /:id PUT

8.매뉴얼 삭제
 : /:id DELETE

*/

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
