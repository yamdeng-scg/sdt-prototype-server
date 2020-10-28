'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

/*

1.ai 추천 목록
 : /?query=findIdsByAI GET

2.템플릿 전체 조회
 : / GET

3.템플릿 조회 : 카테고리 대분류
 : /?query=findByCategoryLargeId GET

4.템플릿 조회 : 카테고리 중분류
 : /?query=findByCategoryMiddleId GET

5.템플릿 조회 : 카테고리 소분류
 : /?query=findByCategorySmallId GET

6.템플릿 조회 : 내가 즐겨찾기한 템플릿 목록
 : /?query=findByFavoriteLoginMemberId GET

7.템플릿 조회 : 템플릿 검색
 : /?query=findSearch GET

8.템플릿 생성 : 키워드 맵핑 수행 필요(keywordList)
 : / POST

9.템플릿 수정 : 키워드 맵핑 수행 필요(keywordList)
 : /:id PUT

10.템플릿 삭제
 : /:id DELETE

11.템플릿 즐겨찾기 추가
 : /:id/favorite POST

12.템플릿 즐겨찾기 삭제
 : /:id/favorite DELETE

13.템플릿 상세
 : /:id GET



(x) 3.회원 상세(직원번호)
 : /?query=getByEmployeeNumber GET

4.회원 상세
 : /:id GET

5.회원 수정
 : /:id PUT

6.회원 수정(상태)
 : /:id/state PUT

7.회원 수정(상태, 레벨)
 : /:id/stateAndAuthLevel PUT

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
