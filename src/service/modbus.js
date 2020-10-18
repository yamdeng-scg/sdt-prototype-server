'use strict';

const CONFIG = require('../config');
const logger = require('../util/logger');
const request = require('superagent');
const AppError = require('../error/AppError');
const service = {};
service.getAddress = function (
  logical_identifier,
  function_code,
  address,
  quantity
) {
  let httpCallUrl = null;
  if (quantity) {
    httpCallUrl =
      CONFIG.modbus.url +
      '/' +
      logical_identifier +
      '/' +
      function_code +
      '/' +
      address +
      '/' +
      quantity;
  } else {
    httpCallUrl =
      CONFIG.modbus.url +
      '/' +
      logical_identifier +
      '/' +
      function_code +
      '/' +
      address;
  }
  return new Promise((resolve, reject) => {
    request
      .get(httpCallUrl)
      .then((response) => {
        if (response.body) {
          logger.info('modbus result : ' + JSON.stringify(response.body));
          resolve(response.body);
        } else {
          resolve([]);
        }
      })
      .catch((err) => {
        reject(new AppError(err.response.body.error));
      });
  });
};

service.getRealwave = function (logical_identifier) {
  let httpCallUrl =
    CONFIG.modbus.url + '/' + logical_identifier + '/chart/realwave';
  return new Promise((resolve, reject) => {
    request
      .get(httpCallUrl)
      .then((response) => {
        if (response.body) {
          logger.info('modbus result : ' + JSON.stringify(response.body));
          resolve(response.body);
        } else {
          resolve({});
        }
      })
      .catch((err) => {
        reject(new AppError(err.response.body.error));
      });
  });
};

service.getHamonic = function (logical_identifier) {
  let httpCallUrl =
    CONFIG.modbus.url + '/' + logical_identifier + '/chart/hamonic';
  return new Promise((resolve, reject) => {
    request
      .get(httpCallUrl)
      .then((response) => {
        if (response.body) {
          logger.info('modbus result : ' + JSON.stringify(response.body));
          resolve(response.body);
        } else {
          resolve({});
        }
      })
      .catch((err) => {
        reject(new AppError(err.response.body.error));
      });
  });
};

module.exports = service;
