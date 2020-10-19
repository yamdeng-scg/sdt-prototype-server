'use strict';

const config = require('../config/config');
const logger = require('../util/logger');
const helper = require('../util/helper');
const mysql = require('mysql');
const _ = require('lodash');

let connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  port: config.db.port,
  database: config.db.database
});

let reconnectIntervalId = null;
let reconnectSuccess = false;

connection.config.queryFormat = function (query, paramObject) {
  if (!paramObject) return query;
  return query.replace(
    // eslint-disable-next-line
    /\:(\w+)/g,
    function (txt, key) {
      if (_.has(paramObject, key)) {
        return this.escape(paramObject[key]);
      }
      return txt;
    }.bind(this)
  );
};

function registerErrorHanlder(connInfo) {
  connInfo.on('error', function (error) {
    if (!error.fatal) {
      return;
    }
    if (connection && connection.end) {
      connection.end();
      connection = null;
    }
    reconnectSuccess = false;
    reconnectIntervalId = setInterval(function () {
      if (reconnectSuccess && reconnectIntervalId) {
        clearInterval(reconnectIntervalId);
      } else {
        reconnect();
      }
    }, 60000);
  });
}

registerErrorHanlder(connection);

function reconnect() {
  try {
    connection = mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      port: config.db.port,
      database: config.db.database
    });
    registerErrorHanlder(connection);
    service.connect();
  } catch (e) {
    logger.error('reconnect error : ' + e);
  }
}

const service = {};

service.connect = function () {
  return new Promise(function (resolve, reject) {
    connection.connect(function (error) {
      if (error) {
        logger.error('mysql connection error');
        reject(error);
      } else {
        logger.info('mysql connection success');
        reconnectSuccess = true;
        resolve(true);
      }
    });
  });
};

/*

    findUserByLoginId: id로 사용자 찾기
    findUserByEmail: email로 사용자 찾기
    getTableInfoToObjectDefaultValue: table column 정보를 가지고 json object로 추출하기
    discoveredGateways: 디스커리된 게이트웨이 목록
    ch1BackupDiscoveredDevices : 채널1의 오토디스커비리 [confirm] 전의 디바이스 목록
    ch2BackupDiscoveredDevices : 채널2의 오토디스커비리 [confirm] 전의 디바이스 목록
    ch1DiscoveredDevices : 채널1에 discovery된 디바이스 목록
    ch2DiscoveredDevices : 채널2에 discovery된 디바이스 목록
    discoveredDevicesByAllChannel : 채널1, 2에 discovery된 디바이스 목록(selectBox에서 사용함)
    treeDisplayCh1DeviceList: 트리에 보여지는 ch1 device 목록
    treeDisplayCh2DeviceList: 트리에 보여지는 ch2 device 목록
    treeDisplayGatewayList: 트리에 보여지는 gateway 목록
    findSettingInfo: setting 테이블을 Category, Type 단위로 찾기
    updateSettingInfo: setting 테이블의 update를 Category, Type 단위로 반영
    findCustomDeviceChannel1: 채널1에 속한 커스텀 디바이스 조회
    findCustomDeviceChannel2: 채널2에 속한 커스텀 디바이스 조회
    getChannel1MaxLogicalId: 채널1에 max logicalId 추출(없으면 2)
    getChannel2MaxLogicalId: 채널2에 max logicalId 추출(없으면 33)
    getInfoEventLogCh1Count : 채널1의 시스템 이벤트 count

    getInfoEventLogCh2Count : 채널2의 시스템 이벤트 count
    getFaultEventLogCh1Count : 채널1의 실패 이벤트 count
    getFaultEventLogCh2Count : 채널2의 실패 이벤트 count
    getTripwaveLogCh1Count : 채널1의 trip 차트 count
    getTripwaveLogCh2Count : 채널2의 trip 차트 count
    getInfoEventLogCh1List : 채널1의 시스템 이벤트 list
    getInfoEventLogCh2List : 채널2의 시스템 이벤트 list
    getFaultEventLogCh1List : 채널1의 실패 이벤트 list
    getFaultEventLogCh2List : 채널2의 실패 이벤트 list
    getTripwaveLogCh1List : 채널1의 trip 차트 list
    getTripwaveLogCh2List : 채널2의 trip 차트 list
    getInfoEventAllCount : 전체 시스템 이벤트 count
    getFaultEventAllCount : 전체 실패 이벤트 count
    getTripwaveAllCount : 전체 trip 차트 count
    getInfoEventAllList : 전체 시스템 이벤트 list
    getFaultEventAllList : 전체 실패 이벤트 list
    getTripwaveAllList : 전체 trip 차트 list
    cameraMonthChart : 카메라 월 차트 데이터
    cameraWeekChart : 카메라 주 차트 데이터
    cameraDayChart : 카메라 일 차트 데이터

    ch1InfoEventDuplCheck : 채널1의 시스템 이벤트 중복 체크(logDate 기준)
    ch2InfoEventDuplCheck : 채널2의 시스템 이벤트 중복 체크(logDate 기준)
    ch1FaultEventDuplCheck : 채널1의 실패 이벤트 중복 체크(logDate 기준)
    ch2FaultEventDuplCheck : 채널2의 실패 이벤트 중복 체크(logDate 기준)
    ch1TripwaveDuplCheck : 채널1의 trip 차트 데이터 중복 체크(logDate 기준)
    ch2TripwaveDuplCheck : 채널2의 trip 차트 데이터 중복 체크(logDate 기준)

    // SELECT if(information_device_data_ch1.user_defined_name = "", information_device_data_ch1.device_name, information_device_data_ch1.user_defined_name) AS name, 
    // SELECT if(information_device_data_ch2.user_defined_name = "", information_device_data_ch2.device_name, information_device_data_ch2.user_defined_name) AS name

*/

