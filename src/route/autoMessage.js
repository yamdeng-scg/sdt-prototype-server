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

module.exports = router;
