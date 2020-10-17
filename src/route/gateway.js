'use strict';

const express = require('express');
const logger = require('../utils/logger');
const STATIC_CONFIG = require('../config/static');
const AppError = require('../errors/AppError');
const router = express.Router();
const _ = require('lodash');
const dbService = require('../services/db');
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const errorRouteHandler = require('../errors/routeHandler');

// cloud ping
router.post('/cloudPing',
    function (req, res, next) {
        // validate : 'url'
        logger.info('ping cloud url : ' + req.body.url);
        const cloudUrl = req.body.url;
        dbService.selectQueryById('findSettingInfo', ['CloudInfo', 'Status'])
            .then((result) => {
                const cloudStatus = result[0].Value;
                if (cloudStatus === STATIC_CONFIG.CLOUD_STATUS_ING) {
                    throw new AppError('작업중입니다', []);
                }
                // response delete 하고 address와 status 정보 반영하기
                return dbService.executeQueryByStr('delete from setting_info where Category = ? and Type = ?', ['CloudInfo', 'Response'])
                    .then(() => {
                        let promiseList = [];
                        promiseList.push(dbService.executeQueryById('updateSettingInfo', [cloudUrl, 'CloudInfo', 'Address']));
                        promiseList.push(dbService.executeQueryById('updateSettingInfo', [STATIC_CONFIG.CLOUD_STATUS_ING, 'CloudInfo', 'Status']));
                        return Promise.all(promiseList);
                    }).then(() => {
                        res.send({ success: true });
                        dbService.insert('table_change_info', { table_name: 'setting_info', column_name: 'all' });
                        return true;
                    });
            }).catch(errorRouteHandler(next));
    });

// cloud run
router.post('/cloudRun', function (req, res, next) {
    dbService.executeQueryById('updateSettingInfo', [STATIC_CONFIG.CLOUD_STATUS_RUN, 'CloudInfo', 'Status'])
        .then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'setting_info', column_name: 'all' });
        }).catch(errorRouteHandler(next));
});

// cloud stop
router.post('/cloudStop', function (req, res, next) {
    dbService.executeQueryById('updateSettingInfo', [STATIC_CONFIG.CLOUD_STATUS_STOP, 'CloudInfo', 'Status'])
        .then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'setting_info', column_name: 'all' });
        }).catch(errorRouteHandler(next));
});

// cloud ping시 받은 response 정보
router.get('/cloudResponse', function (req, res, next) {
    dbService.select('setting_info')
        .then((result) => {
            let responseResult = {};
            // url, status, response
            result.forEach(info => {
                if (info.Category === 'CloudInfo' && info.Type === 'Address') {
                    responseResult.url = info.Value;
                }
                if (info.Category === 'CloudInfo' && info.Type === 'Status') {
                    responseResult.status = info.Value;
                }
                if (info.Category === 'CloudInfo' && info.Type === 'Response') {
                    responseResult.response = info.Value;
                }
                if (!responseResult.response && responseResult.status !== STATIC_CONFIG.CLOUD_STATUS_ING) {
                    responseResult.status = STATIC_CONFIG.CLOUD_STATUS_READY;
                }
            });
            res.send(responseResult);
        }).catch(errorRouteHandler(next));
});

// gateway autodiscovery start
router.post('/autoDiscoveryStart',
    function (req, res, next) {
        // validate : 'eth_response_wait_ms', 'eth_retry_count', 'eth_start_address', 'eth_end_address'
        dbService.select('control_discovery')
            .then((result) => {
                let discoveryInfo = result[0];
                if (discoveryInfo.eth_discovery_start) {
                    return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
                } else if (discoveryInfo.eth_initialize) {
                    return Promise.reject(new AppError('initialize 작업 진행중입니다'));
                } else if (discoveryInfo.eth_run) {
                    return Promise.reject(new AppError('run 작업 진행중입니다'));
                }
                let updateRtuInfo = _.pick(req.body, ['eth_response_wait_ms', 'eth_retry_count', 'eth_start_address', 'eth_end_address']);
                let updateControlDiscoveryInfo = {};
                updateControlDiscoveryInfo['eth_discovery_start'] = 1;
                updateControlDiscoveryInfo['eth_discovery_stop'] = 0;
                let promiseList = [];
                promiseList.push(dbService.updateAll('control_discovery', updateControlDiscoveryInfo));
                promiseList.push(dbService.updateAll('setting_modbus_rtu', updateRtuInfo));
                return Promise.all(promiseList);
            }).then(() => {
                res.send({ success: true });
                dbService.insert('table_change_info', { table_name: 'setting_modbus_rtu', column_name: 'all' })
                    .then(() => {
                        dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'eth_discovery_start' });
                    });

            }).catch(errorRouteHandler(next));
    });

// gateway autodiscovery stop
router.post('/autoDiscoveryStop', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.eth_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            } else if (discoveryInfo.eth_run) {
                return Promise.reject(new AppError('run 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['eth_discovery_start'] = 0;
            updateControlDiscoveryInfo['eth_discovery_stop'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'eth_discovery_stop' });
        }).catch(errorRouteHandler(next));
});