const queryInfo = {
  findWiseSayAll: 'select * from wise_say',
  getWiseSay: 'select * from wise_say WHERE id = :id',
  findWiseSayByContent:
    "select * from wise_say WHERE content like concat('%', :content, '%')",
  updateWiseSay: 'update wise_say set content = :content where id = :id',
  updateWiseSayLikeContent:
    "update wise_say set content = :newContent where content like concat('%', :content, '%')",
  updateSettingInfo:
    'update setting_info set Value = ? where Category = ? and Type = ?',
  findUserByEmail: 'SELECT * FROM gateway_user WHERE email = ?',
  getTableInfoToObjectDefaultValue:
    'select column_name, ordinal_position, is_nullable, data_type, column_default from information_schema.columns where table_name = ? order by ordinal_position asc',
  backupDiscoveredGateways:
    'select * from information_discovery_eth_bak where status >= 0 order by status',
  discoveredGateways:
    'select * from information_discovery_eth where status >= 0 order by status',
  ch1BackupDiscoveredDevices:
    'SELECT 1 as channel_number, physical_identifier, logical_identifier, status, device_type FROM information_discovery_ch1_bak ORDER BY information_discovery_ch1_bak.status asc, information_discovery_ch1_bak.logical_identifier asc',
  ch2BackupDiscoveredDevices:
    'SELECT 1 as channel_number, physical_identifier, logical_identifier, status, device_type FROM information_discovery_ch2_bak ORDER BY information_discovery_ch2_bak.status asc, information_discovery_ch2_bak.logical_identifier asc',
  ch1DiscoveredDevices:
    'SELECT 1 as channel_number, physical_identifier, logical_identifier, status, device_type FROM information_discovery_ch1 WHERE information_discovery_ch1.status >= 2 ORDER BY information_discovery_ch1.status asc, information_discovery_ch1.logical_identifier asc',
  ch2DiscoveredDevices:
    'SELECT 2 as channel_number, physical_identifier, logical_identifier, status, device_type FROM information_discovery_ch2 WHERE information_discovery_ch2.status >= 2 ORDER BY information_discovery_ch2.status asc, information_discovery_ch2.logical_identifier asc',
  discoveredDevicesByAllChannel:
    'SELECT information_device_data_ch1.device_name, information_device_data_ch1.logical_identifier, information_device_data_ch1.manufacturer_name, information_device_data_ch1.product_code, information_device_data_ch1.user_defined_name, information_discovery_ch1.physical_identifier, information_discovery_ch1.status, information_discovery_ch1.device_type, 1 as channel_number FROM information_device_data_ch1 INNER JOIN information_discovery_ch1 ON information_device_data_ch1.logical_identifier = information_discovery_ch1.logical_identifier where information_discovery_ch1.status >= 0 and information_discovery_ch1.status != 9 union SELECT information_device_data_ch2.device_name, information_device_data_ch2.logical_identifier, information_device_data_ch2.manufacturer_name, information_device_data_ch2.product_code, information_device_data_ch2.user_defined_name, information_discovery_ch2.physical_identifier, information_discovery_ch2.status, information_discovery_ch2.device_type, 2 as channel_number FROM information_device_data_ch2 INNER JOIN information_discovery_ch2 ON information_device_data_ch2.logical_identifier = information_discovery_ch2.logical_identifier where information_discovery_ch2.status >= 0 and information_discovery_ch2.status != 9 order by channel_number, logical_identifier',
  treeDisplayCh1DeviceList:
    'SELECT information_device_data_ch1.user_defined_name AS name, information_device_data_ch1.logical_identifier, information_device_data_ch1.manufacturer_name, information_device_data_ch1.product_code, information_device_data_ch1.user_defined_name, information_discovery_ch1.physical_identifier, information_discovery_ch1.status, information_discovery_ch1.device_type, 1 as channel_number, "D" as tree_type FROM information_device_data_ch1 INNER JOIN information_discovery_ch1 ON information_device_data_ch1.logical_identifier = information_discovery_ch1.logical_identifier where information_discovery_ch1.status > 0',
  treeDisplayCh2DeviceList:
    'SELECT information_device_data_ch2.user_defined_name AS name, information_device_data_ch2.logical_identifier, information_device_data_ch2.manufacturer_name, information_device_data_ch2.product_code, information_device_data_ch2.user_defined_name, information_discovery_ch2.physical_identifier, information_discovery_ch2.status, information_discovery_ch2.device_type, 2 as channel_number, "D" as tree_type FROM information_device_data_ch2 INNER JOIN information_discovery_ch2 ON information_device_data_ch2.logical_identifier = information_discovery_ch2.logical_identifier where information_discovery_ch2.status > 0',
  treeDisplayGatewayList:
    'select ip_address, status, device_type as name, "G" as tree_type from information_discovery_eth where status > 0',
  findSettingInfo: 'select * from setting_info where Category = ? and Type = ?',
  findCustomDeviceChannel1:
    'select 1 as channel_number, information_discovery_ch1.logical_identifier, information_device_data_ch1.device_name, information_device_data_ch1.manufacturer_name, information_device_data_ch1.usage, information_device_data_ch1.user_defined_name, information_device_data_ch1.product_code, information_discovery_ch1.status, fast_db_ch1.table_name, information_discovery_ch1.physical_identifier, fast_db_ch1.fast_group_number, fast_db_ch1.fast_function_code1, fast_db_ch1.fast_address1, fast_db_ch1.fast_length1, fast_db_ch1.fast_function_code2, fast_db_ch1.fast_address2, fast_db_ch1.fast_length2 from information_discovery_ch1 left outer join fast_db_ch1 on information_discovery_ch1.logical_identifier = fast_db_ch1.logical_identifier left outer join information_device_data_ch1 on information_discovery_ch1.logical_identifier = information_device_data_ch1.logical_identifier where information_discovery_ch1.physical_identifier = ?',
  findCustomDeviceChannel2:
    'select 2 as channel_number, information_discovery_ch2.logical_identifier, information_device_data_ch2.device_name, information_device_data_ch2.manufacturer_name, information_device_data_ch2.usage, information_device_data_ch2.user_defined_name, information_device_data_ch2.product_code, information_discovery_ch2.status, fast_db_ch2.table_name, information_discovery_ch2.physical_identifier, fast_db_ch2.fast_group_number, fast_db_ch2.fast_function_code1, fast_db_ch2.fast_address1, fast_db_ch2.fast_length1, fast_db_ch2.fast_function_code2, fast_db_ch2.fast_address2, fast_db_ch2.fast_length2 from information_discovery_ch2 left outer join fast_db_ch2 on information_discovery_ch2.logical_identifier = fast_db_ch2.logical_identifier left outer join information_device_data_ch2 on information_discovery_ch2.logical_identifier = information_device_data_ch2.logical_identifier where information_discovery_ch2.physical_identifier = ?',
  getChannel1MaxLogicalId:
    'select ifnull(max(information_discovery_ch1.logical_identifier), 2) as maxId from information_discovery_ch1',
  getChannel2MaxLogicalId:
    'select ifnull(max(information_discovery_ch2.logical_identifier), 33) as maxId from information_discovery_ch2',

  getInfoEventLogCh1Count:
    'SELECT ifnull(count(id), 0) AS totalCount FROM info_event_log_ch1 INNER JOIN information_device_data_ch1 ON info_event_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier where info_event_log_ch1.logical_identifier = ?',
  getInfoEventLogCh2Count:
    'SELECT ifnull(count(id), 0) AS totalCount FROM info_event_log_ch2 INNER JOIN information_device_data_ch2 ON info_event_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier where info_event_log_ch2.logical_identifier = ?',

  getFaultEventLogCh1Count:
    'SELECT ifnull(count(id), 0) AS totalCount FROM fault_event_log_ch1 INNER JOIN information_device_data_ch1 ON fault_event_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier where fault_event_log_ch1.logical_identifier = ?',
  getFaultEventLogCh2Count:
    'SELECT ifnull(count(id), 0) AS totalCount FROM fault_event_log_ch2 INNER JOIN information_device_data_ch2 ON fault_event_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier where fault_event_log_ch2.logical_identifier = ?',

  getTripwaveLogCh1Count:
    'SELECT ifnull(count(id), 0) AS totalCount FROM tripwave_log_ch1 INNER JOIN information_device_data_ch1 ON tripwave_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier where tripwave_log_ch1.logical_identifier = ?',
  getTripwaveLogCh2Count:
    'SELECT ifnull(count(id), 0) AS totalCount FROM tripwave_log_ch2 INNER JOIN information_device_data_ch2 ON tripwave_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier where tripwave_log_ch2.logical_identifier = ?',

  getInfoEventLogCh1List:
    "SELECT info_event_log_ch1.*, information_device_data_ch1.user_defined_name as device_name, concat('channe1 RS485 < ', information_device_data_ch1.user_defined_name) as location FROM info_event_log_ch1 INNER JOIN information_device_data_ch1 ON info_event_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier where info_event_log_ch1.logical_identifier = ? order by id desc limit ?, ?",
  getInfoEventLogCh2List:
    "SELECT info_event_log_ch2.*, information_device_data_ch2.user_defined_name as device_name, concat('channe2 RS485 < ', information_device_data_ch2.user_defined_name) as location FROM info_event_log_ch2 INNER JOIN information_device_data_ch2 ON info_event_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier where info_event_log_ch2.logical_identifier = ? order by id desc limit ?, ?",

  getFaultEventLogCh1List:
    "SELECT fault_event_log_ch1.*, information_device_data_ch1.user_defined_name as device_name, concat('channe1 RS485 < ', information_device_data_ch1.user_defined_name) as location FROM fault_event_log_ch1 INNER JOIN information_device_data_ch1 ON fault_event_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier where fault_event_log_ch1.logical_identifier = ? order by id desc limit ?, ?",
  getFaultEventLogCh2List:
    "SELECT fault_event_log_ch2.*, information_device_data_ch2.user_defined_name as device_name, concat('channe2 RS485 < ', information_device_data_ch2.user_defined_name) as location FROM fault_event_log_ch2 INNER JOIN information_device_data_ch2 ON fault_event_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier where fault_event_log_ch2.logical_identifier = ? order by id desc limit ?, ?",

  getTripwaveLogCh1List:
    "SELECT tripwave_log_ch1.*, information_device_data_ch1.user_defined_name as device_name, concat('channe1 RS485 < ', information_device_data_ch1.user_defined_name) as location FROM tripwave_log_ch1 INNER JOIN information_device_data_ch1 ON tripwave_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier where tripwave_log_ch1.logical_identifier = ? order by id desc limit ?, ?",
  getTripwaveLogCh2List:
    "SELECT tripwave_log_ch2.*, information_device_data_ch2.user_defined_name as device_name, concat('channe2 RS485 < ', information_device_data_ch2.user_defined_name) as location FROM tripwave_log_ch2 INNER JOIN information_device_data_ch2 ON tripwave_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier where tripwave_log_ch2.logical_identifier = ? order by id desc limit ?, ?",

  getInfoEventAllCount:
    'select a.ch1Count + a.ch2Count as totalCount from ( select ( select ifnull(count(info_event_log_ch1.id), 0) FROM info_event_log_ch1) as ch1Count, ( select ifnull(count(info_event_log_ch2.id), 0) FROM info_event_log_ch2) as ch2Count ) a',
  getFaultEventAllCount:
    'select a.ch1Count + a.ch2Count as totalCount from ( select ( select ifnull(count(fault_event_log_ch1.id), 0) FROM fault_event_log_ch1) as ch1Count, ( select ifnull(count(fault_event_log_ch2.id), 0) FROM fault_event_log_ch2) as ch2Count ) a',
  getTripwaveAllCount:
    'select a.ch1Count + a.ch2Count as totalCount from ( select ( select ifnull(count(tripwave_log_ch1.id), 0) FROM tripwave_log_ch1) as ch1Count, ( select ifnull(count(tripwave_log_ch2.id), 0) FROM tripwave_log_ch2) as ch2Count ) a',

  getInfoEventAllList:
    "SELECT info_event_log_ch1.*, information_device_data_ch1.user_defined_name AS device_name, concat('channe1 RS485 < ', information_device_data_ch1.user_defined_name) AS location FROM info_event_log_ch1 INNER JOIN information_device_data_ch1 ON info_event_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier UNION SELECT info_event_log_ch2.*, information_device_data_ch2.user_defined_name AS device_name, concat('channe2 RS485 < ', information_device_data_ch2.user_defined_name) AS location FROM info_event_log_ch2 INNER JOIN information_device_data_ch2 ON info_event_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier order by id desc limit ?, ?",
  getFaultEventAllList:
    "SELECT fault_event_log_ch1.*, information_device_data_ch1.user_defined_name AS device_name, concat('channe1 RS485 < ', information_device_data_ch1.user_defined_name) AS location FROM fault_event_log_ch1 INNER JOIN information_device_data_ch1 ON fault_event_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier UNION SELECT fault_event_log_ch2.*, information_device_data_ch2.user_defined_name AS device_name, concat('channe2 RS485 < ', information_device_data_ch2.user_defined_name) AS location FROM fault_event_log_ch2 INNER JOIN information_device_data_ch2 ON fault_event_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier order by id desc limit ?, ?",
  getTripwaveAllList:
    "SELECT tripwave_log_ch1.*, information_device_data_ch1.user_defined_name AS device_name, concat('channe1 RS485 < ', information_device_data_ch1.user_defined_name) AS location FROM tripwave_log_ch1 INNER JOIN information_device_data_ch1 ON tripwave_log_ch1.logical_identifier = information_device_data_ch1.logical_identifier UNION SELECT tripwave_log_ch2.*, information_device_data_ch2.user_defined_name AS device_name, concat('channe2 RS485 < ', information_device_data_ch2.user_defined_name) AS location FROM tripwave_log_ch2 INNER JOIN information_device_data_ch2 ON tripwave_log_ch2.logical_identifier = information_device_data_ch2.logical_identifier order by id desc limit ?, ?",

  cameraMonthChart:
    'select * from camera_temp_month where temp_date >= ? and temp_date <= ? and channel_number = ?order by temp_date asc',
  cameraWeekChart:
    'select * from camera_temp_week where temp_date >= ? and temp_date <= ? and channel_number = ? order by temp_date asc',
  cameraDayChart:
    'select * from camera_temp_day where temp_date >= ? and temp_date <= ? and channel_number = ? order by temp_date asc',

  ch1InfoEventDuplCheck:
    'select ifnull(count(1), 0) as searchCount from info_event_log_ch1 where logical_identifier = ? and logDate = ?',
  ch2InfoEventDuplCheck:
    'select ifnull(count(1), 0) as searchCount from info_event_log_ch2 where logical_identifier = ? and logDate = ?',
  ch1FaultEventDuplCheck:
    'select ifnull(count(1), 0) as searchCount from fault_event_log_ch1 where logical_identifier = ? and logDate = ?',
  ch2FaultEventDuplCheck:
    'select ifnull(count(1), 0) as searchCount from fault_event_log_ch2 where logical_identifier = ? and logDate = ?',
  ch1TripwaveDuplCheck:
    'select ifnull(count(1), 0) as searchCount from tripwave_log_ch1 where logical_identifier = ? and logDate = ?',
  ch2TripwaveDuplCheck:
    'select ifnull(count(1), 0) as searchCount from tripwave_log_ch2 where logical_identifier = ? and logDate = ?'
};

