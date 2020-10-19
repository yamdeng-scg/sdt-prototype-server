'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

router.get('/:queryName', function (req, res, next) {
  let queryParameter = req.query;
  let queryName = req.params.queryName;
  dbService
    .selectQueryById(queryName, queryParameter)
    .then((result) => {
      let responseResult = result;
      if (queryName.indexOf('get') !== -1) {
        responseResult = result[0];
      }
      res.send(responseResult);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
