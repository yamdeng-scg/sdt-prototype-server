'use strict';

const CONFIG = require('../config');
// const os = require('os');
// const process = require('process');
const logger = require('../utils/logger');
const dbService = require('../services/db');
// const mailService = require('../services/mail');
const taskService = require('../services/task');
const initDataInsert = require('./initDataInsert');

module.exports = function (app) {

    logger.info('init app : ' + app);
    // db connection 정보 유지 + 초기 data 넣기
    dbService.connect()
        .then(() => {
            if (CONFIG.applyInitDataInsert) {
                // data insert
                initDataInsert();
            }
            // 가상 native application task run
            if (CONFIG.applyVirtualNativeRun) {
                taskService.runCheckAutoDiscoveryTask();
            }
            // system_log 테이블 삭제 시키는 task run
            if (CONFIG.applySystemLogTableDelete) {
                taskService.runSystemLogDeleteTask();
            }
            // client 서버에서 로그 가져오는 task run
            if (CONFIG.applyMonitoringLogGetInfoTask) {
                taskService.runGetLogInfoByClientServer();
            }
            // 디바이스 로그 테이블 삭제 task run
            if (CONFIG.applyMonitoringLogTableDelete) {
                taskService.runDeviceLogDeleteTask();
            }

            setTimeout(() => {
                // logger.info('first gc : ' + global.gc);
                if (global && global.gc) {
                    logger.info('first gc call');
                    global.gc();
                }
                setTimeout(() => {
                    // logger.info('second gc : ' + global.gc);
                    if (global && global.gc) {
                        logger.info('second gc call');
                        global.gc();
                    }
                    setInterval(() => {
                        // logger.info('gc : ' + global.gc);
                        if (global && global.gc) {
                            logger.info('interval gc call');
                            global.gc();
                        }
                    }, 60000);
                }, 15000);
            }, 10000);
        });

    // const serverType = process.env.SERVER_TYPE || 'G';
    // let template = {
    //     pageTitle: 'gateway server run',
    //     startTime: new Date() + ' : ' + serverType + ' server start',
    //     platform: os.platform(),
    //     type: os.type(),
    //     networkInterfaces: JSON.stringify(os.networkInterfaces())
    // };
    // let html = `<htm><head><title>${template.pageTitle}</title></head><title><body><h1>startTime:${template.startTime}</h1><h1>platform:${template.platform}</h1><h1>osType:${template.type}</h1><h1>networkInterfaces:${template.networkInterfaces}</h1></body></html>`;
    // let mailOption = {
    //     from: CONFIG.MAIL_INFO.systemUserAddress,
    //     to: 'yamdeng@naver.com',
    //     subject: 'lsis server start',
    //     html: html
    // };
    // mailService.sendMail(mailOption);

};
