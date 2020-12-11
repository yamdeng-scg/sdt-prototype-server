'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const Config = require('../config/config');
const companyConfig = require('../config/company');
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
  let id = req.params.id;
  let { companyId, loginSpeakerId } = req.paramObject;
  let isMessageDelete = companyConfig[companyId].isMessageDelete;
  dbService
    .selectQueryById(queryIdPrefix + 'getDetail', { id: id })
    .then((result) => {
      let messageInfo = result[0];
      if (!messageInfo.isEmployee) {
        throw new AppError(
          '고객이 작성한 메시지는 삭제할 수 없습니다.',
          null,
          500
        );
      } else if (messageInfo.speakerId == loginSpeakerId) {
        return dbService
          .selectQueryById(queryIdPrefix + 'getReadCountByMessageId', {
            id: id
          })
          .then((result) => {
            let countInfo = result[0];
            let readCount = countInfo.readCount;
            if (readCount < 0) {
              throw new AppError('읽은 메시지입니다', null, 500);
            } else {
              if (isMessageDelete) {
                return dbService
                  .executeQueryById(queryIdPrefix + 'deleteMessageRead', {
                    id: id
                  })
                  .then(() =>
                    dbService.executeQueryById(queryIdPrefix + 'delete', {
                      id: id
                    })
                  )
                  .then(() => {
                    res.send({ success: true });
                  });
              } else {
                return dbService
                  .executeQueryById(queryIdPrefix + 'deleteApplyValue', {
                    id: id
                  })
                  .then(() => {
                    res.send({ success: true });
                  });
              }
            }
          });
      } else {
        throw new AppError(
          '메시지 삭제는 메시지 작성자만 가능합니다.',
          null,
          500
        );
      }
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
