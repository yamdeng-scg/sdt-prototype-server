'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'company.';

/*

  1.회사 목록
    : / GET

  2.회사 상세
    : /:id GET

 */

// 회사 목록
router.get('/', function (req, res, next) {
  dbService
    .select('company')
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

// 회사 상세
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = { id: id };
  let queryId = queryIdPrefix + 'getDetail';
  dbService
    .selectQueryById(queryId, paramObject)
    .then((data) => {
      res.send(data[0]);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
