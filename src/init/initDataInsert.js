'use strict';

const passwordHash = require('password-hash');
const dbService = require('../service/db');
const CONFIG = require('../config');

module.exports = function () {
  // table create : modbus로만 데이터를 날리기로 해서 필요 없음
  // for(let index=1; index<=64; index++) {
  //     let tableName = 'fast_db_' + index;
  //     let createTableStr = 'CREATE TABLE IF NOT EXISTS `' + tableName + '` (`address` int(10) unsigned NOT NULL, `function_code` int(10) unsigned NOT NULL, `data_hi` int(10) unsigned NOT NULL, `data_lo` int(10) unsigned NOT NULL, UNIQUE KEY `fast_index` (`address`)) ENGINE=InnoDB DEFAULT CHARSET=UTF8;';
  //     dbService.executeQueryByStr(createTableStr);
  // }

  // 추가 테이블 자동 생성 되게끔
  // 일반 이벤트 로그 테이블 생성
  let infoEventLogTableCreateStr1 =
    'CREATE TABLE IF NOT EXISTS `info_event_log_ch1` ( `id` BIGINT(20) NOT NULL AUTO_INCREMENT, `logDate` VARCHAR(255) NULL DEFAULT NULL, `kind` VARCHAR(255) NULL DEFAULT NULL, `value` INT(11) NULL DEFAULT NULL, `logical_identifier` INT(10) UNSIGNED NULL DEFAULT NULL, `channel_number` TINYINT(3) UNSIGNED NULL DEFAULT NULL, `group` TINYINT(3) UNSIGNED NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  let infoEventLogTableCreateStr2 =
    'CREATE TABLE IF NOT EXISTS `info_event_log_ch2` ( `id` BIGINT(20) NOT NULL AUTO_INCREMENT, `logDate` VARCHAR(255) NULL DEFAULT NULL, `kind` VARCHAR(255) NULL DEFAULT NULL, `value` INT(11) NULL DEFAULT NULL, `logical_identifier` INT(10) UNSIGNED NULL DEFAULT NULL, `channel_number` TINYINT(3) UNSIGNED NULL DEFAULT NULL, `group` TINYINT(3) UNSIGNED NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(infoEventLogTableCreateStr1);
  dbService.executeQueryByStr(infoEventLogTableCreateStr2);

  // 실패 이벤트 로그 테이블 생성
  let faultEventLogTableCreateStr1 =
    'CREATE TABLE IF NOT EXISTS `fault_event_log_ch1` ( `id` BIGINT(20) NOT NULL AUTO_INCREMENT, `logDate` VARCHAR(255) NULL DEFAULT NULL, `kind` VARCHAR(255) NULL DEFAULT NULL, `value` INT(11) NULL DEFAULT NULL, `logical_identifier` INT(10) UNSIGNED NULL DEFAULT NULL, `channel_number` TINYINT(3) UNSIGNED NULL DEFAULT NULL, `group` TINYINT(3) UNSIGNED NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  let faultEventLogTableCreateStr2 =
    'CREATE TABLE IF NOT EXISTS `fault_event_log_ch2` ( `id` BIGINT(20) NOT NULL AUTO_INCREMENT, `logDate` VARCHAR(255) NULL DEFAULT NULL, `kind` VARCHAR(255) NULL DEFAULT NULL, `value` INT(11) NULL DEFAULT NULL, `logical_identifier` INT(10) UNSIGNED NULL DEFAULT NULL, `channel_number` TINYINT(3) UNSIGNED NULL DEFAULT NULL, `group` TINYINT(3) UNSIGNED NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(faultEventLogTableCreateStr1);
  dbService.executeQueryByStr(faultEventLogTableCreateStr2);

  // 차트 정보 로그 테이블 생성
  let tripwaveLogTableCreateStr1 =
    'CREATE TABLE IF NOT EXISTS `tripwave_log_ch1` ( `id` bigint(20) NOT NULL AUTO_INCREMENT, `logDate` varchar(255) DEFAULT NULL, `data` text DEFAULT NULL, `logical_identifier` int(10) unsigned DEFAULT NULL, `channel_number` tinyint(3) unsigned DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  let tripwaveLogTableCreateStr2 =
    'CREATE TABLE IF NOT EXISTS `tripwave_log_ch2` ( `id` bigint(20) NOT NULL AUTO_INCREMENT, `logDate` varchar(255) DEFAULT NULL, `data` text DEFAULT NULL, `logical_identifier` int(10) unsigned DEFAULT NULL, `channel_number` tinyint(3) unsigned DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(tripwaveLogTableCreateStr1);
  dbService.executeQueryByStr(tripwaveLogTableCreateStr2);

  // 원격 smtp 정보 테이블 생성
  let remoteSmtpTableCreateStr =
    'CREATE TABLE IF NOT EXISTS `remote_smtp` ( `logical_identifier` int(11) unsigned DEFAULT NULL, `channel_number` tinyint(4) unsigned DEFAULT NULL, `smtp_mail_url` varchar(255) DEFAULT NULL, `send_address1` varchar(255) DEFAULT NULL, `send_address2` varchar(255) DEFAULT NULL, `send_address3` varchar(255) DEFAULT NULL, `send_address4` varchar(255) DEFAULT NULL, `send_address5` varchar(255) DEFAULT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(remoteSmtpTableCreateStr);

  // 원격 gcm 정보 테이블 생성
  let remoteGcmTableCreateStr =
    'CREATE TABLE IF NOT EXISTS `remote_gcm` ( `logical_identifier` int(11) unsigned DEFAULT NULL, `channel_number` tinyint(4) unsigned DEFAULT NULL, `gcmkey` varchar(255) DEFAULT NULL, `register_id1` varchar(255) DEFAULT NULL, `register_id2` varchar(255) DEFAULT NULL, `register_id3` varchar(255) DEFAULT NULL, `register_id4` varchar(255) DEFAULT NULL, `register_id5` varchar(255) DEFAULT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(remoteGcmTableCreateStr);

  // 열화상 차트 테이블 생성
  let cameraMonthTableCreateStr =
    'CREATE TABLE IF NOT EXISTS `camera_temp_month` ( `channel_number` TINYINT(4) NULL DEFAULT NULL, `temp_date` VARCHAR(255) NULL DEFAULT NULL, `temp_value` FLOAT NULL DEFAULT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(cameraMonthTableCreateStr);
  let cameraWeekTableCreateStr =
    'CREATE TABLE IF NOT EXISTS `camera_temp_week` ( `channel_number` TINYINT(4) NULL DEFAULT NULL, `temp_date` VARCHAR(255) NULL DEFAULT NULL, `temp_value` FLOAT NULL DEFAULT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(cameraWeekTableCreateStr);
  let cameraDayTableCreateStr =
    'CREATE TABLE IF NOT EXISTS `camera_temp_day` ( `channel_number` TINYINT(4) NULL DEFAULT NULL, `temp_date` VARCHAR(255) NULL DEFAULT NULL, `temp_value` FLOAT NULL DEFAULT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
  dbService.executeQueryByStr(cameraDayTableCreateStr);

  // 테마, 다국어 정보 테이블 생성
  let localeTableCreateStr =
    'CREATE TABLE IF NOT EXISTS `global_option_info` ( `theme` VARCHAR(50) NOT NULL, `locale` VARCHAR(50) NOT NULL ) engine=innodb DEFAULT charset=utf8';
  dbService.executeQueryByStr(localeTableCreateStr).then(() => {
    dbService.select('global_option_info').then((result) => {
      if (result.length === 0) {
        let optionInsertInfo = {
          theme: CONFIG.DEFAULT_THEME,
          locale: CONFIG.DEFAULT_LOCALE
        };
        dbService.insert('global_option_info', optionInsertInfo);
      }
    });
  });

  // 관리자 정보 insert
  dbService
    .selectOne('gateway_user', 'id', CONFIG.ADMIN_INFO.id)
    .then((result) => {
      if (!result) {
        let adminUser = CONFIG.ADMIN_INFO;
        let encodedPassword = passwordHash.generate(adminUser.password);
        adminUser.password = encodedPassword;
        dbService.insert('gateway_user', adminUser);
      }
    });

  // 관리자 정보 insert
  // dbService.selectOne('gateway_data', 'product_code', 'GATEWAY')
  //     .then((result) => {
  //         if(!result) {
  //             let gatewayData = {
  //                 manufacturer_name: 'LSIS',
  //                 product_code: 'GATEWAY',
  //                 product_name: 'GATEWAY'
  //             };
  //             dbService.insert('gateway_data', gatewayData);
  //         }
  //     });

  // information_system table insert
  dbService.select('information_system').then((result) => {
    if (result.length === 0) {
      let informationSystemData = {
        ch1_status: 0,
        ch2_status: 0,
        eth_status: 0
      };
      dbService.insert('information_system', informationSystemData);
    }
  });

  // control_discovery table insert
  dbService.select('control_discovery').then((result) => {
    if (result.length === 0) {
      let controlDiscoveryData = {
        ch1_discovery_start: 0,
        ch1_discovery_stop: 1,
        ch1_initialize: 0,
        ch1_run: 0,
        ch2_discovery_start: 0,
        ch2_discovery_stop: 1,
        ch2_initialize: 0,
        ch2_run: 0,
        ch2_hmi: 0,
        ch2_hmi_run: 0,
        eth_discovery_start: 0,
        eth_discovery_stop: 0,
        eth_initialize: 0,
        eth_run: 0,
        tcp_run: 0
      };
      dbService.insert('control_discovery', controlDiscoveryData);
    }
  });

  // setting_modbus_rtu
  dbService.select('setting_modbus_rtu').then((result) => {
    if (result.length === 0) {
      let discoveryOptionData = {
        ch1_response_wait_ms: 1000,
        ch1_retry_count: 0,
        ch1_parity: 0,
        ch1_stop_bit: 0,
        ch1_baudrate: 0,
        ch1_start_address: 0,
        ch1_end_address: 0,
        ch2_response_wait_ms: 1000,
        ch2_retry_count: 0,
        ch2_parity: 0,
        ch2_stop_bit: 0,
        ch2_baudrate: 0,
        ch2_start_address: 0,
        ch2_end_address: 0,
        eth_response_wait_ms: 1000,
        eth_retry_count: 0,
        eth_start_address: 0,
        eth_end_address: 0
      };
      dbService.insert('setting_modbus_rtu', discoveryOptionData);
    }
  });

  // cloud address insert
  dbService
    .selectQueryById('findSettingInfo', ['CloudInfo', 'Address'])
    .then((result) => {
      if (result.length === 0) {
        dbService.insert('setting_info', {
          Category: 'CloudInfo',
          Type: 'Address',
          Value: 'http://127.0.0.1'
        });
      }
    });

  // cloud status insert
  dbService
    .selectQueryById('findSettingInfo', ['CloudInfo', 'Status'])
    .then((result) => {
      if (result.length === 0) {
        dbService.insert('setting_info', {
          Category: 'CloudInfo',
          Type: 'Status',
          Value: '0'
        });
      }
    });

  // ch1 error msg
  dbService
    .selectQueryById('findSettingInfo', ['ChErrorMsg', 'ch1'])
    .then((result) => {
      if (result.length === 0) {
        dbService.insert('setting_info', {
          Category: 'ChErrorMsg',
          Type: 'ch1',
          Value: ''
        });
      }
    });

  // ch2 error msg
  dbService
    .selectQueryById('findSettingInfo', ['ChErrorMsg', 'ch2'])
    .then((result) => {
      if (result.length === 0) {
        dbService.insert('setting_info', {
          Category: 'ChErrorMsg',
          Type: 'ch2',
          Value: ''
        });
      }
    });

  // eth error msg
  dbService
    .selectQueryById('findSettingInfo', ['ChErrorMsg', 'eth'])
    .then((result) => {
      if (result.length === 0) {
        dbService.insert('setting_info', {
          Category: 'ChErrorMsg',
          Type: 'eth',
          Value: ''
        });
      }
    });
};
