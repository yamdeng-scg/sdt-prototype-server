-- company <--- comp
CREATE TABLE IF NOT EXISTS `company` (
  `id` varchar(255)  NOT NULL COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `name` varchar(255) NOT NULL COMMENT '회사명',
  `alias` varchar(255) DEFAULT NULL COMMENT '회사 별칭',
  `tel_number` varchar(255) DEFAULT NULL COMMENT '회사 전화번호',
  `fax_number` varchar(255) DEFAULT NULL COMMENT '회사 fax번호',
  `call_center_number` varchar(255) DEFAULT NULL COMMENT '콜센터번호',
  `email` varchar(255) DEFAULT NULL COMMENT '회사 이메일',
  `address` varchar(255) DEFAULT NULL COMMENT '회사 주소',
  `homepage` varchar(255) DEFAULT NULL COMMENT '회사 homepage',
  `use_config` varchar(1023) DEFAULT NULL COMMENT '회사별 설정 정보(json)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id


-- member <--- emp
CREATE TABLE IF NOT EXISTS `member` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) DEFAULT NULL COMMENT '회사 id(company table)',
  `is_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '시스템관리자 여부',
  `auth_level` tinyint(1) unsigned NOT NULL DEFAULT 7 COMMENT '0:sys, 1:super, 2:admin, 3:mgr, 4:emp, 7:reader,9:guest',
  `employee_number` varchar(255) NOT NULL COMMENT '직원번호',
  `state` tinyint(1) unsigned NOT NULL DEFAULT 9 COMMENT '0:정상,1:휴식,2:회의,3:콜집중,5:퇴근,9:기타',
  `profile_image_id` bigint(5) unsigned DEFAULT NULL COMMENT '파일첨부 id(file_attach table)',
  `speaker_id` bigint(5) unsigned DEFAULT NULL COMMENT 'mesasge를 사용하는 1:1의 관계의 사용자 id(speaker는 customer, member와 같은 개념이므로 분류함 : speaker table)',
  `name` varchar(255) DEFAULT NULL COMMENT '직원 이름',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id


-- category_large <--- catelg
CREATE TABLE IF NOT EXISTS `category_large` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `name` varchar(255) DEFAULT NULL COMMENT '카테고리명',
  `minwon_code` varchar(255) DEFAULT NULL COMMENT '민원코드',
  `minwon_name` varchar(255) DEFAULT NULL COMMENT '민원코드명',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id


-- category_middle <--- catemd
CREATE TABLE IF NOT EXISTS `category_middle` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `name` varchar(255) DEFAULT NULL COMMENT '카테고리명',
  `large_category_id` bigint(5) unsigned DEFAULT NULL COMMENT '카테고리 대분류 id(category_large table)',
  `minwon_code` varchar(255) DEFAULT NULL COMMENT '민원코드',
  `minwon_name` varchar(255) DEFAULT NULL COMMENT '민원코드명',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id, large_category_id


-- category_small <--- catesm
CREATE TABLE IF NOT EXISTS `category_small` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `name` varchar(255) DEFAULT NULL COMMENT '카테고리명',
  `middle_category_id` bigint(5) unsigned DEFAULT NULL COMMENT '카테고리 대분류 id(category_middle table)',
  `minwon_code` varchar(255) DEFAULT NULL COMMENT '민원코드',
  `minwon_name` varchar(255) DEFAULT NULL COMMENT '민원코드명',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id, middle_category_id


-- customer2 <--- customer
CREATE TABLE IF NOT EXISTS `customer2` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `gasapp_member_no` varchar(255) NOT NULL COMMENT '가스앱 회원번호',
  `name` varchar(255) DEFAULT NULL COMMENT '사용자명',
  `tel_number` varchar(255) DEFAULT NULL COMMENT '핸드폰 번호',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id
-- U : gasapp_member_no


-- customer_company <--- new table
CREATE TABLE IF NOT EXISTS `customer_company` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `customer_id` bigint(5) unsigned NOT NULL COMMENT 'customer table id',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `is_block` tinyint(1) NOT NULL DEFAULT 0 COMMENT '블록 여부',
  `block_type` smallint(5) unsigned DEFAULT NULL COMMENT 'block 사유(지정 안됨(해제), 욕설 및 비속어 사용, 업무 외 대화 시도, 모든 업무에 불만, 같은내용 지속적 반복, 과도한 의심, 무리한 업무진행 요구, 사장 등 상급자 찾음, 신고협박)',
  `block_date` timestamp NULL COMMENT '블록 날짜',
  `remark` varchar(255) DEFAULT NULL COMMENT '메모',
  `block_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '블록을 설정한 회원 id(member table)',
  `room_id` bigint(5) unsigned NOT NULL COMMENT '방 id(room table)',
  `speaker_id` bigint(5) unsigned NOT NULL COMMENT 'mesasge를 사용하는 1:1의 관계의 사용자 id(speaker는 customer, member와 같은 개념이므로 분류함 : speaker table)',
  `swear_count` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '욕설사용회수',
  `insult_count` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '부적절한 멘트 회수',
  `state` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '사용하지 않는 것으로 판단됨',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- customer_id, update_member_id, company_id, block_member_id, room_id, speaker_id