// common insert
service.insert = function (tableName, insertArgumentInfo) {
  logger.debug(
    'insert table [' + tableName + '] : ' + JSON.stringify(insertArgumentInfo)
  );
  let applyQueryArgument = helper.changeKeyToUnderScore(insertArgumentInfo);
  return new Promise((resolve, reject) => {
    let argumentKeys = _.keys(applyQueryArgument);
    let insertFullQueryString = 'INSERT INTO ' + tableName + ' (';
    let insertColumnQueryString = '';
    argumentKeys.forEach((keyName) => {
      if (keyName === 'usage') {
        keyName = '`usage`';
      }
      if (insertColumnQueryString) {
        insertColumnQueryString = insertColumnQueryString + ', ' + keyName;
      } else {
        insertColumnQueryString = keyName;
      }
    });
    insertFullQueryString =
      insertFullQueryString + insertColumnQueryString + ') VALUES (';
    let insertValueQueryString = '';
    argumentKeys.forEach((keyName) => {
      if (keyName === 'usage') {
        keyName = '`usage`';
      }
      if (insertValueQueryString) {
        insertValueQueryString = insertValueQueryString + ', ' + ':' + keyName;
      } else {
        insertValueQueryString = ':' + keyName;
      }
    });
    insertFullQueryString =
      insertFullQueryString + insertValueQueryString + ')';
    connection.query(
      insertFullQueryString,
      applyQueryArgument,
      (error, results) => {
        if (error) {
          reject(error);
          return Promise.reject(error);
        } else {
          return resolve({ insertId: results.insertId });
        }
      }
    );
  }).then((result) => {
    return service.selectOne(tableName, result.insertId);
  });
};

