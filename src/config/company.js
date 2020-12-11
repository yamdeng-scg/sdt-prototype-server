'use strict';
const Constant = require('./constant');

const companyConfig = {};
companyConfig[Constant.COMPANY_CODE_SEOUL] = {
  launchTime: { start: '11:00', end: '12:00' },
  isMessageDelete: true
};

companyConfig[Constant.COMPANY_CODE_INCHEON] = {
  launchTime: { start: '11:30', end: '12:30' },
  isMessageDelete: false
};

module.exports = companyConfig;
