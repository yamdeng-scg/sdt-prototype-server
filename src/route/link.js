'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const _ = require('lodash');
const queryIdPrefix = 'link.';

// 활성화 되어있는 메뉴에 속한 링크 상세 조회
router.get('/findDetilByMenuIdAndEnableStatus', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'findDetilByMenuIdAndEnableStatus', {
      companyId: paramObject.companyId,
      menuId: paramObject.menuId
    })
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 메뉴 전체 조회
router.get('/findMenuAll', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'findMenuAll', {
      companyId: paramObject.companyId
    })
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 상세 전체 조회
router.get('/findDetailAll', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'findDetailAll', {
      companyId: paramObject.companyId
    })
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 전체 목록 : 트리
router.get('/tree', function (req, res, next) {
  let paramObject = req.paramObject;
  let promiseList = [];
  let menuList = [];
  let linkDetailList = [];
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findMenuAll', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        menuList = result;
        return true;
      })
  );
  promiseList.push(
    dbService
      .selectQueryById(queryIdPrefix + 'findDetailAll', {
        companyId: paramObject.companyId
      })
      .then((result) => {
        linkDetailList = result;
        return true;
      })
  );
  Promise.all(promiseList)
    .then(() => {
      menuList.forEach((menuInfo) => {
        menuInfo.childs = _.filter(linkDetailList, (linkDetailInfo) => {
          return linkDetailInfo.menuId === menuInfo.id;
        });
      });
      res.send(menuList);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