-- U: customer_id, company_id


-- wise_say <--- jamesallen : id, create_date, update_date, update_member_id(member), company_id(company), title, content
CREATE TABLE IF NOT EXISTS `wise_say` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `title` varchar(255) DEFAULT NULL COMMENT '타이틀',
  `content_html` varchar(1024) DEFAULT NULL COMMENT '내용',
  `date_string` varchar(4) DEFAULT NULL COMMENT '조회 기준 월일(MMDD) : 사용하지 않을 예정',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id


-- keyword2 <--- keyword
CREATE TABLE IF NOT EXISTS `keyword2` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '타이틀',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id
-- U : company_id, name


-- manual <--- pdfmanual
CREATE TABLE IF NOT EXISTS `manual` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `manual_index` smallint(5) unsigned NOT NULL DEFAULT 1 COMMENT 'pdf 매뉴얼 사용 갯수',
  `page_number` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'page_number',
  `page_no` varchar(15) DEFAULT NULL COMMENT 'pdf pageno(사용자 등록)',
  `page_code` varchar(7) DEFAULT NULL COMMENT 'page code',
  `title` varchar(255) DEFAULT NULL COMMENT '타이틀',
  `tags` varchar(255) DEFAULT NULL COMMENT 'page tags',
  `content` varchar(2047) DEFAULT NULL COMMENT 'page content',
  `pdf_image_path` varchar(255) DEFAULT NULL COMMENT '파일 다운로드 path',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id
-- index : company_id, manual_index,
-- U : company_id, manual_index, page_number


-- manual_favorite <--- pdfmanualfavorite
CREATE TABLE IF NOT EXISTS `manual_favorite` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `member_id` bigint(5) unsigned NOT NULL COMMENT '즐겨찾기한 회원 id(member table)',
  `manual_id` bigint(5) unsigned NOT NULL COMMENT '즐겨찾기한 매뉴얼 id(manual table)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- company_id, member_id, manual_id
-- U : member_id, manual_id


-- template2 <--- template
CREATE TABLE IF NOT EXISTS `template2` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `category_small_id` bigint(5) unsigned DEFAULT NULL COMMENT '카테고리 소분류 id(category_small table)',
  `ask` varchar(1023) NOT NULL COMMENT '질문',
  `reply` varchar(1023) DEFAULT NULL COMMENT '답변',
  `link` varchar(255) DEFAULT NULL COMMENT 'link url',
  `image_path` varchar(511) DEFAULT NULL COMMENT 'image path(사용 X)',
  `image_name` varchar(127) DEFAULT NULL COMMENT 'image name(사용 X)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id, category_small_id


-- auto_message <--- templateauto : id, create_date, update_date, update_member_id(member), company_id(company), type(0, 1, 2), message
CREATE TABLE IF NOT EXISTS `auto_message` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `type` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '0:신규대화인사말,1:배정지연,2:답변지연',
  `message` varchar(1023) NOT NULL COMMENT '멘트',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id


-- template_favorite <--- templatefavorite
CREATE TABLE IF NOT EXISTS `template_favorite` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `member_id` bigint(5) unsigned NOT NULL COMMENT '즐겨찾기한 회원 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `template_id` bigint(5) unsigned NOT NULL COMMENT '즐겨찾기한 템플릿 id(template table)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- member_id, company_id, template_id
-- U: member_id, template_id