// common update
service.update = function (
  tableName,
  updateArgumentInfo,
  idValue,
  idColumnName
) {
  logger.debug(
    'update table [' + tableName + '] : ' + JSON.stringify(updateArgumentInfo)
  );
  let applyQueryArgument = helper.changeKeyToUnderScore(updateArgumentInfo);
  let argumentKeys = _.keys(applyQueryArgument);
  let updateFullQueryString = 'UPDATE ' + tableName + ' SET ';
  let updateSetQueryString = '';
  argumentKeys.forEach((keyName) => {
    if (keyName === 'usage') {
      keyName = '`usage`';
    }
    if (updateSetQueryString) {
      updateSetQueryString =
        updateSetQueryString + ', ' + keyName + '= :' + keyName;
    } else {
      updateSetQueryString = keyName + '= :' + keyName;
    }
  });
  idColumnName = idColumnName || 'id';
  updateFullQueryString =
    updateFullQueryString +
    updateSetQueryString +
    ' WHERE ' +
    idColumnName +
    ' = ' +
    idValue;
  return service
    .executeQueryByStr(updateFullQueryString, applyQueryArgument)
    .then(() => service.selectOne(tableName, idValue));
};

// update all
service.updateAll = function (tableName, updateArgumentInfo) {
  logger.debug(
    'updateAll table [' +
      tableName +
      '] : ' +
      JSON.stringify(updateArgumentInfo)
  );
  let applyQueryArgument = helper.changeKeyToUnderScore(updateArgumentInfo);
  let argumentKeys = _.keys(applyQueryArgument);
  let updateFullQueryString = 'UPDATE ' + tableName + ' SET ';
  let updateSetQueryString = '';
  argumentKeys.forEach((keyName) => {
    if (updateSetQueryString) {
      updateSetQueryString =
        updateSetQueryString + ', ' + keyName + '= :' + keyName;
    } else {
      updateSetQueryString = keyName + '= :' + keyName;
    }
  });
  updateFullQueryString = updateFullQueryString + updateSetQueryString;
  logger.debug('updateFullQueryString : ' + updateFullQueryString);
  return service.executeQueryByStr(updateFullQueryString, applyQueryArgument);
};

