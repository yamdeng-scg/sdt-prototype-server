'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
// const passwordHash = require('password-hash');
// const logger = require('../util/logger');
const Config = require('../config');
const dbService = require('../service/db');
const express = require('express');
const router = express.Router();
const AppError = require('../error/AppError');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'member.';

/*

  1.로그인
    : /login POST

  2.로그인한 사용자 정보
    : /profile GET

 */

// 로그인
router.post('/login', function (req, res, next) {
  let paramObject = req.paramObject;
  let queryId = queryIdPrefix + 'getByLoginName';
  dbService
    .selectQueryById(queryId, paramObject)
    .then((result) => {
      if (result.length > 0) {
        let profile = result[0];
        let filterProfile = _.pick(
          profile,
          'id',
          'companyId',
          'companyUseConfigJson',
          'companyName',
          'isAdmin',
          'authLevel',
          'loginName',
          'state',
          'profileImageId',
          'speakerId',
          'name'
        );
        let authJsonWebToken = jwt.sign(
          Object.assign({}, filterProfile),
          Config.JSONTOKEN_SECRETKEY,
          { expiresIn: Config.JSONTOKEN_EXPIRE }
        );
        res.send({ token: authJsonWebToken, profile: profile });
      } else {
        return Promise.reject(new AppError('존재하지 않는 ID 입니다'));
      }
    })
    .catch(errorRouteHandler(next));
});

// 로그인한 사용자 정보
router.get('/profile', function (req, res) {
  let profile = null;
  try {
    profile = jwt.verify(req.headers.authorization, Config.JSONTOKEN_SECRETKEY);
    let filterProfile = _.pick(
      profile,
      'id',
      'companyId',
      'companyUseConfigJson',
      'companyName',
      'isAdmin',
      'authLevel',
      'loginName',
      'state',
      'profileImageId',
      'speakerId',
      'name'
    );
    let authJsonWebToken = req.headers.authorization;
    res.send({ token: authJsonWebToken, profile: filterProfile });
  } catch (err) {
    throw new AppError('인증정보가 존재하지 않습니다', [err], 403);
  }
});

module.exports = router;
