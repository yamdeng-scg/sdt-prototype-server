'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'category.';
const _ = require('lodash');

/*

1.전체 목록 : 3개 모두
 : / GET

2.카테고리 대분류 목록
 : /large GET

3.카테고리 중분류 목록
 : /middle GET

4.카테고리 소분류 목록
 : /small GET

5.카테고리 대분류 등록
 : /large POST

6.카테고리 대분류 수정
 : /large/:id PUT

7.카테고리 대분류 삭제
 : /large/:id DELETE

8.카테고리 대분류 상세
 : /large/:id GET

9.카테고리 중분류 등록
 : /middle POST

10.카테고리 중분류 수정
 : /middle/:id PUT

11.카테고리 중분류 삭제
 : /middle/:id DELETE

12.카테고리 중분류 상세
 : /middle/:id GET

13.카테고리 중분류 등록
 : /small POST

14.카테고리 중분류 수정
 : /small/:id PUT

15.카테고리 중분류 삭제
 : /small/:id DELETE

16.카테고리 중분류 상세
 : /small/:id GET

*/

// 카테고리 전체 목록
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let promiseList = [];
  let categoryLargeList = [];
  let categoryMiddleList = [];
  let categorySmallList = [];
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategoryLarge', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryLargeList = result;
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategoryMiddle', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryMiddleList = result;
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategorySmall', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categorySmallList = result;
        return true;
      })
  );
  Promise.all(promiseList)
    .then(() => {
      res.send({
        large: categoryLargeList,
        middle: categoryMiddleList,
        small: categorySmallList
      });
    })
    .catch(errorRouteHandler(next));
});

// 카테고리 전체 목록 : 트리 형식으로
router.get('/tree', function (req, res, next) {
  let paramObject = req.paramObject;
  let promiseList = [];
  let categoryLargeList = [];
  let categoryMiddleList = [];
  let categorySmallList = [];
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategoryLarge', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryLargeList = result;
        categoryLargeList.forEach((info) => {
          info.level = 1;
        });
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategoryMiddle', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryMiddleList = result;
        categoryMiddleList.forEach((info) => {
          info.level = 2;
        });
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategorySmall', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categorySmallList = result;
        categorySmallList.forEach((info) => {
          info.level = 3;
        });
        return true;
      })
  );
  Promise.all(promiseList)
    .then(() => {
      categoryMiddleList.forEach((middleInfo) => {
        middleInfo.childs = _.filter(categorySmallList, (smallInfo) => {
          return middleInfo.id === smallInfo.categoryMiddleId;
        });
      });
      categoryLargeList.forEach((largeInfo) => {
        largeInfo.childs = _.filter(categoryMiddleList, (middleInfo) => {
          return largeInfo.id === middleInfo.categoryLargeId;
        });
      });
      res.send(categoryLargeList);
    })
    .catch(errorRouteHandler(next));
});

// 대분류 목록
router.get('/large', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'findCategoryLarge', {
      companyId: paramObject.companyId
    })
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 중분류 목록
router.get('/middle', function (req, res, next) {
  let paramObject = req.paramObject;
  let queryId = paramObject.queryId;
  if (queryId) {
    dbService
      .selectQueryById(queryIdPrefix + queryId, paramObject)
      .then((result) => {
        res.send(result);
      })
      .catch(errorRouteHandler(next));
  } else {
    dbService
      .selectQueryById(queryIdPrefix + 'findCategoryMiddle', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        res.send(result);
      })
      .catch(errorRouteHandler(next));
  }
});

// 소분류 목록
router.get('/small', function (req, res, next) {
  let paramObject = req.paramObject;
  let queryId = paramObject.queryId;
  if (queryId) {
    dbService
      .selectQueryById(queryIdPrefix + queryId, paramObject)
      .then((result) => {
        res.send(result);
      })
      .catch(errorRouteHandler(next));
  } else {
    dbService
      .selectQueryById(queryIdPrefix + 'findCategorySmall', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        res.send(result);
      })
      .catch(errorRouteHandler(next));
  }
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