// select table all
service.select = function (tableName, searchParam) {
  let selectFullQuerySting = 'select * from ' + tableName;
  if (searchParam && searchParam.pageSize) {
    let page = Number(searchParam.page || 1);
    let pageSize = Number(searchParam.pageSize);
    let queryParam = { limit: pageSize * (page - 1), pageSize: pageSize };
    let sortColumn = searchParam.sort ? _.snakeCase(searchParam.sort) : 'id';
    let sortDesc = searchParam.sortDesc ? searchParam.sortDesc : 'desc';
    selectFullQuerySting =
      selectFullQuerySting +
      ' order by ' +
      sortColumn +
      ' ' +
      sortDesc +
      ' limit :limit, :pageSize';
    let selectCountQuerySting =
      'select ifnull(count(id), 0) AS totalCount from ' + tableName;
    return service
      .selectQueryByStr(selectCountQuerySting)
      .then((totalCountQueryResult) => {
        const totalCount = totalCountQueryResult[0].totalCount;
        let result = {};
        result.totalCount = totalCount;
        return service
          .selectQueryByStr(selectFullQuerySting, queryParam)
          .then((data) => {
            result.data = data;
            return result;
          });
      });
  }
  logger.debug('select table [' + tableName + ']');
  return new Promise((resolve, reject) => {
    connection.query(selectFullQuerySting, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(helper.changeResultKeyToUnderScore(results));
      }
    });
  });
};

