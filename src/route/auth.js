'use strict';

const _ = require('lodash');
const process = require('process');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const logger = require('../util/logger');
const CONFIG = require('../config');
const dbService = require('../service/db');
const express = require('express');
const router = express.Router();
const AppError = require('../error/AppError');
// const mailService = require('../service/mail');
const authMiddleware = require('../middleware/auth');
// router.use(authMiddleware);
const errorRouteHandler = require('../error/routeHandler');
const moment = require('moment');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;

// 중복 계정 찾기
router.post('/accountAlreadyCheck', function (req, res, next) {
  // validate : id
  const id = req.body.id;
  dbService
    .selectQueryById('findUserByLoginId', [id])
    .then((result) => {
      if (result.length > 0) {
        return Promise.reject(new AppError('이미 존재하는 ID 입니다'));
      } else {
        res.send({ success: true });
      }
    })
    .catch(errorRouteHandler(next));
});

// 회원가입
router.post('/register', function (req, res, next) {
  // validate : 'id', 'password', 'name', 'email'
  let registerUser = Object.assign({}, req.body);
  let encodedPassword = passwordHash.generate(registerUser.password);
  registerUser.password = encodedPassword;
  dbService
    .insert('gateway_user', registerUser)
    .then(() => {
      res.send({ success: true });
      dbService.insert('table_change_info', {
        table_name: 'gateway_user',
        column_name: 'all'
      });
    })
    .catch(errorRouteHandler(next));
});

// 로그인
router.post('/login', function (req, res, next) {
  // validate : 'id', 'password'
  const id = req.body.id;
  const password = req.body.password;
  dbService
    .selectQueryById('findUserByLoginId', [id])
    .then((result) => {
      if (result.length > 0) {
        let findUser = result[0];
        if (passwordHash.verify(password, findUser.password)) {
          let authJsonWebToken = jwt.sign(
            Object.assign({}, findUser),
            CONFIG.JSONTOKEN_SECRETKEY,
            { expiresIn: CONFIG.JSONTOKEN_EXPIRE }
          );
          res.send({ authToken: authJsonWebToken });
        } else {
          return Promise.reject(new AppError('비밀번호가 맞지않습니다'));
        }
      } else {
        return Promise.reject(new AppError('존재하지 않는 ID 입니다'));
      }
    })
    .catch(errorRouteHandler(next));
});

// 계정의 password 찾기
router.post('/searchPassword', function (req, res, next) {
  // validate : email
  const email = req.body.email;
  dbService
    .selectQueryById('findUserByEmail', [email])
    .then((result) => {
      if (result.length > 0) {
        // let findUser = result[0];
        // let template = {
        //     pageTitle: 'lsis account info',
        //     bodyInfo: 'lsis account info'
        // };
        // let html = `<htm><head><title>${template.pageTitle}</title></head><title><body><h1>${template.bodyInfo}</h1></body></html>`;
        // let mailOption = {
        //     from: CONFIG.MAIL_INFO.systemUserAddress,
        //     to: findUser.email,
        //     subject: 'lsis account info',
        //     html: html
        // };
        return Promise.resolve();
        // return mailService.sendMail(mailOption);
      } else {
        return Promise.reject(
          new AppError(
            '존재하지 않는 계정정보입니다. 이메일 주소를 확인해주세요'
          )
        );
      }
    })
    .then(() => {
      res.send({ success: true });
    })
    .catch(errorRouteHandler(next));
});

