'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'stats.';

// 통계 : 회원 전체 기준
router.get('/member', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'member', {
      companyId: paramObject.companyId
    })
    .then((result) => {
      res.send(result[0]);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
