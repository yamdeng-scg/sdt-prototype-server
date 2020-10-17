'use strict';

const _ = require('lodash');
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const dbService = require('../services/db');
const AppError = require('../errors/AppError');
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const errorRouteHandler = require('../errors/routeHandler');
const STATIC_CONFIG = require('../config/static');

// 채널2 autoDiscovery start 수행
router.post('/autoDiscoveryStart',
    function (req, res, next) {
        //  validate : 'ch2_stop_bit', 'ch2_parity', 'ch2_response_wait_ms', 'ch2_retry_count', 'ch2_baudrate', 'ch2_start_address', 'ch2_end_address'
        dbService.select('control_discovery')
            .then((result) => {
                let discoveryInfo = result[0];
                if (discoveryInfo.ch2_discovery_start) {
                    return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
                } else if (discoveryInfo.ch2_initialize) {
                    return Promise.reject(new AppError('initialize 작업 진행중입니다'));
                } else if (discoveryInfo.ch2_run) {
                    return Promise.reject(new AppError('run 작업 진행중입니다'));
                }
                let updateControlDiscoveryInfo = {};
                updateControlDiscoveryInfo['ch2_discovery_start'] = 1;
                updateControlDiscoveryInfo['ch2_discovery_stop'] = 0;
                updateControlDiscoveryInfo['ch2_hmi'] = 0;
                updateControlDiscoveryInfo['ch2_hmi_run'] = 0;
                let updateRtuInfo = _.pick(req.body, ['ch2_stop_bit', 'ch2_parity', 'ch2_response_wait_ms', 'ch2_retry_count', 'ch2_baudrate', 'ch2_start_address', 'ch2_end_address']);
                let promiseList = [];
                promiseList.push(dbService.updateAll('control_discovery', updateControlDiscoveryInfo));
                promiseList.push(dbService.updateAll('setting_modbus_rtu', updateRtuInfo));
                return Promise.all(promiseList);
            }).then(() => {
                res.send({ success: true });
                dbService.insert('table_change_info', { table_name: 'setting_modbus_rtu', column_name: 'all' })
                    .then(() => {
                        dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_discovery_start' });
                    });
            }).catch(errorRouteHandler(next));
    });

// 채널2 autoDiscovery stop 수행
router.post('/autoDiscoveryStop', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch2_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            } else if (discoveryInfo.ch2_run) {
                return Promise.reject(new AppError('run 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch2_discovery_start'] = 0;
            updateControlDiscoveryInfo['ch2_discovery_stop'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_discovery_stop' });
        }).catch(errorRouteHandler(next));
});

// 채널2 init 수행
router.post('/init', function (req, res, next) {
    dbService.select('control_discovery')
        .then(function (result) {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch2_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.ch2_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            } else if (discoveryInfo.ch2_run) {
                return Promise.reject(new AppError('run 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch2_initialize'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            dbService.executeQueryByStr('delete from info_event_log_ch2 where channel_number = ?', [2]);
            dbService.executeQueryByStr('delete from fault_event_log_ch2 where channel_number = ?', [2]);
            dbService.executeQueryByStr('delete from tripwave_log_ch2 where channel_number = ?', [2]);
            dbService.executeQueryByStr('delete from remote_smtp where channel_number = ?', [2]);
            dbService.executeQueryByStr('delete from remote_gcm where channel_number = ?', [2]);
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_initialize' });
            res.send({ success: true });
        }).catch(errorRouteHandler(next));
});

// ch2 run
router.post('/run', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch2_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.ch2_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch2_run'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_gateway', column_name: 'time_sync_activation' })
                .then(() => {
                    dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_run' });
                });
        }).catch(errorRouteHandler(next));
});

// ch2 stop
router.post('/stop', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch2_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.ch2_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch2_run'] = 0;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_run' });
        }).catch(errorRouteHandler(next));
});

