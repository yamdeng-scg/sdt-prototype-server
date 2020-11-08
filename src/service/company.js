'use strict';
const axios = require('axios');

const Constant = require('../config/constant');
const service = {};

// 고객 프로필 정보 가져오기
service.getAppProfile = function (appId, name, telNumber) {
  if (name && telNumber) {
    return Promise.resolve({ name: name, telNumber: telNumber });
  } else {
    return axios
      .get(process.env.GASAPP_MOBILE_URL + 'api/matt/profile', {
        params: {
          member: appId
        }
      })
      .then((response) => {
        let result = response.data;
        return Promise.resolve({
          name: result.name,
          telNumber: result.handphone
        });
      });
  }
};

// 각 회사의 사원 정보 가져오기
service.getMemberProfile = function (companyId, loginName, password, name) {
  if (name) {
    return Promise.resolve({
      name: name,
      deptName: '인사과',
      loginName: loginName
    });
  } else {
    if (companyId === Constant.COMPANY_CODE_SEOUL) {
      return axios
        .get(process.env.SEOUL_MIS_URL + 'safescg/authentication', {
          params: {
            id: loginName,
            password: password
          }
        })
        .then((response) => {
          let result = response.data;
          return Promise.resolve({
            name: result.name,
            deptName: result.deptName,
            loginName: loginName
          });
        });
    } else if (companyId === Constant.COMPANY_CODE_INCHEON) {
      return axios
        .get(
          process.env.INCHEON_MIS_URL + 'safescg/authentication/' + loginName
        )
        .then((response) => {
          let result = response.data;
          return Promise.resolve({
            name: result.name,
            deptName: result.deptName,
            loginName: loginName
          });
        });
    }
  }
};

module.exports = service;
