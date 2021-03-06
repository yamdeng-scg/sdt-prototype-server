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
  let isMinwon = paramObject.isMinwon;
  let largeQueryId = 'findCategoryLarge';
  let middleQueryId = 'findCategoryMiddle';
  let smallQueryId = 'findCategorySmall';
  if (isMinwon === 'Y') {
    largeQueryId = 'findCategoryLargeByMinwonCodeExist';
    middleQueryId = 'findCategoryMiddleByMinwonCodeExist';
    smallQueryId = 'findCategorySmallByMinwonCodeExist';
  }
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + largeQueryId, {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryLargeList = result;
        categoryLargeList.forEach((info) => {
          info.key = 'a' + info.id;
          info.title = info.name;
          info.level = 1;
        });
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + middleQueryId, {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryMiddleList = result;
        categoryMiddleList.forEach((info) => {
          info.key = 'b' + info.id;
          info.title = info.name;
          info.level = 2;
        });
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + smallQueryId, {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categorySmallList = result;
        categorySmallList.forEach((info) => {
          info.key = 'c' + info.id;
          info.title = info.name;
          info.level = 3;
        });
        return true;
      })
  );
  Promise.all(promiseList)
    .then(() => {
      categoryMiddleList.forEach((middleInfo) => {
        middleInfo.children = _.filter(categorySmallList, (smallInfo) => {
          return middleInfo.id === smallInfo.categoryMiddleId;
        });
      });
      categoryLargeList.forEach((largeInfo) => {
        largeInfo.children = _.filter(categoryMiddleList, (middleInfo) => {
          return largeInfo.id === middleInfo.categoryLargeId;
        });
      });
      res.send(categoryLargeList);
    })
    .catch(errorRouteHandler(next));
});

