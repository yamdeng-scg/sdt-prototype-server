'use strict';

const _ = require('lodash');
const express = require('express');
const router = express.Router();
const dbService = require('../services/db');
const AppError = require('../errors/AppError');
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const errorRouteHandler = require('../errors/routeHandler');

// 채널1 autoDiscovery start 수행
router.post('/autoDiscoveryStart',
    function (req, res, next) {
        // 'ch1_stop_bit', 'ch1_parity', 'ch1_response_wait_ms', 'ch1_retry_count', 'ch1_baudrate', 'ch1_start_address', 'ch1_end_address'
        dbService.select('control_discovery')
            .then((result) => {
                let discoveryInfo = result[0];
                if (discoveryInfo.ch1_discovery_start) {
                    return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
                } else if (discoveryInfo.ch1_initialize) {
                    return Promise.reject(new AppError('initialize 작업 진행중입니다'));
                } else if (discoveryInfo.ch1_run) {
                    return Promise.reject(new AppError('run 작업 진행중입니다'));
                }
                let updateControlDiscoveryInfo = {};
                updateControlDiscoveryInfo['ch1_discovery_start'] = 1;
                updateControlDiscoveryInfo['ch1_discovery_stop'] = 0;
                let updateRtuInfo = _.pick(req.body, ['ch1_stop_bit', 'ch1_parity', 'ch1_response_wait_ms', 'ch1_retry_count', 'ch1_baudrate', 'ch1_start_address', 'ch1_end_address']);
                let promiseList = [];
                promiseList.push(dbService.updateAll('control_discovery', updateControlDiscoveryInfo));
                promiseList.push(dbService.updateAll('setting_modbus_rtu', updateRtuInfo));
                return Promise.all(promiseList);
            }).then(() => {
                res.send({ success: true });
                dbService.insert('table_change_info', { table_name: 'setting_modbus_rtu', column_name: 'all' })
                    .then(() => {
                        dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch1_discovery_start' });
                    });
            }).catch(errorRouteHandler(next));
    });

// 채널1 autoDiscovery stop 수행
router.post('/autoDiscoveryStop', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch1_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            } else if (discoveryInfo.ch1_run) {
                return Promise.reject(new AppError('run 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch1_discovery_start'] = 0;
            updateControlDiscoveryInfo['ch1_discovery_stop'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch1_discovery_stop' });
        }).catch(errorRouteHandler(next));
});

// 채널1 init 수행
router.post('/init', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch1_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.ch1_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            } else if (discoveryInfo.ch1_run) {
                return Promise.reject(new AppError('run 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch1_initialize'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            dbService.executeQueryByStr('delete from info_event_log_ch1 where channel_number = ?', [1]);
            dbService.executeQueryByStr('delete from fault_event_log_Ch1 where channel_number = ?', [1]);
            dbService.executeQueryByStr('delete from tripwave_log_ch1 where channel_number = ?', [1]);
            dbService.executeQueryByStr('delete from remote_smtp where channel_number = ?', [1]);
            dbService.executeQueryByStr('delete from remote_gcm where channel_number = ?', [1]);
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch1_initialize' });
            res.send({ success: true });
        }).catch(errorRouteHandler(next));
});

// ch1 run
router.post('/run', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch1_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.ch1_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch1_run'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_gateway', column_name: 'time_sync_activation' })
                .then(() => {
                    dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch1_run' });
                });

        }).catch(errorRouteHandler(next));
});

// ch1 stop
router.post('/stop', function (req, res, next) {
    dbService.select('control_discovery')
        .then((result) => {
            let discoveryInfo = result[0];
            if (discoveryInfo.ch1_discovery_start) {
                return Promise.reject(new AppError('autodiscovery 작업 진행중입니다'));
            } else if (discoveryInfo.ch1_initialize) {
                return Promise.reject(new AppError('initialize 작업 진행중입니다'));
            }
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch1_run'] = 0;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch1_run' });
        }).catch(errorRouteHandler(next));
});

// 채널1에 backup되고 있는 디바이스 목록
router.get('/backupDiscoveredDevices', function (req, res, next) {
    dbService.selectQueryById('ch1BackupDiscoveredDevices')
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// 채널1에 discovery된 디바이스 목록
router.get('/discoveredDevices', function (req, res, next) {
    dbService.selectQueryById('ch1DiscoveredDevices')
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// ch1 autodiscovery confirm
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
            updateControlDiscoveryInfo['ch1_confirm'] = 1;
            return dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
        }).then(() => {
            res.send({ success: true });
            dbService.insert('table_change_info', { table_name: 'control_discovery', column_name: 'ch1_confirm' });
        }).catch(errorRouteHandler(next));
});

// 채널1의 상태
router.get('/status', function (req, res, next) {
    dbService.select('information_system')
        .then((result) => {
            let statusInfo = result[0];
            res.send({
                status: statusInfo.ch1_status
            });
        }).catch(errorRouteHandler(next));
});

module.exports = router;