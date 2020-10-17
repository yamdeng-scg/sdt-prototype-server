'use strict';

const dbService = require('./db');
const CONFIG = require('../config');
const STATIC_CONFIG = require('../config/static');
const logger = require('../utils/logger');
const request = require('superagent');

const process = require('process');
const DEBUG_MODE = process.env.NODE_ENV === 'development' ? true : false;

// ACB OCR TYPE A, ACB OCR TYPE P/S, ACB OCR TRIO, Smart MCCB, M-LINK, Energy Meter 2P, Energy Meter 3P, POWER TAG 수집기, NEW DMP, SEMPR, Gimac-i, Gimac-b 분기계측, Gimac-b 온도

// const deviceMappingInfo = {
//     'ACBOCR-A' : 'ACB_A',
//     'ACBOCR-S' : 'ACB_PS',
//     'ACBOCR-P' : 'ACB_PS',
//     'SMARTMCCB' : 'SMART_MCCB',
//     'MLINK' : 'M-LINK',
//     'ENERGYMETER_2P' : 'EM_2P',
//     'ENERGYMETER_3P' : 'EM_3P',
//     'NEWDMP' : 'NEW_DMP',
//     'SEMPR-C' : 'SEMPR',
//     'SEMPR-P' : 'SEMPR',
//     'SEMPR-S' : 'SEMPR',
//     'GIMACI' : 'GIMAC_I',
//     'GIMACB_B' : 'GIMAC_B1',
//     'GIMACB_T' : 'GIMAC_B2',
//     'TRIO' : 'TRIO',
//     'POWERTAG' : 'POWERTAG',
// };

let channelTestDataList = [];

if (DEBUG_MODE) {
    channelTestDataList = [
        { device_type: 'ACBOCR-A', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'ACBOCR-A', name: 'ACBOCR-A' },
        { device_type: 'ACBOCR-S', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'ACBOCR-S', name: 'ACBOCR-S' },
        { device_type: 'ACBOCR-P', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'ACBOCR-P', name: 'ACBOCR-P' },
        { device_type: 'TRIO', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'TRIO', name: 'TRIO' },
        { device_type: 'SMARTMCCB', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'SMARTMCCB', name: 'SMARTMCCB' },
        { device_type: 'MLINK', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'MLINK', name: 'MLINK' },
        { device_type: 'ENERGYMETER_2P', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'ENERGYMETER_2P', name: 'ENERGYMETER_2P' },
        { device_type: 'ENERGYMETER_3P', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'ENERGYMETER_3P', name: 'ENERGYMETER_3P' },
        { device_type: 'POWERTAG', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'POWERTAG', name: 'POWERTAG' },
        { device_type: 'NEWDMP', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'NEWDMP', name: 'NEWDMP' },
        { device_type: 'SEMPR-C', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'SEMPR-C', name: 'SEMPR-C' },
        { device_type: 'SEMPR-P', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'SEMPR-P', name: 'SEMPR-P' },
        { device_type: 'GIMACI', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'GIMACI', name: 'GIMACI' },
        { device_type: 'GIMACB_B', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'GIMACB_B', name: 'GIMACB_B' },
        { device_type: 'GIMACB_T', manufacturer_name: 'LS산전연구실', hw_version: '0.1', sw_version: '0.2', serial_number: '123-456', product_code: 'GIMACB_T', name: 'GIMACB_T' },
        { device_type: 'noname' }
    ];
}

let testGatewayIpAddress = '119.205.233.105';
// let testGatewayIpAddress = '127.0.0.1'; 
let gatewayTestDataList = [
    { ip_address: testGatewayIpAddress, device_type: 'GATEWAY1' },
    { ip_address: testGatewayIpAddress, device_type: 'GATEWAY2' },
];

// {
//     'physical_identifier': 0,
//     'logical_identifier': 0,
//     'status': 0,
//     'device_type': ''
// }

// {
//     'logical_identifier': 0,
//     'manufacturer_name': '',
//     'product_code': '',
//     'device_name': '',
//     'hw_version': '',
//     'sw_version': '',
//     'serial_number': '',
//     'user_defined_name': '',
//     'user_comment': '',
//     'usage': '',
//     'additional_information_1': 0,
//     'additional_information_2': 0,
//     'additional_information_3': 0,
//     'additional_information_4': 0,
//     'installation_year': '',
//     'installation_month': '',
//     'installation_day': '',
//     'com_state': 0,
//     'com_success_counter': 0,
//     'com_error_counter': 0
// }

