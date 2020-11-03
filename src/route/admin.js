'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

// 링크 메뉴 등록
router.post('/link-menu', function (req, res, next) {
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

// 링크 메뉴 등록
router.put('/link-menu/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    name: paramObject.name
  };
  dbService
    .update('link_menu', dbParam, id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 메뉴 조회
router.get('/link-menu', function (req, res, next) {
  dbService
    .select('link_menu')
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 메뉴 상세
router.get('/link-menu/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .selectOne('link_menu', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 메뉴 삭제
router.delete('/link-menu/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('link_menu', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 정보 등록
router.post('/link-detail', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    companyId: paramObject.companyId,
    linkText: paramObject.linkText,
    linkProtocol: paramObject.linkProtocol,
    linkUrl: paramObject.linkUrl,
    enable: paramObject.enable,
    menuId: paramObject.menuId
  };
  dbService
    .insert('link_detail', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 정보 수정
router.put('/link-detail/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    linkText: paramObject.linkText,
    linkProtocol: paramObject.linkProtocol,
    linkUrl: paramObject.linkUrl,
    enable: paramObject.enable,
    menuId: paramObject.menuId
  };
  dbService
    .update('link_detail', dbParam, id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 상세 활성화 / 비활성화
router.put('/link-detail/:id/enable', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    enable: paramObject.value
  };
  dbService
    .update('link_detail', dbParam, id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 정보 조회
router.get('/link-detail', function (req, res, next) {
  dbService
    .select('link_detail')
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 메뉴 상세
router.get('/link-detail/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .selectOne('link_detail', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 링크 메뉴 삭제
router.delete('/link-detail/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('link_detail', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
