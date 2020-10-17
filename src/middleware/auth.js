'use strict';

const logger = require('../utils/logger');
const AppError = require('../errors/AppError');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');

module.exports = function hanlder(req, res, next) {
    try {
        if(CONFIG.applyCheckAuth) {
            let loginUser = jwt.verify(req.headers.authorization, CONFIG.JSONTOKEN_SECRETKEY);
            req.loginUser = loginUser;
        }
        next();
    } catch(err) {
        logger.error('auth middleware error : ' + err);
        throw new AppError('인증정보가 존재하지 않습니다', [err], 403);
    }
};