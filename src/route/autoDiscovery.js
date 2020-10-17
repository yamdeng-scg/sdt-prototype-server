'use strict';

const express = require('express');
const dbService = require('../services/db');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
// router.use(authMiddleware);
const moment = require('moment');
const process = require('process');
const CONFIG = require('../config');
const STATIC_CONFIG = require('../config/static');
const errorRouteHandler = require('../errors/routeHandler');
const deviceTypeMapping = require('../config/deviceTypeMapping');

// tree + autoDiscovery 통합 정보
router.get('/superAll', authMiddleware, function (req, res, next) {

    /*

        all + tree
            0.treeInfo : treeInfo('/tree' 라우트 참고)
            1.gateway_data : gatewayInfo
            2.control_discovery : discoveryInfo
            3.information_system : statusInfo
            4.discoveredGateways : discoveredGateways
            5.ch1DiscoveredDevices : ch1DiscoveredDevices
            6.ch2DiscoveredDevices : ch2DiscoveredDevices
            7.cloud에 대한 상태 정보, cloud의 response
            8.채널에 대한 에러 메세지 정보

    */

    let gatewayTreeList = [];
    let channel1TreeList = [];
    let channel2TreeList = [];

    let gatewayInfo = {};
    let discoveryInfo = {};
    let statusInfo = {};
    let discoveredGateways = [];
    let ch1DiscoveredDevices = [];
    let ch2DiscoveredDevices = [];
    let cloudResponse = {};
    let rtuInfo = {};
    let promiseList = [];
    const serverType = process.env.SERVER_TYPE || 'G';
    if (serverType === 'L') {
        promiseList.push(
            dbService.selectQueryById('treeDisplayGatewayList')
                .then((result) => {
                    gatewayTreeList = result;
                    return true;
                }));
    }
    promiseList.push(
        dbService.selectQueryById('treeDisplayCh1DeviceList')
            .then((result) => {
                result.forEach((info) => {
                    info.device_kind = deviceTypeMapping.getDeviceKind(info.device_type, info.product_code);
                });
                channel1TreeList = result;
                return true;
            }));
    promiseList.push(
        dbService.selectQueryById('treeDisplayCh2DeviceList')
            .then((result) => {
                result.forEach((info) => {
                    info.device_kind = deviceTypeMapping.getDeviceKind(info.device_type, info.product_code);
                });
                channel2TreeList = result;
                return true;
            }));

    promiseList.push(dbService.select('gateway_data')
        .then((result) => {
            gatewayInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('control_discovery')
        .then((result) => {
            discoveryInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('information_system')
        .then((result) => {
            statusInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.selectQueryById('discoveredGateways')
        .then((result) => {
            if (result && result.length > 0) {
                discoveredGateways = result;
            }
            return true;
        }));
    promiseList.push(dbService.selectQueryById('ch1DiscoveredDevices')
        .then((result) => {
            if (result && result.length > 0) {
                ch1DiscoveredDevices = result;
            }
            return true;
        }));
    promiseList.push(dbService.selectQueryById('ch2DiscoveredDevices')
        .then((result) => {
            if (result && result.length > 0) {
                ch2DiscoveredDevices = result;
            }
            return true;
        }));
    promiseList.push(dbService.select('setting_modbus_rtu')
        .then((result) => {
            rtuInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('setting_info')
        .then((result) => {
            result.forEach(info => {
                if (info.Category === 'CloudInfo' && info.Type === 'Address') {
                    cloudResponse.url = info.Value;
                }
                if (info.Category === 'CloudInfo' && info.Type === 'Status') {
                    cloudResponse.status = info.Value;
                }
                if (info.Category === 'CloudInfo' && info.Type === 'Response') {
                    cloudResponse.response = info.Value;
                }
                if (!cloudResponse.response && cloudResponse.status !== STATIC_CONFIG.CLOUD_STATUS_ING) {
                    cloudResponse.status = STATIC_CONFIG.CLOUD_STATUS_READY;
                }

                if (info.Category === 'ChErrorMsg' && info.Type === 'ch1') {
                    statusInfo.ch1_error_msg = info.Value;
                }
                if (info.Category === 'ChErrorMsg' && info.Type === 'ch2') {
                    statusInfo.ch2_error_msg = info.Value;
                }
                if (info.Category === 'ChErrorMsg' && info.Type === 'eth') {
                    statusInfo.eth_error_msg = info.Value;
                }
            });
            return true;
        }));
    Promise.all(promiseList)
        .then(() => {
            let treeInfo = {
                name: (serverType === 'L' ? 'DataLogger' : 'Gateway'),
                tree_type: 'L',
                children: [],
                status: statusInfo.eth_status
            };
            if (serverType === 'L') {
                gatewayTreeList.forEach(function (info) {
                    let token = new Buffer(moment().format('YYYYMMDD') + 'lsis').toString('base64');
                    info.link_path = 'http://' + info.ip_address + ':' + CONFIG.GATEWAY_DEFAULT_PORT + '/api/application/manualLogin?token=' + token;
                    treeInfo.children.push(info);
                });
            }
            treeInfo.children.push(
                {
                    name: 'channe1 RS485',
                    tree_type: 'C',
                    status: statusInfo.ch1_status,
                    children: channel1TreeList
                });

            if (discoveryInfo.ch2_hmi) {
                treeInfo.children.push(
                    {
                        name: CONFIG.hmiChannel2Title,
                        tree_type: 'C',
                        status: statusInfo.ch2_status,
                        children: channel2TreeList
                    });
            } else {
                treeInfo.children.push(
                    {
                        name: 'channe2 RS485',
                        tree_type: 'C',
                        status: statusInfo.ch2_status,
                        children: channel2TreeList
                    });
            }
            res.send({
                treeInfo: treeInfo,
                gatewayInfo: gatewayInfo,
                discoveryInfo: discoveryInfo,
                statusInfo: statusInfo,
                discoveredGateways: discoveredGateways,
                ch1DiscoveredDevices: ch1DiscoveredDevices,
                ch2DiscoveredDevices: ch2DiscoveredDevices,
                cloudResponse: cloudResponse,
                rtuInfo: rtuInfo
            });
        }).catch(errorRouteHandler(next));
});

// autoDiscovery된 tree 목록
router.get('/tree', authMiddleware, function (req, res, next) {
    let promiseList = [];
    let gatewayTreeList = [];
    let channel1TreeList = [];
    let channel2TreeList = [];
    let discoveryInfo = {};
    let globalStatusInfo = {};
    const serverType = process.env.SERVER_TYPE || 'G';
    if (serverType === 'L') {
        promiseList.push(
            dbService.selectQueryById('treeDisplayGatewayList')
                .then((result) => {
                    gatewayTreeList = result;
                    return true;
                }));
    }
    promiseList.push(
        dbService.selectQueryById('treeDisplayCh1DeviceList')
            .then((result) => {
                result.forEach((info) => {
                    info.device_kind = deviceTypeMapping.getDeviceKind(info.device_type, info.product_code);
                });
                channel1TreeList = result;
                return true;
            }));
    promiseList.push(
        dbService.selectQueryById('treeDisplayCh2DeviceList')
            .then((result) => {
                result.forEach((info) => {
                    info.device_kind = deviceTypeMapping.getDeviceKind(info.device_type, info.product_code);
                });
                channel2TreeList = result;
                return true;
            }));
    promiseList.push(
        dbService.select('control_discovery')
            .then((result) => {
                discoveryInfo = result[0];
            }));
    promiseList.push(
        dbService.select('information_system')
            .then((result) => {
                globalStatusInfo = result[0];
            }));
    Promise.all(promiseList)
        .then(() => {
            let treeInfo = {
                name: (serverType === 'L' ? 'DataLogger' : 'Gateway'),
                tree_type: 'L',
                children: [],
                status: globalStatusInfo.eth_status
            };
            if (serverType === 'L') {
                gatewayTreeList.forEach(function (info) {
                    let token = new Buffer(moment().format('YYYYMMDD') + 'lsis').toString('base64');
                    info.link_path = 'http://' + info.ip_address + ':' + CONFIG.GATEWAY_DEFAULT_PORT + '/api/application/manualLogin?token=' + token;
                    treeInfo.children.push(info);
                });
            }
            treeInfo.children.push(
                {
                    name: 'Channel1 RS485',
                    tree_type: 'C',
                    status: globalStatusInfo.ch1_status,
                    children: channel1TreeList
                });

            if (discoveryInfo.ch2_hmi) {
                treeInfo.children.push(
                    {
                        name: CONFIG.hmiChannel2Title,
                        tree_type: 'C',
                        status: globalStatusInfo.ch2_status,
                        children: channel2TreeList
                    });
            } else {
                treeInfo.children.push(
                    {
                        name: 'Channel2 RS485',
                        tree_type: 'C',
                        status: globalStatusInfo.ch2_status,
                        children: channel2TreeList
                    });
            }
            res.send(treeInfo);
        }).catch(errorRouteHandler(next));

});

// autoDiscovery의 모든 정보
router.get('/all', authMiddleware, function (req, res, next) {

    /*

        tree 정보를 제외한 모든 정보
            1.gateway_data : gatewayInfo
            2.control_discovery : discoveryInfo
            3.information_system : statusInfo
            4.discoveredGateways : discoveredGateways
            5.ch1DiscoveredDevices : ch1DiscoveredDevices
            6.ch2DiscoveredDevices : ch2DiscoveredDevices
            7.cloud에 대한 상태 정보, cloud의 response
            8.채널에 대한 에러 메세지 정보

    */

    let gatewayInfo = {};
    let discoveryInfo = {};
    let statusInfo = {};
    let discoveredGateways = [];
    let ch1DiscoveredDevices = [];
    let ch2DiscoveredDevices = [];
    let cloudResponse = {};
    let rtuInfo = {};
    let promiseList = [];
    promiseList.push(dbService.select('gateway_data')
        .then((result) => {
            gatewayInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('control_discovery')
        .then((result) => {
            discoveryInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('information_system')
        .then((result) => {
            statusInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.selectQueryById('discoveredGateways')
        .then((result) => {
            if (result && result.length > 0) {
                discoveredGateways = result;
            }
            return true;
        }));
    promiseList.push(dbService.selectQueryById('ch1DiscoveredDevices')
        .then((result) => {
            if (result && result.length > 0) {
                ch1DiscoveredDevices = result;
            }
            return true;
        }));
    promiseList.push(dbService.selectQueryById('ch2DiscoveredDevices')
        .then((result) => {
            if (result && result.length > 0) {
                ch2DiscoveredDevices = result;
            }
            return true;
        }));
    promiseList.push(dbService.select('setting_modbus_rtu')
        .then((result) => {
            rtuInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('setting_info')
        .then((result) => {
            result.forEach(info => {
                if (info.Category === 'CloudInfo' && info.Type === 'Address') {
                    cloudResponse.url = info.Value;
                }
                if (info.Category === 'CloudInfo' && info.Type === 'Status') {
                    cloudResponse.status = info.Value;
                }
                if (info.Category === 'CloudInfo' && info.Type === 'Response') {
                    cloudResponse.response = info.Value;
                }
                if (!cloudResponse.response && cloudResponse.status !== STATIC_CONFIG.CLOUD_STATUS_ING) {
                    cloudResponse.status = STATIC_CONFIG.CLOUD_STATUS_READY;
                }

                if (info.Category === 'ChErrorMsg' && info.Type === 'ch1') {
                    statusInfo.ch1_error_msg = info.Value;
                }
                if (info.Category === 'ChErrorMsg' && info.Type === 'ch2') {
                    statusInfo.ch2_error_msg = info.Value;
                }
                if (info.Category === 'ChErrorMsg' && info.Type === 'eth') {
                    statusInfo.eth_error_msg = info.Value;
                }
            });
            return true;
        }));
    Promise.all(promiseList)
        .then(() => {
            res.send({
                gatewayInfo: gatewayInfo,
                discoveryInfo: discoveryInfo,
                statusInfo: statusInfo,
                discoveredGateways: discoveredGateways,
                ch1DiscoveredDevices: ch1DiscoveredDevices,
                ch2DiscoveredDevices: ch2DiscoveredDevices,
                cloudResponse: cloudResponse,
                rtuInfo: rtuInfo
            });
        }).catch(errorRouteHandler(next));
});

// autoDiscovery status 정보 : 채널1, 채널2, 게이트웨이
router.get('/status', authMiddleware, function (req, res, next) {
    let statusInfo = {};
    let discoveryInfo = {};
    let rtuInfo = {};
    let promiseList = [];
    promiseList.push(dbService.select('control_discovery')
        .then((result) => {
            discoveryInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('information_system')
        .then((result) => {
            statusInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('setting_modbus_rtu')
        .then((result) => {
            rtuInfo = result[0];
            return true;
        }));
    promiseList.push(dbService.select('setting_info')
        .then((result) => {
            result.forEach(info => {
                if (info.Category === 'ChErrorMsg' && info.Type === 'ch1') {
                    statusInfo.ch1_error_msg = info.Value;
                }
                if (info.Category === 'ChErrorMsg' && info.Type === 'ch2') {
                    statusInfo.ch2_error_msg = info.Value;
                }
                if (info.Category === 'ChErrorMsg' && info.Type === 'eth') {
                    statusInfo.eth_error_msg = info.Value;
                }
            });
            return true;
        }));
    Promise.all(promiseList)
        .then(() => {
            res.send({
                discoveryInfo: discoveryInfo,
                statusInfo: statusInfo,
                rtuInfo: rtuInfo
            });
        }).catch(errorRouteHandler(next));
});

// 채널1, 채널2에 autodiscovery된 디바이스 목록
router.get('/discoveredDevicesByAllChannel', function (req, res, next) {
    dbService.selectQueryById('discoveredDevicesByAllChannel')
        .then((result) => {
            if (result && result.length > 0) {
                result.forEach((info) => {
                    info.device_kind = deviceTypeMapping.getDeviceKind(info.device_typ, info.product_code);
                });
                res.send(result);
            } else {
                res.send([]);
            }
        }).catch(errorRouteHandler(next));
});

module.exports = router;