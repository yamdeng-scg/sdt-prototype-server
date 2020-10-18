'use strict';

const dbService = require('../service/db');
const AppError = require('../error/AppError');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
// router.use(authMiddleware);
const errorRouteHandler = require('../error/routeHandler');
const deviceTypeMapping = require('../config/deviceTypeMapping');

// 디바이스 정보 얻어오기(셋팅)
router.get('/:channel_number/:logical_identifier', authMiddleware, function (
  req,
  res,
  next
) {
  dbService
    .selectOne(
      'information_device_data_ch' + req.params.channel_number,
      'logical_identifier',
      req.params.logical_identifier
    )
    .then((result) => {
      if (result) {
        result.device_kind = deviceTypeMapping.getDeviceKind(
          result.device_name,
          result.product_code
        );
        res.send(result);
      } else {
        return Promise.reject(new AppError('not found', [], 404));
      }
    })
    .catch(errorRouteHandler(next));
});

// 디바이스 정보 수정하기(셋팅)
router.put('/:channel_number/:logical_identifier', authMiddleware, function (
  req,
  res,
  next
) {
  // validate : user_defined_name
  let updateDeviceInfo = req.body;
  delete updateDeviceInfo.device_kind;
  dbService
    .update(
      'information_device_data_ch' + req.params.channel_number,
      updateDeviceInfo,
      'logical_identifier',
      req.params.logical_identifier
    )
    .then(() => {
      res.send({ success: true });
      dbService.insert('table_change_info', {
        table_name: 'information_device_data_ch' + req.params.channel_number,
        column_name: req.params.logical_identifier
      });
    })
    .catch(errorRouteHandler(next));
});

// smtp address 정보
router.get(
  '/:channel_number/:logical_identifier/smtp',
  authMiddleware,
  function (req, res, next) {
    dbService
      .selectOne(
        'remote_smtp',
        'logical_identifier',
        req.params.logical_identifier
      )
      .then((result) => {
        if (result) {
          res.send(result);
        } else {
          return res.send({});
        }
      })
      .catch(errorRouteHandler(next));
  }
);

// smtp address 저장
router.put(
  '/:channel_number/:logical_identifier/smtp',
  authMiddleware,
  function (req, res, next) {
    let smtpInfo = req.body;
    smtpInfo.channel_number = req.params.channel_number;
    smtpInfo.logical_identifier = req.params.logical_identifier;
    dbService
      .selectOne(
        'remote_smtp',
        'logical_identifier',
        req.params.logical_identifier
      )
      .then((result) => {
        if (result) {
          // update
          return dbService
            .update(
              'remote_smtp',
              smtpInfo,
              'logical_identifier',
              req.params.logical_identifier
            )
            .then(() => {
              res.send({ success: true });
            });
        } else {
          // insert
          return dbService.insert('remote_smtp', smtpInfo).then(() => {
            res.send({ success: true });
          });
        }
      })
      .catch(errorRouteHandler(next));
  }
);

// gcm 정보
router.get(
  '/:channel_number/:logical_identifier/gcm',
  authMiddleware,
  function (req, res, next) {
    dbService
      .selectOne(
        'remote_gcm',
        'logical_identifier',
        req.params.logical_identifier
      )
      .then((result) => {
        if (result) {
          res.send(result);
        } else {
          return res.send({});
        }
      })
      .catch(errorRouteHandler(next));
  }
);

// gcm 저장
router.put(
  '/:channel_number/:logical_identifier/gcm',
  authMiddleware,
  function (req, res, next) {
    let gcmInfo = req.body;
    gcmInfo.channel_number = req.params.channel_number;
    gcmInfo.logical_identifier = req.params.logical_identifier;
    dbService
      .selectOne(
        'remote_gcm',
        'logical_identifier',
        req.params.logical_identifier
      )
      .then((result) => {
        if (result) {
          // update
          return dbService
            .update(
              'remote_gcm',
              gcmInfo,
              'logical_identifier',
              req.params.logical_identifier
            )
            .then(() => {
              res.send({ success: true });
            });
        } else {
          // insert
          return dbService.insert('remote_gcm', gcmInfo).then(() => {
            res.send({ success: true });
          });
        }
      })
      .catch(errorRouteHandler(next));
  }
);

// systemEvent 정보
router.get(
  '/:channel_number/:logical_identifier/systemEventLogs',
  authMiddleware,
  function (req, res, next) {
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 5000000;
    const page = req.query.page ? Number(req.query.page) : 1;
    const countQueryId =
      req.params.channel_number === '1'
        ? 'getInfoEventLogCh1Count'
        : 'getInfoEventLogCh2Count';
    const listQueryId =
      req.params.channel_number === '1'
        ? 'getInfoEventLogCh1List'
        : 'getInfoEventLogCh2List';
    dbService
      .selectQueryById(countQueryId, [req.params.logical_identifier])
      .then((totalCountQueryResult) => {
        const totalCount = totalCountQueryResult[0].totalCount;
        let result = {};
        result.totalCount = totalCount;
        return dbService
          .selectQueryById(listQueryId, [
            req.params.logical_identifier,
            pageSize * (page - 1),
            pageSize
          ])
          .then((data) => {
            result.data = data;
            res.send(result);
          });
      })
      .catch(errorRouteHandler(next));
  }
);

