'use strict';

const logger = require('../util/logger');
const AppError = require('../error/AppError');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');
const disableAuthPrefixUrls = [
  '/api/auth/login',
  '/api/auth/profile',
  '/api/company',
  '/api/auth/admin/login',
  '/socket.io'
];

module.exports = function hanlder(req, res, next) {
  try {
    let byPassAuth = false;
    let requestUrl = req.url;
    disableAuthPrefixUrls.forEach((url) => {
      if (requestUrl.indexOf(url) === 0) {
        byPassAuth = true;
      }
    });
    let paramObject = {};
    if (!byPassAuth) {
      let loginProfile = jwt.verify(
        req.headers.authorization,
        CONFIG.JSONTOKEN_SECRETKEY
      );
      req.loginProfile = loginProfile;
      if (loginProfile) {
        let profileCommonParam = {
          loginId: loginProfile.id,
          companyId: loginProfile.companyId,
          loginSpeakerId: loginProfile.speakerId,
          updateMemberId: loginProfile.id,
          createMemberId: loginProfile.id,
          employeeNumber: loginProfile.loginName,
          loginName: loginProfile.name
        };
        paramObject = Object.assign(paramObject, profileCommonParam);
      }
    }
    Object.assign(paramObject, req.query, req.body);
    req.paramObject = paramObject;
    next();
  } catch (err) {
    logger.error('auth middleware error : ' + err);
    throw new AppError('인증정보가 존재하지 않습니다', [err], 401);
  }
};
