'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

router.get('/:queryId', function (req, res, next) {
  let queryParameter = req.query;
  let queryId = req.params.queryId;
  dbService
    .selectQueryById(queryId, queryParameter)
    .then((result) => {
      let responseResult = result;
      if (queryId.indexOf('get') !== -1) {
        responseResult = result[0];
      }
      res.send(responseResult);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
