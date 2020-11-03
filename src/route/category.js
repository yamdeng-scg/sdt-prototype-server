'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'category.';
const _ = require('lodash');

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

// 카테고리 CRUD 시작

// 대분류 등록
router.post('/large', function (req, res, next) {
  // categoryLargeId
  // categoryMiddleId
  // companyId;
  // updateMemberId;
  // name;
  // sortIndex
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    companyId: paramObject.companyId,
    name: paramObject.name
  };
  dbService
    .insert('link_menu', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 대분류 수정
router.put('/large/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    name: paramObject.name
  };
  dbService
    .update('category_large', dbParam, id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 대분류 상세
router.get('/large/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .selectOne('category_large', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 대분류 삭제
router.delete('/large/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('category_large', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