// select table row 1
service.selectOne = function (tableName, id, idColumnName) {
  logger.debug('selectOne table [' + tableName + ']');
  idColumnName = idColumnName || 'id';
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM ' + tableName + ' where ' + idColumnName + '= :id',
      { id: id },
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(helper.changeResultKeyToUnderScore(results)[0]);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};

// delete table 1 row
service.delete = function (tableName, id, idColumn) {
  logger.debug('delete table [' + tableName + ']');
  idColumn = idColumn || 'id';
  let queryString = 'delete from ' + tableName + ' where ' + idColumn + '= :id';
  return service.executeQueryByStr(queryString, { [idColumn]: id });
};

// delete table all
service.deleteAll = function (tableName) {
  logger.debug('deleteAll table [' + tableName + ']');
  let queryString = 'delete from ' + tableName;
  return service.executeQueryByStr(queryString);
};

// insert, update, delete by queryId
service.executeQueryById = function (queryId, paramObject) {
  logger.debug(
    'executeQueryById queryId [' +
      queryId +
      '] : ' +
      JSON.stringify(paramObject)
  );
  return new Promise((resolve, reject) => {
    connection.query(queryInfo[queryId], paramObject, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({ success: true });
      }
    });
  });
};

// select by queryId
service.selectQueryById = function (queryId, paramObject) {
  logger.debug(
    'selectQueryById queryId [' + queryId + '] : ' + JSON.stringify(paramObject)
  );
  return new Promise((resolve, reject) => {
    connection.query(queryInfo[queryId], paramObject, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(helper.changeResultKeyToUnderScore(results));
      }
    });
  });
};

// insert, update, delete by queryString
service.executeQueryByStr = function (queryString, paramObject) {
  logger.debug(
    'executeQueryByStr queryString [' +
      queryString +
      '] : ' +
      JSON.stringify(paramObject)
  );
  return new Promise((resolve, reject) => {
    connection.query(queryString, paramObject, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({ success: true });
      }
    });
  });
};

// select by queryString
service.selectQueryByStr = function (queryString, paramObject) {
  logger.debug(
    'selectQueryByStr queryString [' +
      queryString +
      '] : ' +
      JSON.stringify(paramObject)
  );
  return new Promise((resolve, reject) => {
    connection.query(queryString, paramObject, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(helper.changeResultKeyToUnderScore(results));
      }
    });
  });
};

service.connection = connection;

module.exports = service;