-- template_keyword <--- templatekeyword
CREATE TABLE IF NOT EXISTS `template_keyword` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `keyword_id` bigint(5) unsigned NOT NULL COMMENT '키워드 id(keyword table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `template_id` bigint(5) unsigned NOT NULL COMMENT '템플릿 id(template table)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, keyword_id, company_id, template_id
-- U : template_id, keyword_id


-- room <--- space
CREATE TABLE IF NOT EXISTS `room` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `member_id` bigint(5) unsigned DEFAULT NULL COMMENT '담당 회원 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `state` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '0:진행중,1:종료대기, 2:종료, 9:폐쇄',
  `join_message_id` bigint(5) unsigned DEFAULT NULL COMMENT 'join 시작(또는 재시작) 메시지 id(chate_message table)',
  `chat_id` int(10) unsigned DEFAULT NULL COMMENT '상담ID(기간계 연동)',
  `join_history_json` varchar(2047) DEFAULT NULL COMMENT 'join 이전 history(json)',
  `is_online` tinyint(1) NOT NULL DEFAULT 0 COMMENT '고객의 온라인 상태',
  `name` varchar(255) DEFAULT NULL COMMENT 'room 이름',
  `end_dtate` timestamp NULL DEFAULT NULL COMMENT '종료대기 및 종료한 시간',
  `last_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '이전 담당 회원 id(member table)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, member_id, company_id, join_message_id, last_member_id


-- room_join_history <--- spacehist
CREATE TABLE IF NOT EXISTS `room_join_history` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `member_id` bigint(5) unsigned NOT NULL COMMENT '방의 담당 회원 id(member table)',
  `room_id` bigint(5) unsigned DEFAULT NULL COMMENT '방 id(room table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `start_mesasge_id` bigint(5) unsigned DEFAULT NULL COMMENT '조인 시작 시작 메시지 id(chat_message table)',
  `end_mesasge_id` bigint(5) unsigned NULL COMMENT '상담 종료 메시지 id(chat_message table)',
  `end_dtate` timestamp NULL DEFAULT NULL COMMENT '상담 종료한 시간',
  `last_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '이전 담당 회원 id(member table)',
  `category_small_id` bigint(5) unsigned DEFAULT NULL COMMENT '카테고리 소분류 id(category_small table)',
  `join_history_json` varchar(2047) DEFAULT NULL COMMENT 'join 이전 history(json)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- member_id, room_id, company_id, start_mesasge_id, end_mesasge_id, last_member_id, category_small_id


-- speaker2 <--- speaker
CREATE TABLE IF NOT EXISTS `speaker2` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `update_member_id` bigint(5) unsigned DEFAULT NULL COMMENT '수정자 id(member table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `name` varchar(255) DEFAULT NULL COMMENT '대화명',
  `is_customer` tinyint(1) NOT NULL DEFAULT 1 COMMENT '고객여부',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- update_member_id, company_id


-- chat_message <--- speak
CREATE TABLE IF NOT EXISTS `chat_message` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `speaker_id` bigint(5) unsigned DEFAULT NULL COMMENT '메시지를 입력한 사용자 id(speaker table)',
  `room_id` bigint(5) unsigned NOT NULL COMMENT '방 id(room table)',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `message_type` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '0:일반,1:img,2:mv,3:attach, 4:link',
  `not_read_count` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT '메시지 읽지 않은 사용자 count ',
  `is_system_message` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1:시스템메시지',
  `message` varchar(2047) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'message',
  `message_admin_type` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT 'sys msg only adm (0:false, 1:noti, 2:warn)',
  `is_employee` tinyint(1) NOT NULL DEFAULT 0 COMMENT '직원 작성 여부',
  `message_detail` varchar(255) DEFAULT NULL COMMENT '첨부 파일/링크 이름',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- speaker_id, room_id, company_id


-- room_speaker <--- spacespeaker
CREATE TABLE IF NOT EXISTS `room_speaker` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `speaker_id` bigint(5) unsigned NOT NULL COMMENT '방에 입장한 사용자 id(speaker table)',
  `room_id` bigint(5) unsigned NOT NULL COMMENT '방 id(room table)',
  `read_last_message_id` bigint(5) unsigned DEFAULT NULL COMMENT '마지막 읽은 메시지 id(chat_message table)',
  `old_last_message_id` bigint(5) unsigned DEFAULT NULL COMMENT '이전 마지막 읽은 메시지(chat_message table) : 사용하지 않음',
  `is_alarm` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'alarm off 여부 : 사용하지 않음',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- company_id, speaker_id, room_id, read_last_message_id, old_last_message_id
