'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');

router.post('/:queryName', function (req, res, next) {
  let jsonBody = Object.assign({}, req.body);
  let queryName = req.params.queryName;
  dbService
    .executeQueryById(queryName, jsonBody)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