// {
//     'table_name': '',
//     'device_type': '',
//     'physical_identifier': 0,
//     'logical_identifier': 0,
//     'channel_number': 0,
//     'fast_group_number': 0,
//     'fast_function_code1': 0,
//     'fast_address1': 0,
//     'fast_length1': 0,
//     'fast_function_code2': 0,
//     'fast_address2': 0,
//     'fast_length2': 0
// }

// {
//     'ch1_status': 0,
//     'ch2_status': 0,
//     'eth_status': 0
// }

const service = {};
let checkAutoDiscoveryTaskId = null;
let systemLogDeleteTaskId = null;
let getLogInfoTaskId = null;
let deviceLogDeleteTaskId = null;

// 채널 autodiscovery 최종 반영
function executeAutoDiscoveryConfirm(channelNumber) {
    dbService.deleteAll('information_discovery_ch' + channelNumber + '_bak');
    dbService.deleteAll('information_discovery_ch' + channelNumber);
    let insertPromiseList = [];
    for (let index = 0; index < channelTestDataList.length; index++) {
        let identifier = (channelNumber === 1 ? 1 + index : 33 + index);
        let discoveryChInfo = {
            'physical_identifier': identifier,
            'logical_identifier': channelTestDataList[index].device_type === 'noname' ? null : identifier,
            'status': channelTestDataList[index].device_type === 'noname' ? STATIC_CONFIG.DEVICE_STATUS_NOT_DISCOVERY : STATIC_CONFIG.DEVICE_STATUS_DISCOVERED,
            'device_type': channelTestDataList[index].device_type
        };
        insertPromiseList.push(dbService.insert('information_discovery_ch' + channelNumber, discoveryChInfo));
        if (channelTestDataList[index].device_type === 'noname') {
            continue;
        }

        let discoveryDataInfo = {
            'logical_identifier': identifier,
            'manufacturer_name': channelTestDataList[index].manufacturer_name,
            'product_code': channelTestDataList[index].product_code,
            'device_name': channelTestDataList[index].name,
            'hw_version': channelTestDataList[index].hw_version,
            'sw_version': channelTestDataList[index].sw_version,
            'serial_number': channelTestDataList[index].serial_number,
            'user_defined_name': channelTestDataList[index].name,
            'user_comment': '',
            'usage': '',
            'additional_information_1': 0,
            'additional_information_2': 0,
            'additional_information_3': 0,
            'additional_information_4': 0,
            'installation_year': '',
            'installation_month': '',
            'installation_day': '',
            'com_state': 0,
            'com_success_counter': 0,
            'com_error_counter': 0
        };
        insertPromiseList.push(dbService.insert('information_device_data_ch' + channelNumber, discoveryDataInfo));
        let fastDbChInfo = {
            'table_name': 'fast_db_' + identifier,
            'device_type': channelTestDataList[index].device_type,
            'physical_identifier': 0,
            'logical_identifier': identifier,
            'channel_number': channelNumber,
            'fast_group_number': 0,
            'fast_function_code1': 0,
            'fast_address1': 0,
            'fast_length1': 0,
            'fast_function_code2': 0,
            'fast_address2': 0,
            'fast_length2': 0
        };
        insertPromiseList.push(dbService.insert('fast_db_ch' + channelNumber, fastDbChInfo));
        Promise.all(insertPromiseList)
            .then(() => {
                let updateControlDiscoveryInfo = {};
                updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_start'] = 0;
                updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_stop'] = 1;
                updateControlDiscoveryInfo['ch' + channelNumber + '_confirm'] = 0;
                dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
                let updateStatusInfo = {};
                updateStatusInfo['ch' + channelNumber + '_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP;
                dbService.updateAll('information_system', updateStatusInfo);
            });
    }
}

// ch1, 2 autodiscovery : 1~16 : ch1, 33~48 : ch2
function executeAutoDiscovery(channelNumber) {

    let deletePromiseList = [];
    // 기존 테이블 삭제
    deletePromiseList.push(dbService.deleteAll('information_discovery_ch' + channelNumber));
    deletePromiseList.push(dbService.deleteAll('information_discovery_ch' + channelNumber + '_bak'));
    deletePromiseList.push(dbService.deleteAll('information_device_data_ch' + channelNumber));
    // deletePromiseList.push(dbService.deleteAll('fast_db_ch' + channelNumber));
    // if (channelNumber === 1) {
    //     for (let index = 1; index <= 16; index++) {
    //         deletePromiseList.push(dbService.deleteAll('fast_db_' + index));
    //     }
    // } else {
    //     for (let index = 33; index <= 48; index++) {
    //         deletePromiseList.push(dbService.deleteAll('fast_db_' + index));
    //     }
    // }
    Promise.all(deletePromiseList)
        .then(() => {
            let insertPromiseList = [];
            for (let index = 0; index < channelTestDataList.length; index++) {
                let identifier = (channelNumber === 1 ? 1 + index : 33 + index);
                let discoveryChInfo = {
                    'physical_identifier': identifier,
                    'logical_identifier': channelTestDataList[index].device_type === 'noname' ? null : identifier,
                    'status': channelTestDataList[index].device_type === 'noname' ? STATIC_CONFIG.DEVICE_STATUS_NOT_DISCOVERY : STATIC_CONFIG.DEVICE_STATUS_DISCOVERED,
                    'device_type': channelTestDataList[index].device_type
                };
                insertPromiseList.push(dbService.insert('information_discovery_ch' + channelNumber + '_bak', discoveryChInfo));
                if (channelTestDataList[index].device_type === 'noname') {
                    continue;
                }
            }
            Promise.all(insertPromiseList)
                .then(() => {
                    let updateControlDiscoveryInfo = {};
                    updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_start'] = 0;
                    updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_stop'] = 1;
                    updateControlDiscoveryInfo['ch' + channelNumber + '_initialize'] = 0;
                    updateControlDiscoveryInfo['ch' + channelNumber + '_run'] = 0;
                    dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
                    let updateStatusInfo = {};
                    updateStatusInfo['ch' + channelNumber + '_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_DISCOVERED;
                    dbService.updateAll('information_system', updateStatusInfo);
                });
        });
}

// ch1, 2 run
function executeRun(channelNumber) {
    let promiseList = [];
    Promise.all(promiseList)
        .then(() => {
            setTimeout(() => {
                let updateStatusInfo = {};
                updateStatusInfo['ch' + channelNumber + '_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_RUNNING;
                dbService.updateAll('information_system', updateStatusInfo);
                let updateDiscoveryChInfo = {
                    'status': STATIC_CONFIG.DEVICE_STATUS_RUNNING
                };
                // dbService.updateAll('information_discovery_ch'+channelNumber, updateDiscoveryChInfo);
                dbService.updateWhere('information_discovery_ch' + channelNumber, updateDiscoveryChInfo, 'status != ?', STATIC_CONFIG.DEVICE_STATUS_NOT_DISCOVERY);
                // let updateControlDiscoveryInfo = {};
                // updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_start'] = 0;
                // updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_stop'] = 1;
                // updateControlDiscoveryInfo['ch' + channelNumber + '_initialize'] = 0;
                // updateControlDiscoveryInfo['ch' + channelNumber + '_run'] = 1;
                // dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
                // dbService.executeQueryByStr('delete from information_discovery_ch' + channelNumber + ' where status = ' + STATIC_CONFIG.DEVICE_STATUS_NOT_DISCOVERY);
            }, CONFIG.runningStatusChangeInterval);
        });
}

// ch1, 2 stop
function executeStop(channelNumber) {
    let promiseList = [];
    Promise.all(promiseList)
        .then(() => {
            setTimeout(() => {
                let updateStatusInfo = {};
                updateStatusInfo['ch' + channelNumber + '_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP;
                dbService.updateAll('information_system', updateStatusInfo);
                let updateDiscoveryChInfo = {
                    'status': STATIC_CONFIG.DEVICE_STATUS_STOP
                };
                // dbService.updateAll('information_discovery_ch'+channelNumber, updateDiscoveryChInfo);
                dbService.updateWhere('information_discovery_ch' + channelNumber, updateDiscoveryChInfo, 'status != ?', STATIC_CONFIG.DEVICE_STATUS_NOT_DISCOVERY);

                // let updateControlDiscoveryInfo = {};
                // updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_start'] = 0;
                // updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_stop'] = 1;
                // updateControlDiscoveryInfo['ch' + channelNumber + '_initialize'] = 0;
                // updateControlDiscoveryInfo['ch' + channelNumber + '_run'] = 0;
                // dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
            }, CONFIG.runningStatusChangeInterval);
        });
}

// ch1, 2 init
function executeInit(channelNumber) {
    let deletePromiseList = [];
    // 기존 테이블 삭제
    deletePromiseList.push(dbService.deleteAll('information_discovery_ch' + channelNumber));
    deletePromiseList.push(dbService.deleteAll('information_device_data_ch' + channelNumber));
    deletePromiseList.push(dbService.deleteAll('fast_db_ch' + channelNumber));
    // if (channelNumber === 1) {
    //     for (let index = 1; index <= 16; index++) {
    //         deletePromiseList.push(dbService.deleteAll('fast_db_' + index));
    //     }
    // } else {
    //     for (let index = 33; index <= 48; index++) {
    //         deletePromiseList.push(dbService.deleteAll('fast_db_' + index));
    //     }
    // }
    Promise.all(deletePromiseList)
        .then(() => {
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_start'] = 0;
            updateControlDiscoveryInfo['ch' + channelNumber + '_discovery_stop'] = 1;
            updateControlDiscoveryInfo['ch' + channelNumber + '_initialize'] = 0;
            updateControlDiscoveryInfo['ch' + channelNumber + '_run'] = 0;
            dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
            let updateStatusInfo = {};
            updateStatusInfo['ch' + channelNumber + '_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_READY;
            dbService.updateAll('information_system', updateStatusInfo);
        });
}

// 게이트웨이 autodiscovery 최종 반영
function executeAutoDiscoveryConfirmByGateway() {

    // information_discovery_eth 테이블 delete
    let deletePromiseList = [];
    // 기존 테이블 삭제
    deletePromiseList.push(dbService.deleteAll('information_discovery_eth'));
    deletePromiseList.push(dbService.deleteAll('information_discovery_eth_bak'));
    Promise.all(deletePromiseList)
        .then(() => {
            let insertPromiseList = [];
            for (let index = 0; index < gatewayTestDataList.length; index++) {
                let discoveryGatewayInfo = {
                    'ip_address': gatewayTestDataList[index].ip_address,
                    'device_type': gatewayTestDataList[index].device_type,
                    'status': STATIC_CONFIG.DEVICE_STATUS_DISCOVERED
                };
                insertPromiseList.push(dbService.insert('information_discovery_eth', discoveryGatewayInfo));
            }
            Promise.all(insertPromiseList)
                .then(() => {
                    let updateControlDiscoveryInfo = {};
                    updateControlDiscoveryInfo['eth_discovery_start'] = 0;
                    updateControlDiscoveryInfo['eth_discovery_stop'] = 1;
                    updateControlDiscoveryInfo['eth_initialize'] = 0;
                    updateControlDiscoveryInfo['eth_run'] = 0;
                    updateControlDiscoveryInfo['eth_confirm'] = 0;
                    dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
                    let updateStatusInfo = {};
                    updateStatusInfo['eth_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP;
                    dbService.updateAll('information_system', updateStatusInfo);
                });
        });


}

// 게이트웨이 autodisocvery
function executeAutoDiscoveryByGateway() {
    // information_discovery_eth 테이블 delete
    let deletePromiseList = [];
    // 기존 테이블 삭제
    deletePromiseList.push(dbService.deleteAll('information_discovery_eth'));
    deletePromiseList.push(dbService.deleteAll('information_discovery_eth_bak'));
    Promise.all(deletePromiseList)
        .then(() => {
            let insertPromiseList = [];
            for (let index = 0; index < gatewayTestDataList.length; index++) {
                let discoveryGatewayInfo = {
                    'ip_address': gatewayTestDataList[index].ip_address,
                    'device_type': gatewayTestDataList[index].device_type,
                    'status': STATIC_CONFIG.DEVICE_STATUS_DISCOVERED
                };
                insertPromiseList.push(dbService.insert('information_discovery_eth_bak', discoveryGatewayInfo));
            }
            Promise.all(insertPromiseList)
                .then(() => {
                    let updateControlDiscoveryInfo = {};
                    updateControlDiscoveryInfo['eth_discovery_start'] = 0;
                    updateControlDiscoveryInfo['eth_discovery_stop'] = 1;
                    updateControlDiscoveryInfo['eth_initialize'] = 0;
                    updateControlDiscoveryInfo['eth_run'] = 0;
                    dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
                    let updateStatusInfo = {};
                    updateStatusInfo['eth_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_DISCOVERED;
                    dbService.updateAll('information_system', updateStatusInfo);
                });
        });
}

// 게이트웨이 run
function executeRunByGateway() {
    let promiseList = [];
    Promise.all(promiseList)
        .then(() => {
            setTimeout(() => {
                let updateStatusInfo = {};
                updateStatusInfo['eth_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_RUNNING;
                dbService.updateAll('information_system', updateStatusInfo);
                let updateDiscoveryGatewayInfo = {
                    'status': STATIC_CONFIG.DEVICE_STATUS_RUNNING
                };
                dbService.updateAll('information_discovery_eth', updateDiscoveryGatewayInfo);

                // let updateControlDiscoveryInfo = {};
                // updateControlDiscoveryInfo['eth_discovery_start'] = 0;
                // updateControlDiscoveryInfo['eth_discovery_stop'] = 1;
                // updateControlDiscoveryInfo['eth_initialize'] = 0;
                // updateControlDiscoveryInfo['eth_run'] = 1;
                // dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
            }, CONFIG.runningStatusChangeInterval);
        });
}

// 게이트웨이 init
function executeInitByGateway() {
    let deletePromiseList = [];
    deletePromiseList.push(dbService.deleteAll('information_discovery_eth'));
    Promise.all(deletePromiseList)
        .then(() => {
            let updateControlDiscoveryInfo = {};
            updateControlDiscoveryInfo['eth_discovery_start'] = 0;
            updateControlDiscoveryInfo['eth_discovery_stop'] = 1;
            updateControlDiscoveryInfo['eth_initialize'] = 0;
            updateControlDiscoveryInfo['eth_run'] = 0;
            dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
            let updateStatusInfo = {};
            updateStatusInfo['eth_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_READY;
            dbService.updateAll('information_system', updateStatusInfo);
        });
}

// 게이트웨이 stop
function executeStopByGateway() {
    let promiseList = [];
    Promise.all(promiseList)
        .then(() => {
            setTimeout(() => {
                let updateStatusInfo = {};
                updateStatusInfo['eth_status'] = STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP;
                dbService.updateAll('information_system', updateStatusInfo);
                let updateDiscoveryGatewayInfo = {
                    'status': STATIC_CONFIG.DEVICE_STATUS_STOP
                };
                dbService.updateAll('information_discovery_eth', updateDiscoveryGatewayInfo);

                // let updateControlDiscoveryInfo = {};
                // updateControlDiscoveryInfo['eth_discovery_start'] = 0;
                // updateControlDiscoveryInfo['eth_discovery_stop'] = 1;
                // updateControlDiscoveryInfo['eth_initialize'] = 0;
                // updateControlDiscoveryInfo['eth_run'] = 0;
                // dbService.updateAll('control_discovery', updateControlDiscoveryInfo);
            }, CONFIG.runningStatusChangeInterval);
        });
}

// 가상 native program run
service.runCheckAutoDiscoveryTask = function () {
    checkAutoDiscoveryTaskId = setInterval(() => {
        let statusInfo = {};
        dbService.select('information_system')
            .then((result) => {
                statusInfo = result[0];
                dbService.select('control_discovery')
                    .then((result) => {
                        if (result && result.length === 1) {
                            let discoveryControlInfo = result[0];

                            // 채널 1 체크
                            if (discoveryControlInfo.ch1_discovery_start) {
                                executeAutoDiscovery(1);
                            } else if (discoveryControlInfo.ch1_initialize) {
                                executeInit(1);
                            } else if (discoveryControlInfo.ch1_confirm) {
                                executeAutoDiscoveryConfirm(1);
                            } else if (statusInfo.ch1_status > STATIC_CONFIG.CH_DISCOVERY_STATUS_DISCOVERING && discoveryControlInfo.ch1_run) {
                                executeRun(1);
                            } else if (statusInfo.ch1_status > STATIC_CONFIG.CH_DISCOVERY_STATUS_DISCOVERING && !discoveryControlInfo.ch1_run) {
                                executeStop(1);
                            }

                            // 채널 2 체크
                            if (discoveryControlInfo.ch2_discovery_start) {
                                executeAutoDiscovery(2);
                            } else if (discoveryControlInfo.ch2_confirm) {
                                executeAutoDiscoveryConfirm(2);
                            } else if (discoveryControlInfo.ch2_initialize || discoveryControlInfo.ch2_hmi) {
                                executeInit(2);
                            } else if (statusInfo.ch2_status >= STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP && discoveryControlInfo.ch2_run) {
                                executeRun(2);
                            } else if (statusInfo.ch2_status >= STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP && !discoveryControlInfo.ch2_run) {
                                executeStop(2);
                            }

                            // 게이트웨이 체크
                            if (discoveryControlInfo.eth_discovery_start) {
                                executeAutoDiscoveryByGateway();
                            } else if (discoveryControlInfo.eth_confirm) {
                                executeAutoDiscoveryConfirmByGateway();
                            } else if (discoveryControlInfo.eth_initialize) {
                                executeInitByGateway();
                            } else if (statusInfo.eth_status >= STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP && discoveryControlInfo.eth_run) {
                                executeRunByGateway();
                            } else if (statusInfo.eth_status >= STATIC_CONFIG.CH_DISCOVERY_STATUS_STOP && !discoveryControlInfo.eth_run) {
                                executeStopByGateway();
                            }

                        }
                    });
            });

        // 1 : 웹에서 [ping] 버튼을 클릭시 서버에서 응답정보를 지우고 1로 바꿈. native에서 1인 경우에 cloud에 response를 날리고 응답이 제대로 왔을 경우에는 setting_info 테이블의 response를 넣어주고 상태를 2로 바꿈. 응답이 없을 경우 0으로 바꾸면 됨. 에러 정보가 있으면 response에 넣어 주면 됨
        // 2 : native에서 cloud에 ping을 날리고 성공적으로 응답이 왔을 경우(stop 상태). 웹에서 [stop] 버튼을 클릭시 서버에서 2로 바꿈([stop] 버튼 클릭시 -> [run] 버튼으로 바뀜]. native에서 2인 체크해서 stop 동작을 하면 됨
        // 3 : 웹에서 [run] 버튼 클릭시 서버에서 3으로 바꿈. native에서는 3인지 체크해서 run 동작을 하면됨
        dbService.select('setting_info')
            .then((result) => {
                // 1인 경우 작업하고 2로 바꾸고 response를 insert 한다
                result.forEach(info => {
                    if (info.Category === 'CloudInfo' && info.Type === 'Status' && info.Value === '1') {
                        dbService.insert('setting_info', {
                            Category: 'CloudInfo',
                            Type: 'Response',
                            Value: 'cloud alive success'
                        });
                        dbService.executeQueryById('updateSettingInfo', ['2', 'CloudInfo', 'Status']);
                    }
                });
            });
    }, CONFIG.nativeTaskInterval);
};

service.clearTask = function () {
    if (checkAutoDiscoveryTaskId) {
        clearInterval(checkAutoDiscoveryTaskId);
    }
    if (systemLogDeleteTaskId) {
        clearInterval(systemLogDeleteTaskId);
    }
    if (getLogInfoTaskId) {
        clearInterval(getLogInfoTaskId);
    }
    if (deviceLogDeleteTaskId) {
        clearInterval(deviceLogDeleteTaskId);
    }
};

// 시스템 로그 테이블 삭제
service.runSystemLogDeleteTask = function () {
    systemLogDeleteTaskId = setInterval(() => {
        dbService.selectQueryByStr('select ifnull(count(id), 0) as totalCount FROM system_log')
            .then((result) => {
                const totalCount = result[0].totalCount;
                logger.info('runSystemLogTask totalCount : ' + totalCount);
                if (totalCount > CONFIG.systemLogTableMax) {
                    dbService.selectQueryByStr('select max(id) as maxId from system_log')
                        .then((result) => {
                            const deleteRowId = result[0].maxId - CONFIG.systemLogTableMax;
                            logger.info('runSystemLogTask deleteRowId : ' + deleteRowId);
                            dbService.executeQueryByStr('delete from system_log where id < ?', deleteRowId);
                        });
                }
            });
    }, CONFIG.systemLogDeleteTaskInterval);
};

// client 서버에서 로그 가져오는 task
service.runGetLogInfoByClientServer = function () {

    getLogInfoTaskId = setInterval(() => {

        // device 전체 목록 가져오기
        dbService.selectQueryById('discoveredDevicesByAllChannel')
            .then((result) => {
                if (result && result.length > 0) {
                    result.forEach((findDevice) => {
                        let systemEventHttpUrl = CONFIG.clientServer.url + '/' + findDevice.logical_identifier + '/systemEvent';
                        let faultEventHttpUrl = CONFIG.clientServer.url + '/' + findDevice.logical_identifier + '/faultEvent';
                        let tripwaveHttpUrl = CONFIG.clientServer.url + '/' + findDevice.logical_identifier + '/tripWave';
                        if (checkEventLogByDeviceType(findDevice.device_type)) {
                            request.get(systemEventHttpUrl)
                                .then((response) => {
                                    if (response.body && response.body.length) {
                                        response.body.forEach((logData) => {
                                            logData.logical_identifier = findDevice.logical_identifier;
                                            logData.channel_number = findDevice.channel_number;
                                            if (findDevice.channel_number === 1) {
                                                dbService.selectQueryById('ch1InfoEventDuplCheck', [findDevice.logical_identifier, logData.logDate])
                                                    .then((result) => {
                                                        const searchCount = result[0].searchCount;
                                                        if (!searchCount) {
                                                            dbService.insert('info_event_log_ch1', logData);
                                                        }
                                                    });
                                            } else {
                                                dbService.selectQueryById('ch2InfoEventDuplCheck', [findDevice.logical_identifier, logData.logDate])
                                                    .then((result) => {
                                                        const searchCount = result[0].searchCount;
                                                        if (!searchCount) {
                                                            dbService.insert('info_event_log_ch2', logData);
                                                        }
                                                    });
                                            }
                                        });
                                    }
                                }).catch((err) => {
                                    logger.error('runGetLogInfoByClientServer systemEventHttpUrl http call error : ' + err);
                                });
                            request.get(faultEventHttpUrl)
                                .then((response) => {
                                    if (response.body && response.body.length) {
                                        response.body.forEach((logData) => {
                                            logData.logical_identifier = findDevice.logical_identifier;
                                            logData.channel_number = findDevice.channel_number;
                                            logData['value'] = 1;
                                            if (findDevice.channel_number === 1) {
                                                dbService.selectQueryById('ch1FaultEventDuplCheck', [findDevice.logical_identifier, logData.logDate])
                                                    .then((result) => {
                                                        const searchCount = result[0].searchCount;
                                                        if (!searchCount) {
                                                            dbService.insert('fault_event_log_ch1', logData);
                                                        }
                                                    });
                                            } else {
                                                dbService.selectQueryById('ch2FaultEventDuplCheck', [findDevice.logical_identifier, logData.logDate])
                                                    .then((result) => {
                                                        const searchCount = result[0].searchCount;
                                                        if (!searchCount) {
                                                            dbService.insert('fault_event_log_ch2', logData);
                                                        }
                                                    });
                                            }
                                        });
                                    }
                                }).catch((err) => {
                                    logger.error('runGetLogInfoByClientServer faultEventHttpUrl http call error : ' + err);
                                });
                        }

                        if (checkTripWaveByDeviceType(findDevice.device_type)) {
                            request.get(tripwaveHttpUrl)
                                .then((response) => {
                                    if (response.body) {
                                        let logData = response.body;
                                        let dbData = {};
                                        dbData.logical_identifier = findDevice.logical_identifier;
                                        dbData.channel_number = findDevice.channel_number;
                                        dbData.logDate = logData.logDate;
                                        dbData.data = JSON.stringify(logData);
                                        if (findDevice.channel_number === 1) {
                                            dbService.selectQueryById('ch1TripwaveDuplCheck', [findDevice.logical_identifier, logData.logDate])
                                                .then((result) => {
                                                    const searchCount = result[0].searchCount;
                                                    if (!searchCount) {
                                                        dbService.insert('tripwave_log_ch1', dbData);
                                                    }
                                                });
                                        } else {
                                            dbService.selectQueryById('ch2TripwaveDuplCheck', [findDevice.logical_identifier, logData.logDate])
                                                .then((result) => {
                                                    const searchCount = result[0].searchCount;
                                                    if (!searchCount) {
                                                        dbService.insert('tripwave_log_ch2', dbData);
                                                    }
                                                });
                                        }
                                    }
                                }).catch((err) => {
                                    logger.error('runGetLogInfoByClientServer tripwaveHttpUrl http call error : ' + err);
                                });
                        }
                    });
                }
            });

    }, CONFIG.monitoringLogGetInfoTaskInterval);

};

// 디바이스 로그 테이블 삭제 : info_event_log_ch1(2), fault_event_log_ch1(2), tripwave_log_ch1(2)
service.runDeviceLogDeleteTask = function () {

    deviceLogDeleteTaskId = setInterval(() => {

        // device 전체 목록 가져오기
        dbService.selectQueryById('discoveredDevicesByAllChannel')
            .then((result) => {
                if (result && result.length > 0) {
                    result.forEach((info) => {
                        // 일반 이벤트 로그 삭제
                        let infoEventTableName = 'info_event_log_ch' + info.channel_number;
                        dbService.selectQueryByStr('select ifnull(count(id), 0) as totalCount FROM ' + infoEventTableName + ' where logical_identifier = ?', [info.logical_identifier])
                            .then((result) => {
                                const totalCount = result[0].totalCount;
                                logger.info('runDeviceLogTask info_event_log[' + info.logical_identifier + '] totalCount : ' + totalCount);
                                if (totalCount > CONFIG.monitoringLogTableMax) {
                                    dbService.selectQueryByStr('select ifnull(min(t.id), 0) as minId from (select id from ' + infoEventTableName + ' where logical_identifier = ? order by id desc limit 0, ?) t', [info.logical_identifier, CONFIG.monitoringLogTableMax])
                                        .then((result) => {
                                            if (result && result.length && result[0].minId) {
                                                const deleteRowId = result[0].minId;
                                                logger.info('runDeviceLogTask info_event_log[' + info.logical_identifier + '] deleteRowId : ' + deleteRowId);
                                                dbService.executeQueryByStr('delete from ' + infoEventTableName + ' where logical_identifier = ? and id < ?', [info.logical_identifier, deleteRowId]);
                                            }
                                        });
                                }
                            });

                        // 실패 이벤트 로그 삭제
                        let faultEventTableName = 'fault_event_log_ch' + info.channel_number;
                        dbService.selectQueryByStr('select ifnull(count(id), 0) as totalCount FROM ' + faultEventTableName + ' where logical_identifier = ?', [info.logical_identifier])
                            .then((result) => {
                                const totalCount = result[0].totalCount;
                                logger.info('runDeviceLogTask fault_event_log[' + info.logical_identifier + '] totalCount : ' + totalCount);
                                if (totalCount > CONFIG.monitoringLogTableMax) {
                                    dbService.selectQueryByStr('select ifnull(min(t.id), 0) as minId from (select id from ' + faultEventTableName + ' where logical_identifier = ? order by id desc limit 0, ?) t', [info.logical_identifier, CONFIG.monitoringLogTableMax])
                                        .then((result) => {
                                            if (result && result.length && result[0].minId) {
                                                const deleteRowId = result[0].minId;
                                                logger.info('runDeviceLogTask fault_event_log[' + info.logical_identifier + '] deleteRowId : ' + deleteRowId);
                                                dbService.executeQueryByStr('delete from ' + faultEventTableName + ' where logical_identifier = ? and id < ?', [info.logical_identifier, deleteRowId]);
                                            }
                                        });
                                }
                            });

                        // 차트정보 로그 삭제
                        let tripChartTableName = 'tripwave_log_ch' + info.channel_number;
                        dbService.selectQueryByStr('select ifnull(count(id), 0) as totalCount FROM ' + tripChartTableName + ' where logical_identifier = ?', [info.logical_identifier])
                            .then((result) => {
                                const totalCount = result[0].totalCount;
                                logger.info('runDeviceLogTask tripwave_log[' + info.logical_identifier + '] totalCount : ' + totalCount);
                                if (totalCount > CONFIG.monitoringLogTableMax) {
                                    dbService.selectQueryByStr('select ifnull(min(t.id), 0) as minId from (select id from ' + tripChartTableName + ' where logical_identifier = ? order by id desc limit 0, ?) t', [info.logical_identifier, CONFIG.monitoringLogTableMax])
                                        .then((result) => {
                                            if (result && result.length && result[0].minId) {
                                                const deleteRowId = result[0].minId;
                                                logger.info('runDeviceLogTask tripwave_log[' + info.logical_identifier + '] deleteRowId : ' + deleteRowId);
                                                dbService.executeQueryByStr('delete from ' + tripChartTableName + ' where logical_identifier = ? and id < ?', [info.logical_identifier, deleteRowId]);
                                            }
                                        });
                                }
                            });

                    });
                }
            }).catch((err) => {
                logger.error('runDeviceLogDeleteTask error : ' + err);
            });

    }, CONFIG.monitoringLogDeleteTaskInterval);

};

// task service 전용 함수

// 이벤트 로그 사용 디바이스 타입 체크 : ACBOCR-A, ACBOCR-S, ACBOCR-P, SMARTMCCB, MLINK
function checkEventLogByDeviceType(device_type) {
    if (device_type === 'ACBOCR-A' || device_type === 'ACBOCR-S' || device_type === 'ACBOCR-P' || device_type === 'SMARTMCCB' || device_type === 'MLINK') {
        return true;
    } else {
        return false;
    }
}

// tripwave 차트 사용 디바이스 타입 체크 : ACBOCR-A, ACBOCR-S, ACBOCR-P, SMARTMCCB
function checkTripWaveByDeviceType(device_type) {
    if (device_type === 'ACBOCR-A' || device_type === 'ACBOCR-S' || device_type === 'ACBOCR-P' || device_type === 'SMARTMCCB') {
        return true;
    } else {
        return false;
    }
}

module.exports = service;