// 카테고리 전체 목록 : 트리 형식으로(민원코드 존재한 것 들만)
router.get('/tree/minwon', function (req, res, next) {
  let paramObject = req.paramObject;
  let promiseList = [];
  let categoryLargeList = [];
  let categoryMiddleList = [];
  let categorySmallList = [];
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategoryLargeByMinwonCodeExist', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryLargeList = result;
        categoryLargeList.forEach((info) => {
          info.key = 'a' + info.id;
          info.title = info.name;
          info.level = 1;
        });
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategoryMiddleByMinwonCodeExist', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categoryMiddleList = result;
        categoryMiddleList.forEach((info) => {
          info.key = 'b' + info.id;
          info.title = info.name;
          info.level = 2;
        });
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findCategorySmallByMinwonCodeExist', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        categorySmallList = result;
        categorySmallList.forEach((info) => {
          info.key = 'c' + info.id;
          info.title = info.name;
          info.level = 3;
        });
        return true;
      })
  );
  Promise.all(promiseList)
    .then(() => {
      categoryMiddleList.forEach((middleInfo) => {
        middleInfo.children = _.filter(categorySmallList, (smallInfo) => {
          return middleInfo.id === smallInfo.categoryMiddleId;
        });
      });
      categoryLargeList.forEach((largeInfo) => {
        largeInfo.children = _.filter(categoryMiddleList, (middleInfo) => {
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
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    companyId: paramObject.companyId,
    name: paramObject.name
  };
  dbService
    .selectQueryById(queryIdPrefix + 'getLastLargeSortIndex', dbParam)
    .then((sortIndexQueryResult) => {
      const sortIndex = sortIndexQueryResult[0].sortIndex;
      dbParam.sortIndex = sortIndex;
      return dbService.insert('category_large', dbParam).then((result) => {
        res.send(result);
      });
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
    .selectQueryById(queryIdPrefix + 'getCategoryLarge', { id: id })
    .then((result) => {
      res.send(result[0]);
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

// 대분류 정렬 정보 수정
router.put('/large/:id/sort-index', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    sortIndex: paramObject.sortIndex,
    companyId: paramObject.companyId
  };
  dbService
    .executeQueryById(queryIdPrefix + 'updateLargeSortIndexToAfter', dbParam)
    .then(() => {
      return dbService.update('category_large', dbParam, id).then((result) => {
        res.send(result);
      });
    })
    .catch(errorRouteHandler(next));
});

// 중분류 start
// 중분류 등록
router.post('/middle', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    companyId: paramObject.companyId,
    name: paramObject.name,
    categoryLargeId: paramObject.categoryLargeId
  };
  dbService
    .selectQueryById(queryIdPrefix + 'getLastMiddleSortIndex', dbParam)
    .then((sortIndexQueryResult) => {
      const sortIndex = sortIndexQueryResult[0].sortIndex;
      dbParam.sortIndex = sortIndex;
      return dbService.insertOnly('category_middle', dbParam).then((result) => {
        return dbService
          .selectQueryById(queryIdPrefix + 'getCategoryMiddle', {
            id: result.id
          })
          .then((result) => {
            res.send(result[0]);
          });
      });
    })
    .catch(errorRouteHandler(next));
});

// 중분류 수정
router.put('/middle/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    name: paramObject.name,
    categoryLargeId: paramObject.categoryLargeId
  };
  dbService
    .update('category_middle', dbParam, id)
    .then(() => {
      return dbService
        .selectQueryById(queryIdPrefix + 'getCategoryMiddle', {
          id: id
        })
        .then((result) => {
          res.send(result[0]);
        });
    })
    .catch(errorRouteHandler(next));
});

// 중분류 상세
router.get('/middle/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .selectQueryById(queryIdPrefix + 'getCategoryMiddle', { id: id })
    .then((result) => {
      res.send(result[0]);
    })
    .catch(errorRouteHandler(next));
});

// 중분류 삭제
router.delete('/middle/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('category_middle', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 중분류 정렬 정보 수정
router.put('/middle/:id/sort-index', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    sortIndex: paramObject.sortIndex,
    categoryLargeId: paramObject.categoryLargeId
  };
  dbService
    .executeQueryById(queryIdPrefix + 'updateMiddleSortIndexToAfter', dbParam)
    .then(() => {
      return dbService.updateOnly('category_middle', dbParam, id).then(() => {
        return dbService
          .selectQueryById(queryIdPrefix + 'getCategoryMiddle', {
            id: id
          })
          .then((result) => {
            res.send(result[0]);
          });
      });
    })
    .catch(errorRouteHandler(next));
});

// 소분류 start
// 소분류 등록
router.post('/small', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    companyId: paramObject.companyId,
    name: paramObject.name,
    categoryMiddleId: paramObject.categoryMiddleId
  };
  dbService
    .selectQueryById(queryIdPrefix + 'getLastSmallSortIndex', dbParam)
    .then((sortIndexQueryResult) => {
      const sortIndex = sortIndexQueryResult[0].sortIndex;
      dbParam.sortIndex = sortIndex;
      return dbService.insertOnly('category_small', dbParam).then((result) => {
        return dbService
          .selectQueryById(queryIdPrefix + 'getCategorySmall', {
            id: result.id
          })
          .then((result) => {
            res.send(result[0]);
          });
      });
    })
    .catch(errorRouteHandler(next));
});

// 중분류 수정
router.put('/small/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    name: paramObject.name,
    categoryMiddleId: paramObject.categoryMiddleId
  };
  dbService
    .updateOnly('category_small', dbParam, id)
    .then(() => {
      return dbService
        .selectQueryById(queryIdPrefix + 'getCategorySmall', {
          id: id
        })
        .then((result) => {
          res.send(result[0]);
        });
    })
    .catch(errorRouteHandler(next));
});

// 중분류 상세
router.get('/small/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .selectQueryById(queryIdPrefix + 'getCategorySmall', { id: id })
    .then((result) => {
      res.send(result[0]);
    })
    .catch(errorRouteHandler(next));
});

// 소분류 삭제
router.delete('/small/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('category_small', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 소분류 정렬 정보 수정
router.put('/small/:id/sort-index', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    sortIndex: paramObject.sortIndex,
    categoryMiddleId: paramObject.categoryMiddleId
  };
  dbService
    .executeQueryById(queryIdPrefix + 'updateSmallSortIndexToAfter', dbParam)
    .then(() => {
      return dbService.updateOnly('category_small', dbParam, id).then(() => {
        return dbService
          .selectQueryById(queryIdPrefix + 'getCategorySmall', {
            id: id
          })
          .then((result) => {
            res.send(result[0]);
          });
      });
    })
    .catch(errorRouteHandler(next));
});
module.exports = router;
