'use strict';

const express = require('express');
const router = express.Router();
const companyService = require('../service/company');
const errorRouteHandler = require('../error/routeHandler');

// 사용계약번호 목록 및 프로필(캐시)
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let { gasappMemberNumber, companyId } = paramObject;
  let promiseList = [];
  let cash = 0;
  let contracts = [];
  promiseList.push(
    companyService.getAppProfile(gasappMemberNumber).then((data) => {
      cash = data.cash;
      return true;
    })
  );
  promiseList.push(
    companyService.getContracts(companyId, gasappMemberNumber).then((data) => {
      contracts = data;
      return true;
    })
  );
  Promise.all(promiseList)
    .then(() => {
      let result = { cash: cash, contracts: contracts };
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 사용계약번호 상세
router.get('/:useContractNum', function (req, res, next) {
  let useContractNum = req.params.useContractNum;
  let paramObject = req.paramObject;
  let { companyId } = paramObject;
  let result = null;
  companyService
    .getContractDetail(companyId, useContractNum)
    .then((contractInfo) => {
      result = contractInfo;
      if (result && result.history && result.history.length) {
        let firstHistoryInfo = result.history[0];
        return companyService
          .getBillDetail(
            companyId,
            useContractNum,
            firstHistoryInfo.requestYm,
            firstHistoryInfo.deadlineFlag
          )
          .then((billInfo) => {
            result.bill = billInfo;
            res.send(result);
          });
      } else {
        res.send(result);
      }
    })
    .catch(errorRouteHandler(next));
});

// 청구정보 상세
router.get('/:useContractNum/bill', function (req, res, next) {
  let useContractNum = req.params.useContractNum;
  let paramObject = req.paramObject;
  let { companyId, requestYm, deadlineFlag } = paramObject;
  companyService
    .getBillDetail(companyId, useContractNum, requestYm, deadlineFlag)
    .then((data) => {
      res.send(data);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
