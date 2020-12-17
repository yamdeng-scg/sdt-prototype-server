'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config/config');
const multer = require('multer');
const upload = multer({ dest: config.fileUploadPath });
const fs = require('fs');
const path = require('path');

router.post('/uploadImage', upload.single('imageFile'), function (req, res) {
  let file = req.file;
  let uploadFileInfo = {};
  uploadFileInfo.status = 'upload';
  uploadFileInfo.fileName = file.originalname;
  uploadFileInfo.fileTempName = file.filename;
  uploadFileInfo.fileSize = file.size;
  uploadFileInfo.fileExtension = file.originalname.substr(
    file.originalname.lastIndexOf('.') + 1
  );
  uploadFileInfo.fileFullName =
    uploadFileInfo.fileTempName + '.' + uploadFileInfo.fileExtension;
  uploadFileInfo.fileType = file.mimetype;
  fs.renameSync(
    config.fileUploadPath + path.sep + uploadFileInfo.fileTempName,
    config.fileUploadPath + path.sep + uploadFileInfo.fileFullName
  );
  uploadFileInfo.fileUrl =
    config.fileDownloadPrefixUri + uploadFileInfo.fileFullName;
  res.send(uploadFileInfo);
});

module.exports = router;
