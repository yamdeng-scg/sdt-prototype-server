'use strict';
const fs = require('fs');
const path = require('path');
const Constant = require('../config/constant');
const fileUploadPath = process.env.FILE_UPLOAD_PATH;
const fileSavePath = process.env.FILE_SAVE_PATH;

const service = {};

// file 저장 및 url 반환
service.saveFile = function (fileName) {
  fs.renameSync(
    fileUploadPath + path.sep + fileName,
    fileSavePath + path.sep + fileName
  );
  fs.renameSync(
    fileUploadPath +
      path.sep +
      fileName +
      Constant.IMAGE_THUMNAIL_POST_FILE_NAME,
    fileSavePath + path.sep + fileName + Constant.IMAGE_THUMNAIL_POST_FILE_NAME
  );
  return process.env.FILE_DOWNLOAD_URL + 'down/' + fileName;
};

module.exports = service;
