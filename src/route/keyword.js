'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'keyword.';

/*

1.전체 목록 : findAll
 : / GET

2.생성
 : / POST

3.상세
 : /:id GET

*/

// 키워드 생성 : 이름으로 키워드 등록
router.post('/', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'getByName', {
      companyId: paramObject.companyId,
      name: paramObject.name
    })
    .then((result) => {
      if (result && result.length) {
        res.send(result[0]);
      } else {
        let dbParam = {
          companyId: paramObject.companyId,
          name: paramObject.name,
          updateMemberId: paramObject.updateMemberId
        };
        return dbService.insert('keyword2', dbParam).then((newKeyword) => {
          res.send(newKeyword);
        });
      }
    })
    .catch(errorRouteHandler(next));
});

// 키워드 전체 조회
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'findAll', {
      companyId: paramObject.companyId
    })
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
