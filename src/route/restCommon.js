'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

// 등록
router.post('/:tableName', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let tableName = _.snakeCase(req.params.tableName);
  dbService
    .insert(tableName, jsonBody)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 수정(한건)
router.put('/:tableName/:id', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let tableName = _.snakeCase(req.params.tableName);
  let id = req.params.id;
  dbService
    .update(tableName, jsonBody, id)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 수정(전체)
router.put('/:tableName', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let tableName = _.snakeCase(req.params.tableName);
  dbService
    .updateAll(tableName, jsonBody)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 명언 상세
router.get('/:tableName/:id', function (req, res, next) {
  let tableName = _.snakeCase(req.params.tableName);
  let id = req.params.id;
  dbService
    .selectOne(tableName, id)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 조회 : page query
router.get('/:tableName', function (req, res, next) {
  let tableName = _.snakeCase(req.params.tableName);
  let queryParameter = req.query;
  dbService
    .select(tableName, queryParameter)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 삭제(전체)
router.delete('/:tableName', function (req, res, next) {
  let tableName = _.snakeCase(req.params.tableName);
  dbService
    .deleteAll(tableName)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 삭제(한건)
router.delete('/:tableName/:id', function (req, res, next) {
  let tableName = _.snakeCase(req.params.tableName);
  let id = req.params.id;
  dbService
    .delete(tableName, id)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
