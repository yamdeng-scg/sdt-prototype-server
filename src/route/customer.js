'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'customer.';

// 욕설 사용 회수, 부적절한 멘트 횟수 반영
router.put('/:id/badTalkCount', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    id: id,
    swearCount: paramObject.swearCount,
    insultCount: paramObject.insultCount,
    loginId: paramObject.loginId,
    companyId: paramObject.companyId
  };
  dbService
    .executeQueryById(queryIdPrefix + 'updateSwearInsultCount', dbParam)
    .then(() => {
      return dbService.selectOne('v_customer', id).then((result) => {
        res.send(result);
      });
    })
    .catch(errorRouteHandler(next));
});

// 관심고객 지정 / 해제
router.put('/:id/block', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    id: id,
    blockType: paramObject.blockType,
    remark: paramObject.remark,
    loginId: paramObject.loginId,
    companyId: paramObject.companyId
  };
  let queryId = '';
  if (!paramObject.blockType) {
    queryId = 'disableBlock';
  } else {
    queryId = 'enableBlock';
  }
  dbService
    .executeQueryById(queryIdPrefix + queryId, dbParam)
    .then(() => {
      return dbService.selectOne('v_customer', id).then((result) => {
        res.send(result);
      });
    })
    .catch(errorRouteHandler(next));
});

// 관심고객 해제
router.delete('/:id/block', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    id: id,
    blockType: paramObject.blockType,
    remark: paramObject.remark,
    loginId: paramObject.loginId,
    companyId: paramObject.companyId
  };
  dbService
    .executeQueryById(queryIdPrefix + 'disableBlock', dbParam)
    .then(() => {
      return dbService.selectOne('v_customer', id).then((result) => {
        res.send(result);
      });
    })
    .catch(errorRouteHandler(next));
});

// 고객 검색 : 고객명, 휴대폰번호, 사유, 메모, 지정자
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  const pageSize = paramObject.pageSize ? Number(req.query.pageSize) : 5000000;
  const page = paramObject.page ? Number(paramObject.page) : 1;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    searchType: paramObject.searchType || 'all',
    searchValue: paramObject.searchValue || '',
    limit: pageSize * (page - 1),
    pageSize: pageSize
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findSearchCount', dbParam)
    .then((totalCountQueryResult) => {
      const totalCount = totalCountQueryResult[0].totalCount;
      let result = {};
      result.totalCount = totalCount;
      return dbService
        .selectQueryById(queryIdPrefix + 'findSearch', dbParam)
        .then((data) => {
          result.data = data;
          res.send(result);
        });
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
