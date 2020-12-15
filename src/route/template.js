'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const logger = require('../util/logger');
const queryIdPrefix = 'template.';
const convertKeywordIds = function (template) {
  if (template) {
    let keywordList = [];
    if (template.keywordIds) {
      let keywordIds = template.keywordIds.split(',');
      let keywordNames = template.keywordNames.split(',');
      for (let index = 0; index < keywordIds.length; index++) {
        keywordList.push({
          id: Number(keywordIds[index]),
          name: keywordNames[index]
        });
      }
    }
    template.keywordList = keywordList;
  }
  return template;
};

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
  dbParam.linkUrl = paramObject.linkUrl;
  dbParam.linkProtocol = paramObject.linkProtocol;
  dbParam.linkText = paramObject.linkText || '';
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
          .selectQueryById(queryIdPrefix + 'getDetail', {
            loginId: paramObject.loginId,
            id: newTemplate.id
          })
          .then((result) => {
            let template = convertKeywordIds(result[0]);
            res.send(template);
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
  dbParam.linkUrl = paramObject.linkUrl;
  dbParam.linkText = paramObject.linkText || '';
  dbParam.linkProtocol = paramObject.linkProtocol;
  dbParam.imagePath = paramObject.imagePath;
  dbParam.imageName = paramObject.imageName;
  dbService
    .executeQueryById(queryIdPrefix + 'deleteKeyword', {
      templateId: id
    })
    .then(() => {
      return dbService.update('template2', dbParam, id).then(() => {
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
          .selectQueryById(queryIdPrefix + 'getDetail', {
            id: id,
            loginId: paramObject.loginId
          })
          .then((result) => {
            let template = convertKeywordIds(result[0]);
            res.send(template);
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

// 템플릿 검색
router.get('/', function (req, res, next) {
  let paramObject = req.paramObject;
  const pageSize = paramObject.pageSize ? Number(req.query.pageSize) : 5000000;
  const page = paramObject.page ? Number(paramObject.page) : 1;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    checkFavorite: paramObject.checkFavorite,
    checkMyAdd: paramObject.checkMyAdd,
    categoryLargeId: paramObject.categoryLargeId || null,
    categoryMiddleId: paramObject.categoryMiddleId || null,
    categorySmallId: paramObject.categorySmallId || null,
    searchType: paramObject.searchType || 'all',
    searchValue: paramObject.searchValue || '',
    limit: pageSize * (page - 1),
    pageSize: pageSize
  };
  dbService
    .selectQueryById(queryIdPrefix + 'findSearchCount', dbParam)
    .then((totalCountQueryResult) => {
      const totalCount = totalCountQueryResult[0].totalCount;
      let result = {};
      result.totalCount = totalCount;
      return dbService
        .selectQueryById(queryIdPrefix + 'findSearch', dbParam)
        .then((data) => {
          result.data = data;
          res.send(result);
        });
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 상세
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let dbParam = { loginId: paramObject.loginId, id: id };
  dbService
    .selectQueryById(queryIdPrefix + 'getDetail', dbParam)
    .then((result) => {
      let template = convertKeywordIds(result[0]);
      res.send(template);
    })
    .catch(errorRouteHandler(next));
});

// 템플릿 즐겨찾기 추가 / 삭제
router.put('/:id/favorite', function (req, res, next) {
  let id = req.params.id;
  let paramObject = req.paramObject;
  let value = paramObject.value;
  let dbParam = {
    companyId: paramObject.companyId,
    loginId: paramObject.loginId,
    templateId: id
  };
  if (value) {
    dbService
      .executeQueryById(queryIdPrefix + 'createFavorite', dbParam)
      .then(() => {
        res.send({ success: true });
      })
      .catch(() => {
        res.send({ success: true });
      });
  } else {
    dbService
      .executeQueryById(queryIdPrefix + 'deleteFavoriteToMember', dbParam)
      .then(() => {
        res.send({ success: true });
      })
      .catch(errorRouteHandler(next));
  }
});

// 템플릿 삭제
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  dbService
    .delete('template2', id)
    .then((result) => {
      res.send(result);
    })
    .catch(errorRouteHandler(next));
});

module.exports = router;
