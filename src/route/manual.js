'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const _ = require('lodash');
const queryIdPrefix = 'manual.';

// 태그 목록
router.post('/tags', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    manualIndex: paramObject.manualIndex || 1
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findTagAll', dbParam)
    .then((result) => {
      let tagStringList = [];
      result.forEach((info) => {
        let tags = _.replace(info.tags, /–/g, '-');
        let infoArray = _.split(tags, '-');
        tagStringList = tagStringList.concat(infoArray);
      });
      res.send(_.uniq(tagStringList));
    })
    .catch(errorRouteHandler(next));
});

// 매뉴얼 검색
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  const pageSize = paramObject.pageSize ? Number(req.query.pageSize) : 5000000;
  const page = paramObject.page ? Number(paramObject.page) : 1;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    checkFavorite: paramObject.checkFavorite,
    tag: paramObject.tag || null,
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

// 메뉴얼 상세
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    id: id,
    manualIndex: paramObject.manualIndex || 1
  };
  dbService
    .selectQueryById(queryIdPrefix + 'getDetail', dbParam)
    .then((result) => {
      res.send(result[0]);
    })
    .catch(errorRouteHandler(next));
});

// 매뉴얼 등록
router.post('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {};
  dbParam.updateMemberId = paramObject.loginId;
  dbParam.companyId = paramObject.companyId;
  dbParam.manualIndex = paramObject.manualIndex || 1;
  dbParam.pageNo = paramObject.pageNo;
  dbParam.pageCode = paramObject.pageCode;
  dbParam.title = paramObject.title;
  dbParam.content = paramObject.content;
  dbParam.pdfImagePath = paramObject.pdfImagePath;
  dbService
    .selectQueryById(queryIdPrefix + 'getNextPageNumber', dbParam)
    .then((result) => {
      const maxPageNumber = result[0].maxPageNumber;
      dbParam.pageNumber = paramObject.pageNumber || maxPageNumber;
      return dbService
        .insert('manual', dbParam)
        .then((result) => {
          res.send(result);
        })
        .catch(errorRouteHandler(next));
    });
});

// 매뉴얼 수정
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {};
  dbParam.updateMemberId = paramObject.loginId;
  dbParam.pageNumber = paramObject.pageNumber;
  dbParam.pageNo = paramObject.pageNo;
  dbParam.pageCode = paramObject.pageCode;
  dbParam.title = paramObject.title;
  dbParam.content = paramObject.content;
  dbParam.pdfImagePath = paramObject.pdfImagePath;
  dbService
    .update('manual', dbParam, id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 매뉴얼 삭제
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('manual', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 매뉴얼 즐겨찾기 추가 / 삭제
router.put('/:id/favorite', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let value = paramObject.value;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    manualId: id
  };
  if (value) {
    dbService
      .executeQueryById(queryIdPrefix + 'createFavorite', dbParam)
      .then(() => {
        res.send({ success: true });
      })
      .catch(() => {
        res.send({ success: true });
      });
  } else {
    dbService
      .executeQueryById(queryIdPrefix + 'deleteFavoriteToMember', dbParam)
      .then(() => {
        res.send({ success: true });
      })
      .catch(errorRouteHandler(next));
  }
});

// 매뉴얼 채번
router.post('/getNextPageNumber', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    manualIndex: paramObject.manualIndex || 1
  };
  dbService
    .selectQueryById(queryIdPrefix + 'getNextPageNumber', dbParam)
    .then((result) => {
      const maxPageNumber = result[0].maxPageNumber;
      res.send({ nextPageNumber: maxPageNumber });
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
