'use strict';

const Config = {};

// 로그파일 포맷
Config.LOGFILE_FORMAT = 'YYYY-MM-DD-HH:mm:ss.SSS';
// 로그파일 이름
Config.LOG_FILE_NAME = 'app.log';

// 로그파일 max size
Config.LOG_MAX_FILE_SIZE = 10485760;
// 로그파일 rolling 기준 파일 갯수
Config.LOG_MAX_FILE_COUNT = 3;

// db connection info
Config.db = {
  host: 'localhost',
  user: 'scglab2',
  password: '1234',
  port: 3306,
  database: 'sdtprototype'
};

module.exports = Config;
