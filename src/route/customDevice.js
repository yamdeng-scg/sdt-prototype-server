'use strict';

const _ = require('lodash');
const express = require('express');
const dbService = require('../services/db');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const errorRouteHandler = require('../errors/routeHandler');
const STATIC_CONFIG = require('../config/static');
const CONFIG = require('../config');
const AppError = require('../errors/AppError');

// 커스텀 디바이스 수정
router.put('/:channel_number/:physical_identifier',
    function (req, res, next) {

        dbService.select('information_system')
            .then((result) => {
                let globalStatusInfo = result[0];
                return dbService.selectOne('information_discovery_ch' + req.params.channel_number, 'physical_identifier', req.params.physical_identifier)
                    .then((result) => {
                        if (result) {
                            let logical_identifier = null;
                            if (result.logical_identifier) {
                                logical_identifier = result.logical_identifier;
                            } else {
                                if (globalStatusInfo['ch' + req.params.channel_number + '_status'] === STATIC_CONFIG.CH_DISCOVERY_STATUS_RUNNING) {
                                    return Promise.reject(new AppError('채널이 running 중입니다. stop 후 not discovery 장비를 추가해주세요'));
                                }
                            }
                            return dbService.selectQueryById('getChannel' + req.params.channel_number + 'MaxLogicalId', null)
                                .then((result) => {
                                    if (!logical_identifier) {
                                        if (result.length) {
                                            logical_identifier = result[0].maxId + 1;
                                        } else {
                                            if (Number(req.params.channel_number) === 1) {
                                                logical_identifier = 2;
                                            } else {
                                                logical_identifier = 33;
                                            }
                                        }
                                    }

                                    let dataInfo = _.pick(req.body, ['manufacturer_name', 'device_name', 'user_defined_name', 'usage']);
                                    dataInfo.logical_identifier = logical_identifier;
                                    dataInfo.product_code = CONFIG.customDeviceCheckLabel;

                                    let fastInfo = _.pick(req.body, ['fast_group_number', 'fast_function_code1', 'fast_address1', 'fast_length1', 'fast_function_code2', 'fast_address2', 'fast_length2']);
                                    fastInfo.physical_identifier = req.params.physical_identifier;
                                    fastInfo.logical_identifier = logical_identifier;
                                    fastInfo.channel_number = req.params.channel_number;
                                    fastInfo.device_type = dataInfo.device_name;

                                    fastInfo.table_name = 'fast_db_' + logical_identifier;
                                    let promiseList = [];
                                    promiseList.push(
                                        dbService.selectOne('information_device_data_ch' + req.params.channel_number, 'logical_identifier', logical_identifier)
                                            .then((result) => {
                                                if (result) {
                                                    return dbService.update('information_device_data_ch' + req.params.channel_number, dataInfo, 'logical_identifier', logical_identifier);
                                                } else {
                                                    return dbService.insert('information_device_data_ch' + req.params.channel_number, dataInfo);
                                                }
                                            }));
                                    promiseList.push(
                                        dbService.selectOne('fast_db_ch' + req.params.channel_number, 'logical_identifier', logical_identifier)
                                            .then((result) => {
                                                if (result) {
                                                    return dbService.update('fast_db_ch' + req.params.channel_number, fastInfo, 'logical_identifier', logical_identifier);
                                                } else {
                                                    return dbService.insert('fast_db_ch' + req.params.channel_number, fastInfo);
                                                }
                                            }));
                                    return Promise.all(promiseList)
                                        .then(() => {
                                            return dbService.update('information_discovery_ch' + req.params.channel_number, { logical_identifier: logical_identifier, status: STATIC_CONFIG.DEVICE_STATUS_DISCOVERED, device_type: req.body.device_name }, 'physical_identifier', req.params.physical_identifier);
                                        }).then(() => {
                                            res.send({ success: true });
                                            dbService.insert('table_change_info', { table_name: 'information_device_data_ch' + req.params.channel_number, column_name: logical_identifier });
                                            dbService.insert('table_change_info', { table_name: 'fast_db_ch' + req.params.channel_number, column_name: 'all' });
                                            dbService.insert('table_change_info', { table_name: 'information_discovery_ch' + req.params.channel_number, column_name: 'all' });
                                        });
                                });
                        } else {
                            return Promise.reject(new AppError('정보가 존재하지 않습니다. autodiscovery를 다시 수행해주세요'));
                        }
                    });
            }).catch(errorRouteHandler(next));
    });

// 커스텀 디바이스 가져오기
router.get('/:channel_number/:physical_identifier', function (req, res, next) {
    dbService.selectQueryById('findCustomDeviceChannel' + req.params.channel_number, [req.params.physical_identifier])
        .then((result) => {
            res.send(result[0]);
        }).catch(errorRouteHandler(next));
});

// 커스텀 디바이스 정보 삭제하기
router.delete('/:channel_number/:physical_identifier', function (req, res, next) {
    dbService.selectOne('information_discovery_ch' + req.params.channel_number, 'physical_identifier', req.params.physical_identifier)
        .then((result) => {
            if (result.logical_identifier) {
                let promiseList = [];
                promiseList.push(dbService.delete('information_device_data_ch' + req.params.channel_number, 'logical_identifier', result.logical_identifier));
                promiseList.push(dbService.delete('fast_db_ch' + req.params.channel_number, 'logical_identifier', result.logical_identifier));
                promiseList.push(dbService.delete('information_discovery_ch' + req.params.channel_number, 'logical_identifier', result.logical_identifier));
                return Promise.all(promiseList)
                    .then(() => {
                        res.send({ success: true });
                        dbService.insert('table_change_info', { table_name: 'fast_db_ch' + req.params.channel_number, column_name: 'all' });
                        dbService.insert('table_change_info', { table_name: 'information_discovery_ch' + req.params.channel_number, column_name: 'all' });
                    });
            } else {
                return Promise.reject(new AppError('정보가 존재하지 않습니다'));
            }
        }).catch(errorRouteHandler(next));
});

module.exports = router;