'use strict';

const config = {};

// 60 * 60 * 24 하루
config.JSONTOKEN_EXPIRE = 60 * 60 * 24 * 100;
// jsonweb token key
config.JSONTOKEN_SECRETKEY = 'lsisjwtsecretkey';

// 로그파일 포맷
config.LOGFILE_FORMAT = 'YYYY-MM-DD-HH:mm:ss.SSS';
// 로그파일 이름
config.LOG_FILE_NAME = 'app.log';

// 로그파일 max size
config.LOG_MAX_FILE_SIZE = 10485760;
// 로그파일 rolling 기준 파일 갯수
config.LOG_MAX_FILE_COUNT = 3;

// db connection info
config.db = {
  host: 'localhost',
  user: 'scglab2',
  password: '1234',
  port: 3306,
  database: 'sdtprototype'
};

// config.db = {
//   host: '18.219.1.127',
//   user: 'cstalk',
//   password: 'cstalk1234',
//   port: 3306,
//   database: 'cstalk'
// };

// 메시지 조회 기간
config.DEFAULT_MESSAGE_INTERVAL_DAY = 1500;

// 더보기 메시지 size
config.DEFAULT_MESSAGE_MORE_PAGE_SIZE = 30;

module.exports = config;