// 채널1에 backup되고 있는 디바이스 목록
router.get('/backupDiscoveredDevices', function (req, res, next) {
    dbService.selectQueryById('ch2BackupDiscoveredDevices')
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// 채널2에 discovery된 디바이스 목록
router.get('/discoveredDevices', function (req, res, next) {
    dbService.selectQueryById('ch2DiscoveredDevices')
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// ch2 autodiscovery confirm
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
            updateControlDiscoveryInfo['ch2_confirm'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_confirm' });
        }).catch(errorRouteHandler(next));
});

// 채널2의 상태
router.get('/status', function (req, res, next) {
    dbService.select('information_system')
        .then((result) => {
            let statusInfo = result[0];
            res.send({
                status: statusInfo.ch2_status
            });
        }).catch(errorRouteHandler(next));
});

// 채널2 hmi checkbox 선택시 수행
router.post('/hmiEnable',
    function (req, res, next) {
        dbService.select('information_system')
            .then((result) => {
                let statusInfo = result[0];
                if (statusInfo.ch1_status === STATIC_CONFIG.CH_DISCOVERY_STATUS_READY) {
                    return Promise.reject(new AppError('채널1의 autodiscovery 작업을 실행한 후 hmi 실행이 가능합니다'));
                } else {
                    return dbService.select('control_discovery')
                        .then((result) => {
                            let discoveryInfo = result[0];
                            logger.info('check discoveryInfo : ' + JSON.stringify(discoveryInfo));
                            let updateControlDiscoveryInfo = {};
                            updateControlDiscoveryInfo['ch2_hmi'] = 1;
                            let promiseList = [];
                            promiseList.push(dbService.updateAll('control_discovery', updateControlDiscoveryInfo));
                            return Promise.all(promiseList);
                        }).then(() => {
                            res.send({ success: true });
                            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_hmi' });
                        });
                }
            }).catch(errorRouteHandler(next));
    });

// 채널2 hmi checkbox 해제시 수행
router.post('/hmiDisable',
    function (req, res, next) {
        dbService.select('information_system')
            .then(() => {
                return dbService.select('control_discovery')
                    .then((result) => {
                        let discoveryInfo = result[0];
                        logger.info('check discoveryInfo : ' + JSON.stringify(discoveryInfo));
                        let updateControlDiscoveryInfo = {};
                        updateControlDiscoveryInfo['ch2_hmi'] = 0;
                        let promiseList = [];
                        promiseList.push(dbService.updateAll('control_discovery', updateControlDiscoveryInfo));
                        return Promise.all(promiseList);
                    }).then(() => {
                        res.send({ success: true });
                        dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_hmi' });
                    });
            }).catch(errorRouteHandler(next));
    });

// 채널2 hmiRun 수행
router.post('/hmiRun',
    function (req, res, next) {
        // validate : 'ch2_stop_bit', 'ch2_parity', 'ch2_response_wait_ms', 'ch2_retry_count', 'ch2_baudrate'
        dbService.select('information_system')
            .then((result) => {
                let statusInfo = result[0];
                if (statusInfo.ch1_status === STATIC_CONFIG.CH_DISCOVERY_STATUS_READY) {
                    return Promise.reject(new AppError('채널1의 autodiscovery 작업을 실행한 후 hmi run이 가능합니다'));
                } else {
                    return dbService.select('control_discovery')
                        .then((result) => {
                            let discoveryInfo = result[0];
                            logger.info('check discoveryInfo : ' + JSON.stringify(discoveryInfo));
                            let updateControlDiscoveryInfo = {};
                            updateControlDiscoveryInfo['ch2_hmi_run'] = 1;
                            let updateRtuInfo = _.pick(req.body, ['ch2_stop_bit', 'ch2_parity', 'ch2_response_wait_ms', 'ch2_retry_count', 'ch2_baudrate']);
                            let promiseList = [];
                            promiseList.push(dbService.updateAll('control_discovery', updateControlDiscoveryInfo));
                            promiseList.push(dbService.updateAll('setting_modbus_rtu', updateRtuInfo));
                            return Promise.all(promiseList);
                        }).then(() => {
                            res.send({ success: true });
                            dbService.insert('table_change_info', { table_name: 'setting_modbus_rtu', column_name: 'all' })
                                .then(() => {
                                    dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_hmi_run' });
                                });
                        });
                }
            }).catch(errorRouteHandler(next));
    });

// 채널2 hmiStop 수행
router.post('/hmiStop', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            logger.info('check discoveryInfo : ' + JSON.stringify(discoveryInfo));
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch2_hmi_run'] = 0;
            let promiseList = [];
            promiseList.push(dbService.updateAll('control_discovery', updateControlDiscoveryInfo));
            return Promise.all(promiseList);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch2_hmi_run' });
        }).catch(errorRouteHandler(next));
});

module.exports = router;