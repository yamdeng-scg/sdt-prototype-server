'use strict';

const process = require('process');
let databaseName = process.env.DB || 'gateway';

const config = {};

// 60 * 60 * 24 하루
config.JSONTOKEN_EXPIRE = 60 * 60 * 24 * 100;
// jsonweb token key
config.JSONTOKEN_SECRETKEY = 'lsisjwtsecretkey';

// 파일 업로드 경로
config.UPLOAD_PATH = 'uploadtemp';
// upload 폴더 경로 삭제 기준일
config.CLEAN_DIRECTORY_PASS_DAY = 1;

// 로그파일 포맷
config.LOGFILE_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';
// 로그파일 이름
config.LOG_FILE_NAME = 'app.log';
// 로그파일 max size
config.LOG_MAX_FILE_SIZE = 10485760;
// 로그파일 rolling 기준 파일 갯수
config.LOG_MAX_FILE_COUNT = 3;
// 메일 정보
config.USE_MAIL = false;
// config.MAIL_INFO = {
//     'smtpHost': 'smtp.gmail.com',
//     'smtpPort': 587,
//     'smtpLoginId': 'yamdeng@gmail.com',
//     'smtpLoginPassword': '',
//     'systemUserAddress': 'yamdeng@gmail.com'
// };

// api prefix url
config.API_PREFIX_URL = '/api';

// db connection info
config.db = {
    host: '127.0.0.1',
    user: 'root',
    password: 'dbxodbs',
    port: 3306,
    database: databaseName
};

// modbus server info
config.modbus = {
    url: 'http://127.0.0.1:30001',
    host: '127.0.0.1',
    port: 30001
};

// 개발 시현용 init data insert 여부
config.applyInitDataInsert = true;

// 가상 native 적용
config.applyVirtualNativeRun = true;

// 가상 native task interval
config.nativeTaskInterval = 3000;

// 가상 running ---> run change status interval
config.runningStatusChangeInterval = 100;

// 관리자 정보
config.ADMIN_INFO = {
    'id': 'admin',
    'name': 'admin',
    'password': 'admin',
    'email': 'yamdeng@gmail.com'
};

// jsonwebtoken 인증 bypass 
config.applyCheckAuth = true;

// system_log 테이블 삭제 시킬지 여부
config.applySystemLogTableDelete = false;

// system_log 테이블 삭제 기준 count
config.systemLogTableMax = 500;

// system_log 테이블 삭제 task interval
config.systemLogDeleteTaskInterval = 600000;

// hmi channel name
config.hmiChannel2Title = 'HMI CHANNEL2';

// customDevice check name
config.customDeviceCheckLabel = 'customDevice';

// 모니터링 화면에서 사용하는 로그성 3가지 테이블 정보를 modub에서 가져오는 task 사용 여부 및 interval
config.applyMonitoringLogGetInfoTask = false;
config.monitoringLogGetInfoTaskInterval = 600000;

// 모니터링 화면에서 사용하는 로그성 3가지 테이블 정보 삭제하는 task 사용 여부 및 interval, 테이블 삭제 기준 count
config.applyMonitoringLogTableDelete = false;
config.monitoringLogDeleteTaskInterval = 600000;
config.monitoringLogTableMax = 500;

// 로그 정보 가져오는 클라이언트 서버 정보
config.clientServer = {
    url: 'http://127.0.0.1:30001',
    host: '127.0.0.1',
    port: 30001
};

// 네트워크 설정 파일 경로
config.WNTSYSCONF_PATH = '/etc/wntsysconf.json';

// 게이트웨이 서버 연결 PORT
config.GATEWAY_DEFAULT_PORT = 80;

// 기본 테마 값
config.DEFAULT_THEME = 'light';

// 기본 다국어 값
config.DEFAULT_LOCALE = 'ko';

module.exports = config;