// backup되고 있는 게이트웨이 목록
router.get('/backupDiscoveredGateways', function (req, res, next) {
    dbService.selectQueryById('backupDiscoveredGateways')
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// gateway autodiscovery된 게이트웨이 목록
router.get('/discoveredGateways', function (req, res, next) {
    dbService.selectQueryById('discoveredGateways')
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// gateway autodiscovery confirm
router.post('/autoDiscoveryConfirm', function (req, res, next) {
    dbService.select('control_discovery')
        .then(() => {
            // let discoveryInfo = result[0];
            // if (discoveryInfo.ch1_discovery_start) {
            //     return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            // } else if (discoveryInfo.ch1_initialize) {
            //     return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            // }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['eth_confirm'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'eth_confirm' });
        }).catch(errorRouteHandler(next));
});

// gateway run
router.post('/run', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.eth_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.eth_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['eth_run'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'eth_run' });
        }).catch(errorRouteHandler(next));
});

// gateway stop
router.post('/stop', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.eth_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.eth_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['eth_run'] = 0;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'eth_run' });
        }).catch(errorRouteHandler(next));
});

// gateway init
router.post('/init', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.eth_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.eth_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            } else if (discoveryInfo.eth_run) {
                return Promise.reject(new AppError('run 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['eth_initialize'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'eth_initialize' });
        }).catch(errorRouteHandler(next));
});

// model : product_code
// name : product_name
// serial number : serial_number
// manufacturer : manufacturer_name
// fw version : product_hw_ver
// ip address : X
// location : location_building
// floor : location_floor
// zone : location_zone
// panel name : panel_name

// gateway 기본 정보
router.get('/basic', function (req, res, next) {
    dbService.select('gateway_data')
        .then((result) => {
            let gatewayInfo = result[0];
            gatewayInfo = _.pick(gatewayInfo, ['product_code', 'product_name', 'serial_number', 'manufacturer_name', 'product_hw_ver', 'product_sw_ver', 'location_building', 'location_floor', 'location_zone', 'panel_name', 'user_defined_device_name']);
            res.send(gatewayInfo);
        }).catch(errorRouteHandler(next));
});

// gateway 기본 정보 수정
router.put('/basic',
    function (req, res, next) {
        let updateGatewayInfo = _.pick(req.body, ['product_code', 'product_name', 'serial_number', 'manufacturer_name', 'product_hw_ver', 'product_sw_ver', 'location_building', 'location_floor', 'location_zone', 'panel_name', 'user_defined_device_name']);
        dbService.updateAll('gateway_data', updateGatewayInfo)
            .then(() => {
                res.send({ success: true });
                dbService.insert('table_change_info', { table_name: 'gateway_data', column_name: 'all' });
            }).catch(errorRouteHandler(next));
    });

// gateway 로그 정보
router.get('/systemLogs', function (req, res, next) {
    dbService.selectQueryByStr('select * from system_log order by id desc')
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// 게이트웨이의 상태
router.get('/status', function (req, res, next) {
    dbService.select('information_system')
        .then((result) => {
            let statusInfo = result[0];
            res.send({
                status: statusInfo.eth_status
            });
        }).catch(errorRouteHandler(next));
});

// 시스템 이벤트 로그 정보
router.get('/systemEventLogs', function (req, res, next) {
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 5000000;
    const page = req.query.page ? Number(req.query.page) : 1;
    dbService.selectQueryById('getInfoEventAllCount')
        .then((totalCountQueryResult) => {
            const totalCount = totalCountQueryResult[0].totalCount;
            let result = {};
            result.totalCount = totalCount;
            return dbService.selectQueryById('getInfoEventAllList', [pageSize * (page - 1), pageSize])
                .then((data) => {
                    result.data = data;
                    res.send(result);
                });
        }).catch(errorRouteHandler(next));
});

// FAULT 이벤트 로그 정보
router.get('/faultEventLogs', function (req, res, next) {
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 5000000;
    const page = req.query.page ? Number(req.query.page) : 1;
    dbService.selectQueryById('getFaultEventAllCount')
        .then((totalCountQueryResult) => {
            const totalCount = totalCountQueryResult[0].totalCount;
            let result = {};
            result.totalCount = totalCount;
            return dbService.selectQueryById('getFaultEventAllList', [pageSize * (page - 1), pageSize])
                .then((data) => {
                    result.data = data;
                    res.send(result);
                });
        }).catch(errorRouteHandler(next));
});

// tripwave 차트 로그 정보
router.get('/tripWaveLogs', function (req, res, next) {
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 5000000;
    const page = req.query.page ? Number(req.query.page) : 1;
    dbService.selectQueryById('getTripwaveAllCount')
        .then((totalCountQueryResult) => {
            const totalCount = totalCountQueryResult[0].totalCount;
            let result = {};
            result.totalCount = totalCount;
            return dbService.selectQueryById('getTripwaveAllList', [pageSize * (page - 1), pageSize])
                .then((data) => {
                    result.data = data;
                    res.send(result);
                });
        }).catch(errorRouteHandler(next));
});


module.exports = router;