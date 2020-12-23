'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'member.';
const _ = require('lodash');

// 회원 수정 : 상태
router.put('/:id/state', function (req, res, next) {
  let paramObject = req.paramObject;
  let id = req.params.id;
  paramObject.id = id;
  dbService
    .executeQueryById(queryIdPrefix + 'updateState', paramObject)
    .then(() => {
      return dbService
        .selectQueryById(queryIdPrefix + 'getDetail', { id: id })
        .then((result) => {
          let profile = result[0];
          let filterProfile = _.pick(
            profile,
            'id',
            'companyId',
            'companyUseConfigJson',
            'companyName',
            'isAdmin',
            'authLevel',
            'loginName',
            'state',
            'profileImageId',
            'speakerId',
            'name'
          );
          res.send(filterProfile);
        })
        .catch(errorRouteHandler(next));
    })
    .catch(errorRouteHandler(next));
});

// 회원 수정 : 권한, 상태
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = { state: paramObject.state, authLevel: paramObject.authLevel };
  dbService
    .update('member', dbParam, id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 회원 검색 : 이름, 사번
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
          result.list = data;
          res.send(result);
        });
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
