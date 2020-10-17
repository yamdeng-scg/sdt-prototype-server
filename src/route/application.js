'use strict';

// const CONFIG = require('../config');
const express = require('express');
// const portscanner = require('portscanner');
const path = require('path');
const router = express.Router();
const dbService = require('../services/db');
// const modbusService = require('../services/modbus');
const moment = require('moment');
// const AppError = require('../errors/AppError');
const logger = require('../utils/logger');
// const _ = require('lodash');
const errorRouteHandler = require('../errors/routeHandler');
const process = require('process');
const os = require('os');

// table select
// router.get('/selectTable/:table_name', function (req, res, next) {
//     dbService.select(req.params.table_name)
//         .then((result) => {
//             res.send(result);
//         }).catch(errorRouteHandler(next));
// });

// server, db, modbus alive check
// router.get('/health', function (req, res) {
//     dbService.connection.ping((error) => {
//         let dbAlive = false;
//         if (!error) {
//             dbAlive = true;
//         }
//         portscanner.checkPortStatus(CONFIG.modbus.port, CONFIG.modbus.host, (error, status) => {
//             res.send({ serverAlive: true, dbAlive: dbAlive, modbusAlive: status === 'open' ? true : false });
//         });
//     });
// });

// testModbus
// router.get('/testModbus', function (req, res, next) {
//     modbusService.getAddress(req.query.logical_identifier, req.query.function_code, req.query.address, req.query.quantity)
//         .then((result) => {
//             res.send(result);
//         }).catch(errorRouteHandler(next));
// });

// admin으로 수동 로그인하기 위한 작업
router.get('/manualLogin', function (req, res) {
    let token = req.query.token;
    let decodeToken = new Buffer(token, 'base64').toString();
    logger.info('manualLogin decodeToken : ' + decodeToken);
    if (decodeToken === moment().format('YYYYMMDD') + 'lsis') {
        res.sendFile(path.join(__dirname, '../../view', 'manualLogin.html'));
    } else {
        res.redirect('/');
    }
});

// db users
// router.get('/users', function (req, res, next) {
//     dbService.select('gateway_user')
//         .then((result) => {
//             res.send(result);
//         }).catch(errorRouteHandler(next));
// });

// // db user 1 row
// router.get('/users/:id', function (req, res, next) {
//     dbService.selectQueryById('findUserByLoginId', [req.params.id])
//         .then((result) => {
//             if (result.length > 0) {
//                 let findUser = result[0];
//                 res.send(findUser);
//             } else {
//                 return Promise.reject(new AppError('존재하지 않는 ID 입니다'));
//             }
//         }).catch(errorRouteHandler(next));
// });

// // table 컬럼정보를 json 키값으로 반환 : 기본값 존재시 해당 기본값으로 셋팅
// router.get('/tableInfoToJson1', function (req, res, next) {
//     dbService.selectQueryById('getTableInfoToObjectDefaultValue', [req.query.tableName])
//         .then((result) => {
//             if (result.length > 0) {
//                 let tableJsonInfo = {};
//                 _.forEach(result, (info) => {
//                     if (info.data_type.indexOf('varchar') != -1 || info.data_type.indexOf('text') != -1) {
//                         if (info.column_default && info.column_default !== 'NULL') {
//                             tableJsonInfo[info.column_name] = info.column_default;
//                         } else {
//                             tableJsonInfo[info.column_name] = '';
//                         }
//                     } else {
//                         if (info.column_default && info.column_default !== 'NULL') {
//                             tableJsonInfo[info.column_name] = Number(info.column_default);
//                         } else {
//                             tableJsonInfo[info.column_name] = 0;
//                         }
//                     }
//                 });
//                 res.send(tableJsonInfo);
//             } else {
//                 return Promise.reject(new AppError('존재하지 않는 테이블 입니다'));
//             }
//         }).catch(errorRouteHandler(next));
// });

// // table 컬럼정보를 json 키값으로 반환
// router.get('/tableInfoToJson2', function (req, res, next) {
//     dbService.selectQueryById('getTableInfoToObjectDefaultValue', [req.query.tableName])
//         .then((result) => {
//             if (result.length > 0) {
//                 let tableJsonInfo = {};
//                 _.forEach(result, (info) => {
//                     if (info.data_type.indexOf('varchar') != -1 || info.data_type.indexOf('text') != -1) {
//                         tableJsonInfo[info.column_name] = '';
//                     } else {
//                         tableJsonInfo[info.column_name] = 0;
//                     }
//                 });
//                 res.send(tableJsonInfo);
//             } else {
//                 return Promise.reject(new AppError('존재하지 않는 테이블 입니다'));
//             }
//         }).catch(errorRouteHandler(next));
// });

// // 전체 table 수정
// router.put('/updateTableAll', function (req, res, next) {
//     const table = req.body.table;
//     const updateInfo = req.body.updateInfo;
//     dbService.updateAll(table, updateInfo)
//         .then(() => {
//             res.send({ success: true });
//         }).catch(errorRouteHandler(next));
// });

// // 테이블 한건 수정
// router.put('/updateTableByColumnInfo', function (req, res, next) {
//     const table = req.body.table;
//     const updateInfo = req.body.updateInfo;
//     const columnName = req.body.columnName;
//     const columnValue = req.body.columnValue;
//     dbService.update(table, updateInfo, columnName, columnValue)
//         .then(() => {
//             res.send({ success: true });
//         }).catch(errorRouteHandler(next));
// });

// // 테이블 insert
// router.post('/insertTable', function (req, res, next) {
//     const table = req.body.table;
//     const insertInfo = req.body.insertInfo;
//     dbService.insert(table, insertInfo)
//         .then(() => {
//             res.send({ success: true });
//         }).catch(errorRouteHandler(next));
// });

// 메모리 체크
router.get('/memoryUsage', function (req, res) {
    let result = process.memoryUsage();
    result.totalmem = os.totalmem();
    result.freemem = os.freemem();
    res.send(result);
});


// 테마 변경
router.put('/updateTheme', function (req, res, next) {
    const theme = req.body.theme;
    const updateInfo = { theme: theme };
    dbService.updateAll('global_option_info', updateInfo)
        .then(() => {
            res.send({ success: true });
        }).catch(errorRouteHandler(next));
});

// 다국어 변경
router.put('/updateLocale', function (req, res, next) {
    const locale = req.body.locale;
    const updateInfo = { locale: locale };
    dbService.updateAll('global_option_info', updateInfo)
        .then(() => {
            res.send({ success: true });
        }).catch(errorRouteHandler(next));
});

// 테마, 다국어 정보
router.get('/themeAndLocalInfo', function (req, res, next) {
    dbService.select('global_option_info')
        .then((result) => {
            let optionInfo = result[0];
            res.send(optionInfo);
        }).catch(errorRouteHandler(next));
});

module.exports = router;