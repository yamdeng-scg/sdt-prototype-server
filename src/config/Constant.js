const Constant = {};

// 앱 빌드 환경 정보
Constant.APP_ENV_DEVELOPMENT = 'development';
Constant.APP_ENV_PRODUCTION = 'production';

// error type
Constant.ERROR_TYPE_CORE = 'core';
Constant.ERROR_TYPE_REACT = 'react';
Constant.ERROR_TYPE_APP = 'app';

// form new id
Constant.FORM_NEW_ID = 'add';

// 폼 종류
Constant.FORM_TYPE_NEW = 'add';
Constant.FORM_TYPE_EDIT = 'edit';

// 모달 라벨
Constant.LABEL_MODAL_OK = '확인';
Constant.LABEL_MODAL_CANCEL = '취소';

// company code
Constant.COMPANY_CODE_SEOUL = '1';
Constant.COMPANY_CODE_INCHEON = '2';

// 파일 업로드 상태
Constant.FILE_UPLOAD_STATUS_NEW = 'new';
Constant.FILE_UPLOAD_STATUS_ORI = 'ori';

// 파일 업로드 유형
Constant.FILE_UPLOAD_TYPE_IMAGE = 'image';
Constant.FILE_UPLOAD_TYPE_ATTACH = 'attachments';

// 방 유형
Constant.ROOM_TYPE_WAIT = 'wait';
Constant.ROOM_TYPE_ING = 'ing';
Constant.ROOM_TYPE_CLOSE = 'close';

// 대기 방 정렬 정뵤
Constant.READY_ROOM_SORT_JOIN_DATE = 'joinDate';
Constant.READY_ROOM_SORT_WAIT_TIME = 'waitTime';

// 왼쪽 메뉴 name
Constant.SIDE_BAR_MENU_CHAT = 'chat';
Constant.SIDE_BAR_MENU_TEMPLATE = 'template';
Constant.SIDE_BAR_MENU_MANUAL = 'manual';
Constant.SIDE_BAR_MENU_STATS = 'stats';
Constant.SIDE_BAR_MENU_MANAGER = 'manager';

// 메시지 목록 래퍼 유형
Constant.MESSAGE_LIST_WRAPPER_TYPE_CHAT = 'chat';
Constant.MESSAGE_LIST_WRAPPER_TYPE_HISTORY = 'history';

export default Constant;
