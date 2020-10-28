'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

router.post('/:queryId', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let queryId = req.params.queryId;
  dbService
    .executeQueryById(queryId, jsonBody)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