-- U : room_id, speaker_id


-- message_read <--- new table
CREATE TABLE IF NOT EXISTS `message_read` (
  `id` bigint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `create_date` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `update_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  `read_date` timestamp NULL COMMENT '메시지 읽은 날짜',
  `company_id` varchar(10) NOT NULL COMMENT '회사 id(company table)',
  `room_id` bigint(5) unsigned NOT NULL COMMENT '방 id(room table)',
  `message_id` bigint(5) unsigned NOT NULL COMMENT '메시지 id(chat_message table)',
  `speaker_id` bigint(5) unsigned NOT NULL COMMENT '메시지 읽은 사용자 id(speaker table)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- company_id, room_id, message_id, speaker_id
-- U : room_id, message_id, speaker_id

/*

-- data migration query

-- company
INSERT INTO company (id, create_date, update_date, name, tel_number, homepage, fax_number, email, address, alias )
    SELECT CONCAT(id, ''), createdate, workdate, name, corpno, homepage, fax, email, addr, webname
    FROM comp;

-- member
INSERT INTO member (id, create_date, update_date, company_id, auth_level, employee_number, state, profile_image_id, speaker_id)
    SELECT id, createdate, workdate, CONCAT(cid, ''), auth, empno, state, profileimg, speaker
FROM Emp;

update member
  join Emp on Emp.empno = member.employee_number
   set member.speaker_id = Emp.speaker;

update member
  join Speaker on Speaker.id = member.speaker_id
   set member.name = Speaker. name;

-- category_large
INSERT INTO category_large (id, create_date, update_date, company_id, name, minwon_code, minwon_name)
    SELECT id, createdate, workdate, CONCAT(cid, ''), name,  mwcode, mwname
    FROM catelg;

-- category_middle
INSERT INTO category_middle (id, create_date, update_date, company_id, large_category_id,  name, minwon_code, minwon_name)
    SELECT id, createdate, workdate, CONCAT(cid, ''), catelg, name,  mwcode, mwname
    FROM catemd;

-- category_small
INSERT INTO category_small (id, create_date, update_date, company_id, middle_category_id,  name, minwon_code, minwon_name)
    SELECT id, createdate, workdate, CONCAT(cid, ''), catemd, name,  mwcode, mwname
    FROM catesm
    where catemd != 82;

-- customer2
INSERT INTO customer2 (id, create_date, update_date, gasapp_member_no, name, tel_number )
SELECT id, createdate, workdate, userno, telno, name
FROM Customer;

-- customer_company
INSERT INTO customer_company (customer_id, create_date, update_date, company_id, is_block, block_type, blockdt, remark, block_member_id, room_id, speaker_id, swear_count, insult_count, state )
SELECT id, createdate, workdate, '1', 0, blocktype, block_date, remark, blockemp, space, speaker, swear, insult, state
FROM Customer;

-- wise_say
INSERT INTO wise_say (id, create_date, update_date, company_id, date_string, content_html)
SELECT id, createdate, workdate, '1', dt, summary
FROM JamesAllen;

-- keyword2
INSERT INTO keyword2 (id, create_date, update_date, company_id, name)
SELECT id, createdate, workdate, cid, name
FROM Keyword;

-- manual
INSERT INTO manual (id, create_date, update_date, company_id, manual_index, page_number, page_no, page_code, title, tags, content, pdf_image_path)
SELECT id, createdate, workdate, '1', 1, pno, pageno, pagecode, title, tags, content, pdfimg
FROM PdfManual;

-- manual_favorite
INSERT INTO manual_favorite (id, create_date, update_date, company_id, member_id, manual_id)
SELECT id, createdate, workdate, '1', emp, pdf
FROM pdfmanualfavorite;

-- template2
INSERT INTO template2 (id, create_date, update_date, company_id, category_small_id, ask, reply, link, image_path, image_name)
SELECT id, createdate, workdate, '1', catesm, ask, reply, link, img, imgname
FROM template;

-- auto_message
INSERT INTO auto_message (id, create_date, update_date, update_member_id, company_id, type, message)
SELECT id, createdate, workdate, emp, '1', type, msg
FROM TemplateAuto;

-- template_favorite
INSERT INTO template_favorite (id, create_date, update_date, member_id, company_id, template_id)
SELECT id, createdate, workdate, emp, '1', template
FROM TemplateFavorite;

-- template_keyword
INSERT INTO template_keyword (id, create_date, update_date, company_id, template_id, keyword_id)
SELECT id, createdate, workdate, '1', template, keyword
FROM TemplateKeyword;

-- room
INSERT INTO room (id, create_date, update_date, member_id, company_id, state, join_message_id, chat_id, join_history_json, is_online, name, end_dtate, last_member_id)
SELECT id, createdate, workdate, emp, CONCAT(cid, ''), state, startid, chatid, prehistory, isonline, customer, enddt, lastemp
FROM Space;

-- room_join_history
INSERT INTO room_join_history (id, create_date, update_date, company_id, member_id, room_id, start_mesasge_id, end_mesasge_id, end_dtate, last_member_id, category_small_id, join_history_json)
SELECT id, createdate, workdate, CONCAT(cid, ''), emp, space, startid, endid, enddt, lastemp, catesm, prehistory
FROM SpaceHist;

-- speaker2
INSERT INTO speaker2 (id, create_date, update_date, company_id, name, is_customer)
SELECT id, createdate, workdate, CONCAT(cid, ''), name, iscustomer
FROM speaker;

-- speak
INSERT INTO chat_message (id, create_date, update_date, company_id, room_id, speaker_id, message_type, not_read_count, is_system_message, message, message_admin_type, is_employee, message_detail)
SELECT id, createdate, workdate, CONCAT(cid, ''), space, speaker, mtype, 0, sysmsg, msg, onlyadm, isemp, msgname
FROM speak;

-- room_speaker
INSERT INTO room_speaker (id, create_date, update_date, company_id, speaker_id, room_id, read_last_message_id, old_last_message_id, is_alarm)
SELECT id, createdate, workdate, '1', speaker, space, lastid, oldid, iscalm
FROM spacespeaker;

-- message_read
INSERT INTO message_read (create_date, update_date, read_date, company_id, room_id, message_id, speaker_id)
SELECT speak.createdate, speak.workdate, speak.workdate, '1', speak.space, speak.id, SpaceSpeaker.speaker
FROM speak inner join SpaceSpeaker on speak.space = SpaceSpeaker.space;


*/


/*

  -- company
  ALTER TABLE sdtprototype.company ADD CONSTRAINT company_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);

  -- member
 ALTER TABLE sdtprototype.`member` ADD CONSTRAINT member_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.`member` ADD CONSTRAINT member_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.`member` ADD CONSTRAINT member_speaker2_FK FOREIGN KEY (speaker_id) REFERENCES sdtprototype.speaker2(id);

 -- category_large
 ALTER TABLE sdtprototype.category_large ADD CONSTRAINT category_large_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.category_large ADD CONSTRAINT category_large_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);

 --  category_middle
 ALTER TABLE sdtprototype.category_middle ADD CONSTRAINT category_middle_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.category_middle ADD CONSTRAINT category_middle_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.category_middle ADD CONSTRAINT category_middle_category_large_FK FOREIGN KEY (large_category_id) REFERENCES sdtprototype.category_large(id);

 -- category_small
 ALTER TABLE sdtprototype.category_small ADD CONSTRAINT category_small_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.category_small ADD CONSTRAINT category_small_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.category_small ADD CONSTRAINT category_small_category_middle_FK FOREIGN KEY (middle_category_id) REFERENCES sdtprototype.category_middle(id);

 -- customer2
 ALTER TABLE sdtprototype.customer2 ADD CONSTRAINT customer2_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 CREATE UNIQUE INDEX customer2_gasapp_member_no_IDX USING BTREE ON sdtprototype.customer2 (gasapp_member_no);

 -- customer_company
 ALTER TABLE sdtprototype.customer_company ADD CONSTRAINT customer_company_customer2_FK FOREIGN KEY (customer_id) REFERENCES sdtprototype.customer2(id);
 ALTER TABLE sdtprototype.customer_company ADD CONSTRAINT customer_company_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.customer_company ADD CONSTRAINT customer_company_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.customer_company ADD CONSTRAINT customer_company_member_FK_1 FOREIGN KEY (block_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.customer_company ADD CONSTRAINT customer_company_room_FK FOREIGN KEY (room_id) REFERENCES sdtprototype.room(id);
 ALTER TABLE sdtprototype.customer_company ADD CONSTRAINT customer_company_speaker2_FK FOREIGN KEY (speaker_id) REFERENCES sdtprototype.speaker2(id);
 CREATE UNIQUE INDEX customer_company_customer_id_IDX USING BTREE ON sdtprototype.customer_company (customer_id,company_id);

 -- wise_say
 ALTER TABLE sdtprototype.wise_say ADD CONSTRAINT wise_say_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.wise_say ADD CONSTRAINT wise_say_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);

 -- keyword2
 ALTER TABLE sdtprototype.keyword2 ADD CONSTRAINT keyword2_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.keyword2 ADD CONSTRAINT keyword2_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 CREATE UNIQUE INDEX keyword2_company_id_IDX USING BTREE ON sdtprototype.keyword2 (company_id,name);

 -- manual
 ALTER TABLE sdtprototype.manual ADD CONSTRAINT manual_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.manual ADD CONSTRAINT manual_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 CREATE UNIQUE INDEX manual_company_id_IDX USING BTREE ON sdtprototype.manual (company_id,manual_index,page_number);
 CREATE INDEX manual_company_id_IDX2 USING BTREE ON sdtprototype.manual (company_id,manual_index);

 -- manual_favorite
 ALTER TABLE sdtprototype.manual_favorite ADD CONSTRAINT manual_favorite_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.manual_favorite ADD CONSTRAINT manual_favorite_member_FK FOREIGN KEY (member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.manual_favorite ADD CONSTRAINT manual_favorite_manual_FK FOREIGN KEY (manual_id) REFERENCES sdtprototype.manual(id);
 CREATE INDEX manual_favorite_member_id_IDX USING BTREE ON sdtprototype.manual_favorite (member_id,manual_id);

 -- template2
 ALTER TABLE sdtprototype.template2 ADD CONSTRAINT template2_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.template2 ADD CONSTRAINT template2_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.template2 ADD CONSTRAINT template2_category_small_FK FOREIGN KEY (category_small_id) REFERENCES sdtprototype.category_small(id);

 -- auto_message
 ALTER TABLE sdtprototype.auto_message ADD CONSTRAINT auto_message_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.auto_message ADD CONSTRAINT auto_message_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);

 -- template_favorite
 ALTER TABLE sdtprototype.template_favorite ADD CONSTRAINT template_favorite_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.template_favorite ADD CONSTRAINT template_favorite_member_FK FOREIGN KEY (member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.template_favorite ADD CONSTRAINT template_favorite_template2_FK FOREIGN KEY (template_id) REFERENCES sdtprototype.template2(id);
 CREATE UNIQUE INDEX template_favorite_member_id_IDX USING BTREE ON sdtprototype.template_favorite (member_id,template_id);

 -- template_keyword
 ALTER TABLE sdtprototype.template_keyword ADD CONSTRAINT template_keyword_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.template_keyword ADD CONSTRAINT template_keyword_keyword2_FK FOREIGN KEY (keyword_id) REFERENCES sdtprototype.keyword2(id);
 ALTER TABLE sdtprototype.template_keyword ADD CONSTRAINT template_keyword_template2_FK FOREIGN KEY (template_id) REFERENCES sdtprototype.template2(id);
 ALTER TABLE sdtprototype.template_keyword ADD CONSTRAINT template_keyword_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 CREATE UNIQUE INDEX template_keyword_template_id_IDX USING BTREE ON sdtprototype.template_keyword (template_id,keyword_id);

 -- room
 ALTER TABLE sdtprototype.room ADD CONSTRAINT room_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.room ADD CONSTRAINT room_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.room ADD CONSTRAINT room_member_FK_1 FOREIGN KEY (member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.room ADD CONSTRAINT room_chat_message_FK FOREIGN KEY (join_message_id) REFERENCES sdtprototype.chat_message(id);
 ALTER TABLE sdtprototype.room ADD CONSTRAINT room_member_FK_2 FOREIGN KEY (last_member_id) REFERENCES sdtprototype.`member`(id);

 -- room_join_history
 ALTER TABLE sdtprototype.room_join_history ADD CONSTRAINT room_join_history_member_FK FOREIGN KEY (member_id) REFERENCES sdtprototype.`member`(id);
 ALTER TABLE sdtprototype.room_join_history ADD CONSTRAINT room_join_history_room_FK FOREIGN KEY (room_id) REFERENCES sdtprototype.room(id);
 ALTER TABLE sdtprototype.room_join_history ADD CONSTRAINT room_join_history_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.room_join_history ADD CONSTRAINT room_join_history_chat_message_FK FOREIGN KEY (start_mesasge_id) REFERENCES sdtprototype.chat_message(id);
 ALTER TABLE sdtprototype.room_join_history ADD CONSTRAINT room_join_history_chat_message_FK_1 FOREIGN KEY (end_mesasge_id) REFERENCES sdtprototype.chat_message(id);
 ALTER TABLE sdtprototype.room_join_history ADD CONSTRAINT room_join_history_category_small_FK FOREIGN KEY (category_small_id) REFERENCES sdtprototype.category_small(id);
 ALTER TABLE sdtprototype.room_join_history ADD CONSTRAINT room_join_history_member_FK_1 FOREIGN KEY (last_member_id) REFERENCES sdtprototype.`member`(id);

 -- speaker2
 ALTER TABLE sdtprototype.speaker2 ADD CONSTRAINT speaker2_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.speaker2 ADD CONSTRAINT speaker2_member_FK FOREIGN KEY (update_member_id) REFERENCES sdtprototype.`member`(id);

 -- chat_message
 ALTER TABLE sdtprototype.chat_message ADD CONSTRAINT chat_message_speaker2_FK FOREIGN KEY (speaker_id) REFERENCES sdtprototype.speaker2(id);
 ALTER TABLE sdtprototype.chat_message ADD CONSTRAINT chat_message_room_FK FOREIGN KEY (room_id) REFERENCES sdtprototype.room(id);
 ALTER TABLE sdtprototype.chat_message ADD CONSTRAINT chat_message_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);

 -- room_speaker
 ALTER TABLE sdtprototype.room_speaker ADD CONSTRAINT room_speaker_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.room_speaker ADD CONSTRAINT room_speaker_speaker2_FK FOREIGN KEY (speaker_id) REFERENCES sdtprototype.speaker2(id);
 ALTER TABLE sdtprototype.room_speaker ADD CONSTRAINT room_speaker_room_FK FOREIGN KEY (room_id) REFERENCES sdtprototype.room(id);
 ALTER TABLE sdtprototype.room_speaker ADD CONSTRAINT room_speaker_chat_message_FK FOREIGN KEY (read_last_message_id) REFERENCES sdtprototype.chat_message(id);
 ALTER TABLE sdtprototype.room_speaker ADD CONSTRAINT room_speaker_chat_message_FK_1 FOREIGN KEY (old_last_message_id) REFERENCES sdtprototype.chat_message(id);
 CREATE UNIQUE INDEX room_speaker_room_id_IDX USING BTREE ON sdtprototype.room_speaker (room_id,speaker_id);

 -- 
 ALTER TABLE sdtprototype.message_read ADD CONSTRAINT message_read_company_FK FOREIGN KEY (company_id) REFERENCES sdtprototype.company(id);
 ALTER TABLE sdtprototype.message_read ADD CONSTRAINT message_read_room_FK FOREIGN KEY (room_id) REFERENCES sdtprototype.room(id);
 ALTER TABLE sdtprototype.message_read ADD CONSTRAINT message_read_chat_message_FK FOREIGN KEY (message_id) REFERENCES sdtprototype.chat_message(id);
 ALTER TABLE sdtprototype.message_read ADD CONSTRAINT message_read_speaker2_FK FOREIGN KEY (speaker_id) REFERENCES sdtprototype.speaker2(id);
 CREATE INDEX message_read_room_id_IDX USING BTREE ON sdtprototype.message_read (room_id,message_id,speaker_id);


*/


/*

   migration check query
   select sub.read_last_message_id
    from (
    select read_last_message_id
    from room_speaker) sub
    where sub.read_last_message_id not in(select id from chat_message)

*/