// 로그인한 사용자 정보
router.get('/loginUserInfo', function (req, res) {
  let loginUser = null;
  try {
    loginUser = jwt.verify(
      req.headers.authorization,
      CONFIG.JSONTOKEN_SECRETKEY
    );
  } catch (err) {
    throw new AppError('인증정보가 존재하지 않습니다', [err], 403);
  }
  try {
    loginUser.serverType = process.env.SERVER_TYPE || 'G';
    loginUser = _.pick(loginUser, ['id', 'name', 'email', 'serverType']);
    let networkInfoString = fs.readFileSync(CONFIG.WNTSYSCONF_PATH, 'utf8');
    logger.info('networkInfoString : ' + networkInfoString);
    let networkInfo = JSON.parse(networkInfoString);
    if (networkInfo && networkInfo.network && networkInfo.network.configured) {
      loginUser.networkConfigured = true;
    } else {
      loginUser.networkConfigured = false;
    }
    let networkInterfaceName = 'br-lan';
    if (networkInfo.network.netmode === 'nat') {
      networkInterfaceName = 'br-lan';
    } else {
      networkInterfaceName = 'br-wan';
    }
    let ifconfigChild = spawnSync('/sbin/ifconfig', [networkInterfaceName]);
    if (ifconfigChild && ifconfigChild.stdout && ifconfigChild.toString) {
      let networkInterfaceInfoArray = ifconfigChild.stdout
        .toString()
        .split('\n');
      if (networkInterfaceInfoArray && networkInterfaceInfoArray.length) {
        for (
          let arrayIndex = 0;
          arrayIndex < networkInterfaceInfoArray.length;
          arrayIndex++
        ) {
          let info = networkInterfaceInfoArray[arrayIndex];
          if (info.indexOf('inet addr:') != -1) {
            let ipInfoString = info.substr(info.indexOf('inet addr:') + 10);
            if (ipInfoString) {
              let ipAddress = ipInfoString.substr(0, ipInfoString.indexOf(' '));
              loginUser.ipAddress = ipAddress;
            }
          }
        }
      }
    }
    res.send(loginUser);
  } catch (err) {
    logger.error('네트워크 파일 에러');
    res.send(loginUser);
  }
});

// 관리자계정 정보 수정
router.post('/changeAdminPassword', authMiddleware, function (req, res, next) {
  // validate : 'oriPassword', 'newPassword'
  const oriPassword = req.body.oriPassword;
  const newPassword = req.body.newPassword;
  dbService
    .selectQueryById('findUserByLoginId', [CONFIG.ADMIN_INFO.id])
    .then((result) => {
      if (result.length > 0) {
        let findUser = result[0];
        if (passwordHash.verify(oriPassword, findUser.password)) {
          let encodedPassword = passwordHash.generate(newPassword);
          return dbService.update(
            'gateway_user',
            { password: encodedPassword },
            'id',
            CONFIG.ADMIN_INFO.id
          );
        } else {
          return Promise.reject(new AppError('비밀번호가 맞지않습니다'));
        }
      } else {
        return Promise.reject(new AppError('관리자 계정이 존재하지 않습니다'));
      }
    })
    .then(() => {
      res.send({ success: true });
    })
    .catch(errorRouteHandler(next));
});

// id로 강제 로그인 : btoa('20180320lsis')
router.post('/loginForceById', function (req, res, next) {
  // validate  : 'id', 'token'
  const id = req.body.id;
  const token = req.body.token;
  let decodeToken = new Buffer(token, 'base64').toString();
  logger.info('loginForceById decodeToken : ' + decodeToken);
  if (decodeToken === moment().format('YYYYMMDD') + 'lsis') {
    dbService
      .selectQueryById('findUserByLoginId', [id])
      .then((result) => {
        if (result.length > 0) {
          let findUser = result[0];
          let authJsonWebToken = jwt.sign(
            Object.assign({}, findUser),
            CONFIG.JSONTOKEN_SECRETKEY,
            { expiresIn: CONFIG.JSONTOKEN_EXPIRE }
          );
          res.send({ authToken: authJsonWebToken });
        } else {
          return Promise.reject(new AppError('존재하지 않는 ID 입니다'));
        }
      })
      .catch(errorRouteHandler(next));
  } else {
    next(new AppError('권한이 올바르지 않습니다'));
  }
});

module.exports = router;
