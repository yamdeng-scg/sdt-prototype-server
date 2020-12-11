'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
// const passwordHash = require('password-hash');
// const logger = require('../util/logger');
const Config = require('../config');
const dbService = require('../service/db');
const companyService = require('../service/company');
const express = require('express');
const router = express.Router();
const AppError = require('../error/AppError');
const errorRouteHandler = require('../error/routeHandler');
const queryIdPrefix = 'member.';

// 로그인
router.post('/login', function (req, res, next) {
  let paramObject = req.paramObject;
  companyService
    .getMemberProfile(
      paramObject.companyId,
      paramObject.loginName,
      paramObject.password,
      paramObject.name
    )
    .then((profile) => {
      let dbParam = {
        companyId: paramObject.companyId,
        name: profile.name,
        loginName: profile.loginName,
        deptName: profile.deptName,
        positionName: profile.positionName,
        authLevel: profile.authLevel,
        useStatus: profile.useStatus
      };
      return dbService.executeQueryById(queryIdPrefix + 'regist', dbParam);
    })
    .then(() => {
      return dbService
        .selectQueryById(queryIdPrefix + 'getByLoginName', paramObject)
        .then((result) => {
          if (result.length > 0) {
            let profile = result[0];
            let filterProfile = _.pick(
              profile,
              'id',
              'loginId',
              'companyId',
              'companyUseConfigJson',
              'companyName',
              'isAdmin',
              'authLevel',
              'loginName',
              'state',
              'profileImageId',
              'speakerId',
              'name',
              'deptName',
              'positionName',
              'useStatus'
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
        });
    })
    .catch(errorRouteHandler(next));
});

// 로그인한 사용자 정보
router.get('/profile', function (req, res, next) {
  let profile = null;
  try {
    profile = jwt.verify(req.headers.authorization, Config.JSONTOKEN_SECRETKEY);
    dbService
      .selectQueryById(queryIdPrefix + 'getDetail', { id: profile.id })
      .then((result) => {
        if (result.length > 0) {
          let profile = result[0];
          let filterProfile = _.pick(
            profile,
            'id',
            'loginId',
            'companyId',
            'companyUseConfigJson',
            'companyName',
            'isAdmin',
            'authLevel',
            'loginName',
            'state',
            'profileImageId',
            'speakerId',
            'name',
            'deptName',
            'positionName',
            'useStatus'
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
  } catch (err) {
    throw new AppError('인증정보가 존재하지 않습니다', [err], 403);
  }
});

module.exports = router;
