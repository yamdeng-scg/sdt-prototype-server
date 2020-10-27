'use strict';

const config = require('../config/config');
const logger = require('../util/logger');
const helper = require('../util/helper');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const convert = require('xml-js');

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

let queryInfo = {};

service.initQuery = function () {
  let directoryName = path.join(__dirname, '../query');
  fs.readdirSync(directoryName).forEach((fileName) => {
    console.log(fileName);
    let queryPrefixName = fileName.substr(0, fileName.indexOf('.'));
    const xmlData = fs.readFileSync(
      path.join(directoryName, fileName),
      'utf-8'
    );
    let jsonString = convert.xml2json(xmlData, { compact: true, spaces: 4 });
    let jsonData = JSON.parse(jsonString);
    let queryRoot = jsonData.querys;
    let queryList = Array.isArray(queryRoot.query)
      ? queryRoot.query
      : [queryRoot.query];
    queryList.forEach((query) => {
      let queryAttribute = query._attributes;
      let queryId = queryAttribute.id;
      queryInfo[queryPrefixName + '.' + queryId] = query._cdata
        ? query._cdata
        : query._text;
    });
  });
  console.log(queryInfo);
};

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

// common insert
service.insert = function (tableName, insertArgumentInfo) {
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
    logger.debug(
      'query : ' +
        insertFullQueryString +
        ' @ argument : ' +
        JSON.stringify(applyQueryArgument)
    );
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
  logger.debug(
    'query : ' +
      updateFullQueryString +
      ' @ argument : ' +
      JSON.stringify(applyQueryArgument)
  );
  return service
    .executeQueryByStr(updateFullQueryString, applyQueryArgument)
    .then(() => service.selectOne(tableName, idValue));
};

// update all
service.updateAll = function (tableName, updateArgumentInfo) {
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
  logger.debug(
    'query : ' +
      updateFullQueryString +
      ' @ argument : ' +
      JSON.stringify(applyQueryArgument)
  );
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
    logger.debug('query : ' + selectCountQuerySting);
    return service
      .selectQueryByStr(selectCountQuerySting)
      .then((totalCountQueryResult) => {
        const totalCount = totalCountQueryResult[0].totalCount;
        let result = {};
        result.totalCount = totalCount;
        logger.debug(
          'query : ' +
            selectFullQuerySting +
            ' @ argument : ' +
            JSON.stringify(queryParam)
        );
        return service
          .selectQueryByStr(selectFullQuerySting, queryParam)
          .then((data) => {
            result.data = data;
            return result;
          });
      });
  }
  return new Promise((resolve, reject) => {
    logger.debug('query : ' + selectFullQuerySting);
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
  idColumnName = idColumnName || 'id';
  let queryString =
    'SELECT * FROM ' + tableName + ' where ' + idColumnName + '= :id';
  logger.debug('query : ' + queryString + ' @ argument : ' + id);
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
  idColumn = idColumn || 'id';
  let queryString = 'delete from ' + tableName + ' where ' + idColumn + '= :id';
  logger.debug('query : ' + queryString + ' @ argument : ' + id);
  return service.executeQueryByStr(queryString, { [idColumn]: id });
};

// delete table all
service.deleteAll = function (tableName) {
  let queryString = 'delete from ' + tableName;
  logger.debug('query : ' + queryString);
  return service.executeQueryByStr(queryString);
};

// insert, update, delete by queryId
service.executeQueryById = function (queryId, paramObject) {
  let queryString = queryInfo[queryId];
  logger.debug(
    'query : ' + queryString + ' @ argument : ' + JSON.stringify(paramObject)
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

// select by queryId
service.selectQueryById = function (queryId, paramObject) {
  let queryString = queryInfo[queryId];
  logger.debug(
    'query : ' + queryString + ' @ argument : ' + JSON.stringify(paramObject)
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

// insert, update, delete by queryString
service.executeQueryByStr = function (queryString, paramObject) {
  logger.debug(
    'query : ' + queryString + ' @ argument : ' + JSON.stringify(paramObject)
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
    'query : ' + queryString + ' @ argument : ' + JSON.stringify(paramObject)
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
