'use strict';
const _ = require('lodash');

// isEmp ---> is_emp
const changeKeyToUnderScore = function (paramObject) {
  let convertParam = {};
  let paramKeys = _.keys(paramObject);
  paramKeys.forEach((paramKey) => {
    convertParam[_.snakeCase(paramKey)] = paramObject[paramKey];
  });
  return convertParam;
};

// is_emp ---> isEmp
const changeKeyToCamelCase = function (paramObject) {
  let convertParam = {};
  let paramKeys = _.keys(paramObject);
  paramKeys.forEach((paramKey) => {
    // json 컬럼일 경우 parse 해서 던져주기
    if (paramKey.indexOf('json') !== -1) {
      convertParam[_.camelCase(paramKey)] = JSON.parse(paramObject[paramKey]);
    } else {
      convertParam[_.camelCase(paramKey)] = paramObject[paramKey];
    }
  });
  return convertParam;
};

const changeResultKeyToUnderScore = function (dbResults) {
  let convertResults = [];
  if (dbResults && dbResults.length) {
    dbResults.forEach((dbInfo) => {
      convertResults.push(changeKeyToCamelCase(dbInfo));
    });
  }
  return convertResults;
};

module.exports = {
  changeKeyToUnderScore: changeKeyToUnderScore,
  changeResultKeyToUnderScore: changeResultKeyToUnderScore
};
