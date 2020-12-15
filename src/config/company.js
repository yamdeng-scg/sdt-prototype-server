'use strict';
const Constant = require('./constant');

const companyConfig = {};
companyConfig[Constant.COMPANY_CODE_SEOUL] = {
  launchTime: { start: '11:00', end: '12:00' },
  isMessageDelete: true,
  previousUnpayLatelyMonth: 2
};

companyConfig[Constant.COMPANY_CODE_INCHEON] = {
  launchTime: { start: '11:30', end: '12:30' },
  isMessageDelete: false,
  previousUnpayLatelyMonth: 3
};

module.exports = companyConfig;
