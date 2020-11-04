'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'template.';

// 자동 메시지 목록
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'findAutoMessageAll', {
      companyId: paramObject.companyId
    })
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 자동 메시지 등록
router.post('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    companyId: paramObject.companyId,
    message: paramObject.message,
    type: paramObject.type
  };
  dbService
    .insert('auto_message', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 자동 메시지 수정
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = {
    updateMemberId: paramObject.updateMemberId,
    message: paramObject.message
  };
  dbService
    .update('auto_message', dbParam, id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 자동 메시지 상세
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .selectOne('auto_message', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 자동 메시지 삭제
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('auto_message', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
