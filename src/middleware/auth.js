'use strict';

const logger = require('../util/logger');
const AppError = require('../error/AppError');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');
const disableAuthPrefixUrls = ['/auth/login', '/api/company'];

module.exports = function hanlder(req, res, next) {
  try {
    let byPassAuth = false;
    let requestUrl = req.url;
    disableAuthPrefixUrls.forEach((url) => {
      if (requestUrl.indexOf(url) === 0) {
        byPassAuth = true;
      }
    });
    let paramObject = Object.assign({}, req.query, req.body);
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
          loginSpeakerId: loginProfile.speakerId
        };
        paramObject = Object.assign(paramObject, profileCommonParam);
      }
    }
    req.paramObject = paramObject;
    next();
  } catch (err) {
    logger.error('auth middleware error : ' + err);
    throw new AppError('인증정보가 존재하지 않습니다', [err], 401);
  }
};
