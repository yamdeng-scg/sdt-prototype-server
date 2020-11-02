'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const Config = require('../config/config');
const AppError = require('../error/AppError');
const queryIdPrefix = 'message.';

router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let queryId = paramObject.queryId;
  queryId = queryIdPrefix + queryId;
  paramObject.startId = paramObject.startId || null;
  paramObject.endId = paramObject.endId || null;
  paramObject.messageAdminType = paramObject.messageAdminType || null;
  paramObject.intervalDay =
    paramObject.intervalDay || Config.DEFAULT_MESSAGE_INTERVAL_DAY;
  paramObject.pageSize =
    paramObject.pageSize || Config.DEFAULT_MESSAGE_MORE_PAGE_SIZE;
  dbService
    .selectQueryById(queryId, paramObject)
    .then((result) => {
      let responseResult = result;
      res.send(responseResult);
    })
    .catch(errorRouteHandler(next));
});

// 메시지 삭제
router.delete('/:id', function (req, res, next) {
  // getReadCountByMessageId
  // deleteMessageRead
  // delete
  let id = req.params.id;
  dbService
    .selectQueryById(queryIdPrefix + 'getReadCountByMessageId', { id: id })
    .then((result) => {
      let countInfo = result[0];
      let readCount = countInfo.readCount;
      if (readCount < 0) {
        throw new AppError('읽은 메시지입니다', null, 500);
      } else {
        return dbService
          .selectQueryById(queryIdPrefix + 'deleteMessageRead', {
            id: id
          })
          .then(() =>
            dbService.selectQueryById(queryIdPrefix + 'delete', {
              id: id
            })
          )
          .then(() => {
            res.send({ success: true });
          });
      }
    })
    .catch(errorRouteHandler(next));

  // dbService
  //   .delete('wise_say', id)
  //   .then((data) => {
  //     res.send(data);
  //   })
  //   .catch(errorRouteHandler(next));
});

module.exports = router;
