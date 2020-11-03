'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const logger = require('../util/logger');
const _ = require('lodash');
const queryIdPrefix = 'template.';

// 템플릿 등록
router.post('/', function (req, res, next) {
  let paramObject = req.paramObject;
  let isFavorite = paramObject.isFavorite;
  let dbParam = {};
  dbParam.updateMemberId = paramObject.loginId;
  dbParam.memberId = paramObject.loginId;
  dbParam.companyId = paramObject.companyId;
  dbParam.categorySmallId = paramObject.categorySmallId;
  dbParam.ask = paramObject.ask;
  dbParam.reply = paramObject.reply;
  dbParam.link = paramObject.link;
  dbParam.linkProtocol = paramObject.linkProtocol;
  dbParam.imagePath = paramObject.imagePath;
  dbParam.imageName = paramObject.imageName;
  dbService
    .insert('template2', dbParam)
    .then((newTemplate) => {
      if (isFavorite === 1) {
        let favoriteParam = {};
        favoriteParam.companyId = paramObject.companyId;
        favoriteParam.loginId = paramObject.loginId;
        favoriteParam.templateId = newTemplate.id;
        dbService
          .executeQueryById(
            queryIdPrefix + 'createTemplateFavorite',
            favoriteParam
          )
          .catch((error) => {
            logger.error('createTemplateFavorite error : ' + error);
          });
      }
      let promiseList = [];
      let keywordIds = paramObject.keywordIds;
      if (keywordIds && keywordIds.length) {
        for (
          let keywordIdsIndex = 0;
          keywordIdsIndex < keywordIds.length;
          keywordIdsIndex++
        ) {
          promiseList.push(
            dbService.insert('template_keyword', {
              companyId: paramObject.companyId,
              updateMemberId: paramObject.loginId,
              templateId: newTemplate.id,
              keywordId: keywordIds[keywordIdsIndex]
            })
          );
        }
      }
      return Promise.all(promiseList).then(() => {
        dbService
          .selectQueryById('keyword.findByTemplateId', {
            templateId: newTemplate.id
          })
          .then((keywordList) => {
            newTemplate.keywordList = keywordList;
            let keywordIds = _.map(keywordList, (info) => {
              return info.id;
            });
            newTemplate.keywordIds = keywordIds;
            res.send(newTemplate);
          });
      });
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 수정
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let isFavorite = paramObject.isFavorite;
  let dbParam = {};
  dbParam.updateMemberId = paramObject.loginId;
  dbParam.memberId = paramObject.loginId;
  dbParam.categorySmallId = paramObject.categorySmallId;
  dbParam.ask = paramObject.ask;
  dbParam.reply = paramObject.reply;
  dbParam.link = paramObject.link;
  dbParam.linkProtocol = paramObject.linkProtocol;
  dbParam.imagePath = paramObject.imagePath;
  dbParam.imageName = paramObject.imageName;
  dbService
    .executeQueryById(queryIdPrefix + 'deleteTemplateKeyword', {
      templateId: id
    })
    .then(() => {
      return dbService
        .update('template2', dbParam, id)
        .then((updateTemplate) => {
          let favoriteParam = {};
          favoriteParam.companyId = paramObject.companyId;
          favoriteParam.loginId = paramObject.loginId;
          favoriteParam.templateId = id;
          if (isFavorite === 1) {
            dbService
              .executeQueryById(
                queryIdPrefix + 'createTemplateFavorite',
                favoriteParam
              )
              .catch((error) => {
                logger.error('createTemplateFavorite error : ' + error);
              });
          } else {
            dbService
              .executeQueryById(
                queryIdPrefix + 'deleteFavoriteToMember',
                favoriteParam
              )
              .catch((error) => {
                logger.error('deleteFavoriteToMember error : ' + error);
              });
          }
          let promiseList = [];
          let keywordIds = paramObject.keywordIds;
          if (keywordIds && keywordIds.length) {
            for (
              let keywordIdsIndex = 0;
              keywordIdsIndex < keywordIds.length;
              keywordIdsIndex++
            ) {
              promiseList.push(
                dbService.insert('template_keyword', {
                  companyId: paramObject.companyId,
                  updateMemberId: paramObject.loginId,
                  templateId: id,
                  keywordId: keywordIds[keywordIdsIndex]
                })
              );
            }
          }
          return dbService
            .selectQueryById('keyword.findByTemplateId', {
              templateId: id
            })
            .then((keywordList) => {
              updateTemplate.keywordList = keywordList;
              let keywordIds = _.map(keywordList, (info) => {
                return info.id;
              });
              updateTemplate.keywordIds = keywordIds;
              res.send(updateTemplate);
            });
        });
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 전체 조회
router.post('/findAll', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    checkFavorite: paramObject.checkFavorite
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findAll', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 조회 : 카테고리 대분류
router.post('/findByCategoryLargeId', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    checkFavorite: paramObject.checkFavorite,
    categoryLargeId: paramObject.categoryLargeId
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findByCategoryLargeId', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 조회 : 카테고리 중분류
router.post('/findByCategoryMiddleId', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    checkFavorite: paramObject.checkFavorite,
    categoryMiddleId: paramObject.categoryMiddleId
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findByCategoryMiddleId', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 조회 : 카테고리 소분류
router.post('/findByCategorySmallId', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    checkFavorite: paramObject.checkFavorite,
    categorySmallId: paramObject.categorySmallId
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findByCategorySmallId', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 조회 : 내가 즐겨찾기한 템플릿 목록
router.post('/findByFavoriteLoginMemberId', function (req, res, next) {
  let paramObject = req.paramObject;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findByFavoriteLoginMemberId', dbParam)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

// :loginId
// :companyId

// :checkFavorite
// :checkMyAdd

// :categoryLargeId
// :categoryMiddleId
// :categorySmallId

// :keywordType
// :searchValue

// :limit
// :pageSize

module.exports = router;
