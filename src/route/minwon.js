'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const logger = require('../util/logger');
const errorRouteHandler = require('../error/routeHandler');

// 민원 등록
router.post('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbQueryParam = {
    companyId: paramObject.companyId,
    useContractNum: paramObject.useContractNum,
    categorySmallId: paramObject.categorySmallId,
    minwonCode: paramObject.minwonCode,
    telNumber: paramObject.telNumber,
    memo: paramObject.telNumber,
    chatid: paramObject.chatid,
    gasappMemberNumber: paramObject.gasappMemberNumber,
    updateMemberId: paramObject.loginId
  };
  dbService
    .insert('minwon_history', dbQueryParam)
    .then((result) => {
      res.send(result);
      if (paramObject.categorySmallId) {
        dbService
          .executeQueryById('room.updateJoinHistoryByChatId', {
            categorySmallId: paramObject.categorySmallId,
            chatid: paramObject.chatid
          })
          .catch((error) => {
            logger.error('updateJoinHistoryByChatId query error : ' + error);
          });
      }
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
