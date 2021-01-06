'use strict';

const express = require('express');
const router = express.Router();
const Constant = require('../config/constant');
const fileUploadPath = process.env.FILE_UPLOAD_PATH;
const fileSavePath = process.env.FILE_SAVE_PATH;
const multer = require('multer');
const upload = multer({ dest: fileUploadPath });
const fs = require('fs');
const path = require('path');
let sharp = null;
try {
  sharp = require('sharp');
  sharp.cache(false);
} catch (e) {
  sharp = null;
}

/*

 image 업로드

*/
router.post('/uploadWithThumbnail', upload.single('file'), function (req, res) {
  let file = req.file;
  let uploadFileInfo = {};
  uploadFileInfo.status = 'upload';
  uploadFileInfo.fileOriginalName = file.originalname;
  uploadFileInfo.fileName = file.filename;
  uploadFileInfo.fileSize = file.size;
  uploadFileInfo.fileExtension = file.originalname.substr(
    file.originalname.lastIndexOf('.') + 1
  );
  uploadFileInfo.fileFullName =
    uploadFileInfo.fileName + '.' + uploadFileInfo.fileExtension;
  uploadFileInfo.fileType = file.mimetype;
  uploadFileInfo.fileUrl =
    process.env.FILE_DOWNLOAD_URL + 'temp/' + uploadFileInfo.fileName;

  // 이미지 썸네일
  if (true && file.mimetype.indexOf('image') !== -1 && sharp) {
    sharp(fileUploadPath + path.sep + uploadFileInfo.fileName)
      .resize(200, 200)
      .toFile(
        fileUploadPath +
          path.sep +
          file.filename +
          Constant.IMAGE_THUMNAIL_POST_FILE_NAME
      );
  }
  res.send(uploadFileInfo);
});

// 임시 파일 다운로드
router.get('/temp/:fileName', function (req, res) {
  const fileName = req.params.fileName;
  const thumnail = req.query.thumbnail;
  const disposition = 'inline';
  let filePath = fileUploadPath + path.sep + fileName;
  if (thumnail === 'Y') {
    filePath = filePath + Constant.IMAGE_THUMNAIL_POST_FILE_NAME;
  }
  res.contentType('image/*');
  res.setHeader(
    'Content-Disposition',
    disposition + '; filename=' + fileName + ';'
  );
  fs.readFile(filePath, function (error, data) {
    res.send(data);
  });
});

// 파일 다운로드
router.get('/down/:fileName', function (req, res) {
  const fileName = req.params.fileName;
  const thumnail = req.query.thumbnail;
  const disposition = 'inline';
  let filePath = fileSavePath + path.sep + fileName;
  if (thumnail === 'Y') {
    filePath = filePath + Constant.IMAGE_THUMNAIL_POST_FILE_NAME;
  }
  res.contentType('image/*');
  res.setHeader(
    'Content-Disposition',
    disposition + '; filename=' + fileName + ';'
  );
  fs.readFile(filePath, function (error, data) {
    res.send(data);
  });
});

module.exports = router;
