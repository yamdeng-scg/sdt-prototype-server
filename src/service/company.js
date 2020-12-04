'use strict';
const axios = require('axios');
const moment = require('moment');
const Constant = require('../config/constant');

const companyConfig = {};
companyConfig[Constant.COMPANY_CODE_SEOUL] = {
  launch: { start: '11:00', end: '12:00' }
};
companyConfig[Constant.COMPANY_CODE_INCHEON] = {
  launch: { start: '11:30', end: '12:30' }
};

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

// 휴일 여부 체크
service.isHoliDay = function (companyId) {
  console.log('companyId : ' + companyId);
  return axios
    .get('https://cstalk-prototype.herokuapp.com/api/relay/isHoliday', {
      params: {
        date: moment().format('YYYY-MM-DD')
      }
    })
    .then((response) => {
      let result = response.data;
      let isHoliday = result.isHoliday;
      return Promise.resolve(isHoliday);
    });
};

// 휴일 여부 체크
service.getStartMessage = function (companyId, isHoliDay) {
  console.log('companyId : ' + companyId);
  let message = '';
  let launchInfo = companyConfig[companyId].launch;
  let { start, end } = launchInfo;
  let today = moment();
  let beforeTime = moment(start, 'hh:mm');
  let afterTime = moment(end, 'hh:mm');
  let isLaunchTime = today.isBetween(beforeTime, afterTime);
  if (isHoliDay) {
    message =
      '죄송하지만 지금은 상담 가능 시간이 아닙니다.\n*상담채팅 가능 시간: 평일 09:00 ~ 17:30\n먼저 문의 남겨주시면\n영업일 기준 익일 상담 가능 시간에\n확인 후 답변 드리겠습니다.';
  } else if (isLaunchTime) {
    message =
      '죄송하지만 지금은 상담 가능 시간이 아닙니다.\n*상담채팅 가능 시간: 평일' +
      start +
      ' ~ ' +
      end +
      '\n먼저 문의 남겨주시면\n영업일 기준 익일 상담 가능 시간에\n확인 후 답변 드리겠습니다.';
  } else {
    // 0(상담 가능한 상담사가 존재하는 경우)
    message =
      '안녕하세요, 고객님!\n상담사 배정 대기 중 입니다.\n기다리시는 동안 먼저 문의 남겨주시면\n상담사가 배정되는 대로 답변 드리겠습니다.';
    // 1(상담 가능한 상담사가 존재하지 않는 경우)
    message =
      '안녕하세요, 고객님!\n죄송하지만 현재 모든 상담사가 상담중입니다.\n기다리시는 동안 먼저 문의 남겨주시면\n상담사가 배정되는 대로 답변 드리겠습니다.';
  }
  return message;
};

// 푸쉬 전송
service.sendPush = function (companyId, gasappMemberNumber, message) {
  return axios
    .post('https://cstalk-prototype.herokuapp.com/api/relay/push', {
      member: gasappMemberNumber,
      message: message
    })
    .then((response) => {
      let result = response.data;
      let isHoliday = result.isHoliday;
      return Promise.resolve(isHoliday);
    });
};

module.exports = service;