// faultEvent 정보
router.get(
  '/:channel_number/:logical_identifier/faultEventLogs',
  authMiddleware,
  function (req, res, next) {
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 5000000;
    const page = req.query.page ? Number(req.query.page) : 1;
    const countQueryId =
      req.params.channel_number === '1'
        ? 'getFaultEventLogCh1Count'
        : 'getFaultEventLogCh2Count';
    const listQueryId =
      req.params.channel_number === '1'
        ? 'getFaultEventLogCh1List'
        : 'getFaultEventLogCh2List';
    dbService
      .selectQueryById(countQueryId, [req.params.logical_identifier])
      .then((totalCountQueryResult) => {
        const totalCount = totalCountQueryResult[0].totalCount;
        let result = {};
        result.totalCount = totalCount;
        return dbService
          .selectQueryById(listQueryId, [
            req.params.logical_identifier,
            pageSize * (page - 1),
            pageSize
          ])
          .then((data) => {
            result.data = data;
            res.send(result);
          });
      })
      .catch(errorRouteHandler(next));
  }
);

// tipWave 정보
router.get(
  '/:channel_number/:logical_identifier/tripWaveLogs',
  authMiddleware,
  function (req, res, next) {
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 5000000;
    const page = req.query.page ? Number(req.query.page) : 1;
    const countQueryId =
      req.params.channel_number === '1'
        ? 'getTripwaveLogCh1Count'
        : 'getTripwaveLogCh2Count';
    const listQueryId =
      req.params.channel_number === '1'
        ? 'getTripwaveLogCh1List'
        : 'getTripwaveLogCh2List';
    dbService
      .selectQueryById(countQueryId, [req.params.logical_identifier])
      .then((totalCountQueryResult) => {
        const totalCount = totalCountQueryResult[0].totalCount;
        let result = {};
        result.totalCount = totalCount;
        return dbService
          .selectQueryById(listQueryId, [
            req.params.logical_identifier,
            pageSize * (page - 1),
            pageSize
          ])
          .then((data) => {
            data.forEach((info) => {
              info.data = JSON.parse(info.data);
            });
            result.data = data;
            res.send(result);
          });
      })
      .catch(errorRouteHandler(next));
  }
);

// tipWave 1건에 대한 차트 정보
router.get(
  '/:channel_number/:logical_identifier/tripWaveLogs/:chartId',
  authMiddleware,
  function (req, res, next) {
    const tableName =
      req.params.channel_number === '1'
        ? 'tripwave_log_ch1'
        : 'tripwave_log_ch2';
    dbService
      .selectQueryByStr('select * from ' + tableName + ' where id = ?', [
        req.params.chartId
      ])
      .then((result) => {
        if (result && result.length) {
          let chartData = result[0];
          chartData.data = JSON.parse(chartData.data);
          res.send(chartData);
        } else {
          return Promise.reject(new AppError('not found', [], 404));
        }
      })
      .catch(errorRouteHandler(next));
  }
);

// systemEvent 정보 create
router.post('/:channel_number/:logical_identifier/systemEventLogs', function (
  req,
  res,
  next
) {
  let eventInfo = req.body;
  let tableName =
    req.params.channel_number === '1'
      ? 'info_event_log_ch1'
      : 'info_event_log_ch2';
  dbService
    .insert(tableName, eventInfo)
    .then(() => {
      res.send({ success: true });
    })
    .catch(errorRouteHandler(next));
});

// faultEvent 정보 create
router.post('/:channel_number/:logical_identifier/faultEventLogs', function (
  req,
  res,
  next
) {
  let eventInfo = req.body;
  let tableName =
    req.params.channel_number === '1'
      ? 'fault_event_log_ch1'
      : 'fault_event_log_ch2';
  dbService
    .insert(tableName, eventInfo)
    .then(() => {
      res.send({ success: true });
    })
    .catch(errorRouteHandler(next));
});

// tipWave 정보 create
router.post('/:channel_number/:logical_identifier/tripWaveLogs', function (
  req,
  res,
  next
) {
  let eventInfo = req.body;
  let tableName =
    req.params.channel_number === '1' ? 'tripwave_log_ch1' : 'tripwave_log_ch2';
  eventInfo.data = JSON.stringify(eventInfo.data);
  dbService
    .insert(tableName, eventInfo)
    .then(() => {
      res.send({ success: true });
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
