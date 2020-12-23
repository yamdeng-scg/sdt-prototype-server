-- 1.regist_member : 회원 로그인

DELIMITER //

CREATE OR REPLACE PROCEDURE regist_member(
	IN _company_id VARCHAR(255),
	IN _login_name VARCHAR(255),
	IN _name VARCHAR(255),
  IN _auth_level INT,
  IN _dept_name VARCHAR(255),
  IN _position_name VARCHAR(255),
  IN _use_status INT
) BEGIN

    /*
      
      기능명 : 회원 로그인(상담사 로그인)
      매개변수
        -회사 id : _company_id VARCHAR(255)
        -직원번호 : _login_name VARCHAR(255)
        -이름 : _name VARCHAR(255)
        -권한 : _auth_level INT
        -부서명 : _dept_name VARCHAR(255)
        -직급명 : _position_name VARCHAR(255)
        -사용여부 : use_status INT

    */

    -- 회원 id
    -- 회원의 speaker id
    DECLARE v_member_id INT;
    DECLARE v_speaker_id INT;

    -- 기존 등록된 회원 조회
    SELECT id, speaker_id INTO v_member_id, v_speaker_id
      FROM member WHERE company_id = _company_id AND login_name = _login_name;

    -- 회원 존재 여부에 따라 분기
    IF v_member_id IS NULL THEN
        -- 등록된 회원이 없으면 speaker, member 테이블 insert 
        INSERT INTO speaker2(company_id, name, is_customer) VALUES(_company_id, _name, 0);
        SET v_speaker_id = LAST_INSERT_ID();
        
        INSERT INTO member(company_id, speaker_id, login_name, name, auth_level, dept_name, position_name, use_status) VALUES(_company_id, v_speaker_id, _login_name, _name, _auth_level, _dept_name, _position_name, _use_status);
    ELSE
        -- 회원이 존재하면 member, speaker 테이블의 이름 값 컬럼을 update
        UPDATE member
            SET name = _name, dept_name = _dept_name, position_name = _position_name, use_status = _use_status
          WHERE id = v_member_id;
          
        UPDATE speaker2
            SET name = _name
          WHERE id = v_speaker_id; 
    END IF;
END;
//

DELIMITER ;

-- 2.regist_customer : 고객 로그인

DELIMITER //

CREATE OR REPLACE PROCEDURE regist_customer(
	IN _company_id VARCHAR(255),
	IN _gasapp_member_number VARCHAR(255),
	IN _name VARCHAR(255),
  IN _tel_number VARCHAR(255)
) BEGIN

    /*
      
      기능명 : 고객 로그인(가스앱 사용자 로그인)
      매개변수
        -회사 id : _company_id VARCHAR(255)
        -가스앱 회원번호 : _gasapp_member_number VARCHAR(255)
        -고객 이름 : _name VARCHAR(255)
        -고객 폰번호 : _telno VARCHAR(255)

    */

    -- 고객 id
    -- 고객 회사별 상세 정보 id
    -- 고객 speaker id
    -- 방 id
    DECLARE v_customer_id INT;
    DECLARE v_customer_company_id INT;
    DECLARE v_speaker_id INT;
    DECLARE v_room_id INT;

    -- 기존 등록된 고객 조회
      SELECT id INTO v_customer_id
        FROM customer2
      WHERE gasapp_member_number = _gasapp_member_number;

    -- 기존 등록된 회사별 고객 상세 조회
      SELECT id, speaker_id, room_id INTO v_customer_company_id, v_speaker_id, v_room_id
        FROM v_customer
      WHERE company_id = _company_id AND gasapp_member_number = _gasapp_member_number;

    -- 고객 존재 여부에 따라 분기
    IF v_customer_id IS NULL THEN
        -- 등록된 고객이 없는 경우 : customer, customer_company, speaker, room, room_speaker 테이블 insert
        INSERT INTO speaker2(company_id, name, is_customer) VALUES(_company_id, _name, 1);
        SET v_speaker_id = LAST_INSERT_ID();

        INSERT INTO customer2(gasapp_member_number, name, tel_number, speaker_id) VALUES (_gasapp_member_number, _name, _tel_number, v_speaker_id);
        SET v_customer_id = LAST_INSERT_ID();
        
        -- 방의 상태를 종료로 초기화 : 8
        INSERT INTO room(company_id, state, name) VALUES(_company_id, 8, _name);
        SET v_room_id = LAST_INSERT_ID();

        INSERT INTO room_speaker(company_id, room_id, speaker_id, is_customer) VALUES(_company_id, v_room_id, v_speaker_id, 1);
        INSERT INTO customer_company(company_id, customer_id, speaker_id, room_id) VALUES(_company_id, v_customer_id, v_speaker_id, v_room_id);
    ELSE
        -- 등록된 고객이 존재하는 경우
        IF v_customer_company_id IS NULL THEN
          -- 고객의 회사별 상세 정보가 존재하지 않는 경우
          -- 1.customer 테이블 update
          -- 2.customer_company, speaker, room, room_speaker 테이블 insert
          UPDATE customer2
              SET name = _name, tel_number = _tel_number
            WHERE id = v_customer_id; 

          INSERT INTO speaker2(company_id, name, is_customer) VALUES(_company_id, _name, 1);
          SET v_speaker_id = LAST_INSERT_ID();
          
          INSERT INTO room(company_id, state, name) VALUES(_company_id, 2, _name);
          SET v_room_id = LAST_INSERT_ID();

          INSERT INTO room_speaker(room_id, speaker_id, is_customer) VALUES(v_room_id, v_speaker_id, 1);
          INSERT INTO customer_company(company_id, customer_id, speaker_id, room_id) VALUES(_company_id, v_customer_id, v_speaker_id, v_room_id);
        ELSE
          -- 고객의 회사별 상세 정보가 존재하는 경우 : customer, speaker 테이블 update
          UPDATE customer2
              SET name = _name, tel_number = _tel_number
            WHERE id = v_customer_id;

            UPDATE speaker2
              SET name = _name
            WHERE id = v_speaker_id;
        END IF;
    END IF;
END;
//

DELIMITER ;

-- 3.join_room : 방 join

DELIMITER //
CREATE OR REPLACE PROCEDURE join_room(
	IN _room_id INT,
	IN _speaker_id INT,
  OUT o_read_last_message_id INT,
  OUT o_max_message_id INT
) BEGIN
    /*
      
      기능명 : 방 join
      매개변수
        -방 id : _room_id INT
        -채팅 사용자 id : _speaker_id INT
        
      반환
        -이전 읽은 메시지 id : o_read_last_message_id
        -마지막 메시지 id : o_max_message_id_

    */

    -- 방 기준 가장 최근에 작성된 message id
    -- 방에 사용자가 존재 여부 체크 id
    -- 사용자의 마지막 읽음 메시지 id
    -- 사용자의 고객 여부
    -- room_history_join 테이블 id
    DECLARE v_max_message_id INT;
    DECLARE v_room_speaker_id INT;
    DECLARE v_read_last_message_id INT;
    DECLARE v_is_customer INT;
    DECLARE v_chatid INT;

    -- 가장 최근에 작성된 message id
    SELECT MAX(id) INTO v_max_message_id 
      FROM chat_message
      WHERE room_id = _room_id;
    
    -- 방에 사용자 정보가 존재하는지 조회
    SELECT id, read_last_message_id INTO v_room_speaker_id, v_read_last_message_id 
      FROM room_speaker 
      WHERE room_id = _room_id AND speaker_id = _speaker_id;

    -- 메시지 사용자의 고객 여부 정보 가져오기 
    SELECT is_customer INTO v_is_customer
      FROM speaker2
      WHERE id = _speaker_id;

    -- 방에 사용자가 정보가 존재하는 지에 따라 분기
    IF v_room_speaker_id IS NOT NULL THEN

        -- 방에 사용자가 정보가 존재하는 경우 : 마지막 읽은 메시지 최신화
        UPDATE room_speaker
            SET old_last_message_id = read_last_message_id, read_last_message_id = v_max_message_id
          WHERE room_id = _room_id AND speaker_id = _speaker_id;

        -- 마지막 메시지까지 모두 읽음 처리
        UPDATE chat_message 
            SET not_read_count = not_read_count - 1
          WHERE room_id = _room_id AND id BETWEEN IFNULL(v_read_last_message_id, 0) AND v_max_message_id;

        -- 사용자의 메시지 읽음 처리 하기
        UPDATE message_read
            SET read_date = now()
          WHERE room_id = _room_id AND speaker_id = _speaker_id AND message_id <= v_max_message_id;

        -- chatid 조회 : 최초 상담은 chatid가 존재하지 않을 수 있음(2차 검증용임)
        SELECT chatid INTO v_chatid FROM room WHERE id = _room_id;
        IF v_chatid IS NULL THEN
            UPDATE room
                SET chatid=(SELECT MAX(id) FROM room_join_history WHERE room_id = _room_id) WHERE id = _room_id;
        END IF;

    END IF;

    SET o_read_last_message_id = v_read_last_message_id;
    SET o_max_message_id = v_max_message_id;
END;
//

DELIMITER ;

-- 4.close_room : 방 종료

DELIMITER //
CREATE OR REPLACE PROCEDURE close_room(
	IN _room_id INT,
  IN _login_id INT
) BEGIN
    /*
      
      기능명 : 방 종료
      매개변수
        -방 id : _room_id INT

    */

    -- 가장 최근에 작성된 message id
    DECLARE v_message_max_id INT;

    -- 가장 최근에 작성된 message id
    SELECT MAX(id) INTO v_message_max_id
      FROM chat_message
      WHERE room_id = _room_id;

    -- room_join_history 정보 최신화
    UPDATE room_join_history 
        SET end_message_id = v_message_max_id, end_date = now(), update_member_id = _login_id
      WHERE id = (SELECT chatid 
                    FROM room
                  WHERE id = _room_id);
    
    -- 방의 사용자 정보 삭제시키기(사용자 유형이 상담사인 경우만 삭제)
    DELETE 
      FROM room_speaker 
      WHERE room_id = _room_id AND is_customer = 0;

    -- 방 정보 최신화 시키기
    UPDATE room
        SET state = 8, member_id = null, last_member_id = member_id, join_message_id = null, end_date = now(), join_history_json = null, update_member_id = _login_id
      WHERE id = _room_id;

    -- 마지막 메시지까지 모두 읽음 처리 : 속도 때문에 검토 필요
    -- UPDATE chat_message 
    --    SET not_read_count = 0
    --  WHERE room_id = _room_id;

    -- 사용자의 메시지 읽음 처리 하기 : 속도 때문에 검토 필요
    -- UPDATE message_read
    --   SET read_date = now()
    -- WHERE room_id = :room_id AND read_date is not null;
END;
//

DELIMITER ;

-- 5.transfer_room : 방 이관 시키기

DELIMITER //
CREATE OR REPLACE PROCEDURE transfer_room(
  IN _transfertype VARCHAR(20),
	IN _room_id INT,
  IN _member_id INT,
  IN _login_id INT
) BEGIN
    /*
      
      기능명 : 방 이관 시키기
      매개변수
        -이관 타입 : _transfertype VARCHAR(20)(ready:접수대기로 이동, toMember:특정 상담사로 이관)
        -방 id : _room_id INT
        -상담사 id : _member_id INT
        -옮긴 사용자 id : _login_id INT

    */

    -- 이관 시킬 회원의 speaker id
    -- 방의 현재 담당 회원의 speaker id
    DECLARE v_last_speaker_id INT;
    DECLARE v_update_speaker_id INT;

    -- 이전 speaker_id 가져오기
    SELECT speaker_id into v_last_speaker_id
      FROM member
      WHERE id = (SELECT member_id 
                    FROM room
                  WHERE id = _room_id);

    -- 이관 유형에 따라 분기(ready:접수대기로 이관, toMember:지정한 상담사에게 이관)
    IF _transfertype = 'ready' THEN
        -- 접수대기로 이관인 경우
        -- 방의 담당자 정보 변경
        UPDATE room
          SET state = 0, last_member_id = member_id, member_id = null
        WHERE id = _room_id;

        -- 방의 이전 사용자 정보 삭제
        DELETE 
          FROM room_speaker
        WHERE room_id = _room_id AND speaker_id = v_last_speaker_id;

        -- 메세지 읽음 정보 삭제
        DELETE
          FROM message_read
          WHERE room_id = _room_id AND speaker_id = v_last_speaker_id;

        -- 조인 history 정보 최신화
        UPDATE room_join_history
          SET last_member_id = member_id, member_id = null, update_member_id = _login_id
        WHERE room_id = _room_id AND END_DATE IS NULL;
    ELSE
        -- 지정한 상담사에게 이관인 경우
        -- 방의 담당자 정보 변경
        UPDATE room
          SET state = 1, last_member_id = member_id, member_id = _member_id
        WHERE id = _room_id;

        -- 이관할 상담사의 speaker_id 가져오기 
        SELECT speaker_id INTO v_update_speaker_id
          FROM member
        WHERE id = _member_id;

        -- 방의 사용자 정보를 이관할 상담사로 변경
        UPDATE room_speaker
          SET speaker_id = v_update_speaker_id, update_member_id = _login_id
        WHERE room_id = _room_id AND speaker_id = v_last_speaker_id;

        -- 메시지 읽음 정보를 이관할 상담사로 변경 시킴
        UPDATE message_read
          SET speaker_id = v_update_speaker_id
        WHERE room_id = _room_id AND speaker_id = v_last_speaker_id;
        
        -- 조인 history 정보 최신화
        UPDATE room_join_history
            SET last_member_id = member_id, member_id = _member_id, update_member_id = _login_id
          WHERE room_id = _room_id AND END_DATE IS NULL;
    END IF;
END;
//

DELIMITER ;


-- 6.match_room : 방 상담사 매칭

DELIMITER //
CREATE OR REPLACE PROCEDURE match_room(
	IN _room_id INT,
  IN _member_id INT
) BEGIN
    /*
      
      기능명 : 방 상담사 매칭
      매개변수
        -방 id : _room_id INT
        -상담사 id : _member_id INT

    */

    -- 방의 담담 회원 id : 이미 담당자가 셋팅되어있는지 확인하기 위한
    -- 매칭할 담당자의 speaker id
    -- 상담 시작시 히스토리 정보를 생성하는데 이때 해당 id : room_history_join 테이블 id
    -- 방 기준 가장 최근에 작성된 message id
    DECLARE v_member_id INT;
    DECLARE v_speaker_id INT;
    DECLARE v_chatid INT;
    DECLARE v_max_message_id INT;
    DECLARE v_room_speaker_id INT;

    -- 상담사가 존재하는지 체크하기 위한
    SELECT member_id INTO v_member_id
      FROM room WHERE id = _room_id;

    -- 상담사의 speaker id
    SELECT speaker_id INTO v_speaker_id
      FROM member WHERE id = _member_id;

    -- 가장 최근에 작성된 message max id
    SELECT MAX(id) INTO v_max_message_id
      FROM chat_message
      WHERE room_id = _room_id;

  -- 상담사의 speaker id
    SELECT id INTO v_room_speaker_id
      FROM room_speaker
     WHERE room_id = _room_id AND speaker_id = v_speaker_id;

    -- 상담사가 셋팅이 않된 방만 처리
    IF v_member_id IS NULL THEN
        -- 방 종료 history 최신화 : 상담사가 종료된 상담을 다시 시작을 하고 고객이 작성한 메시지가 없을 경우 join_message_id와 join_history_json 정보는 이전 걸로 유지된다
        INSERT INTO room_join_history (room_id, start_message_id, member_id, join_history_json, company_id, update_member_id)
            SELECT id, join_message_id, member_id, join_history_json, company_id, member_id
              FROM room
              WHERE id = _room_id;
        SET v_chatid = Last_Insert_ID();

        -- 방의 담당자 셋팅, 상태 변경, chatid 최신화
        UPDATE room SET member_id = _member_id, state = 1, chatid = v_chatid, update_member_id = _member_id
          WHERE id = _room_id;

        -- room_speaker 테이블 insert
        IF v_room_speaker_id IS NULL THEN
            INSERT INTO room_speaker(room_id, speaker_id, read_last_message_id, is_customer)
                VALUES(_room_id, v_speaker_id, NULL, 0);
        END IF;
        
        -- 방의 사용자 정보 삭제시키기(사용자 유형이 상담사인 경우만 삭제하고 상담할 상담사는 제외) : 정상적인 경우에는 필요없음 2차 검증
        DELETE 
          FROM room_speaker 
          WHERE room_id = _room_id
                AND is_customer = 0
                AND speaker_id != v_speaker_id;
                
        -- 메세지 읽음 정보 삭제(사용자 유형이 상담사인 경우만 삭제하고 상담할 상담사는 제외) : 정상적인 경우에는 필요없음 2차 검증
        DELETE
          FROM message_read
          WHERE room_id = _room_id AND speaker_id IN (SELECT speaker_id
                                                      FROM room_speaker INNER JOIN speaker2 ON room_speaker.speaker_id = speaker2.id
                                                      WHERE room_speaker.room_id = _room_id AND speaker2.is_customer = 0)
                AND speaker_id != v_speaker_id;
    END IF;
END;
//

DELIMITER ;

-- 7.make_message : 메시지 생성

DELIMITER //
CREATE OR REPLACE PROCEDURE make_message(
  IN _company_id VARCHAR(255),
  IN _room_id INT,
  IN _speaker_id INT,
  IN _message_type TINYINT,
  IN _is_system_message TINYINT,
  IN _message VARCHAR(2047),
  IN _message_admin_type TINYINT,
  IN _is_employee TINYINT,
  IN _message_detail VARCHAR(255),
  IN _template_id INT
)
BEGIN

    /*
      
      기능명 : 메시지 생성
      매개변수
        -회사 id : _company_id VARCHAR(255)
        -방 id : _room_id INT
        -사용자 id : _speaker_id INT
        -메시지 타입 : _message_type TINYINT
        -시스템 메시지 여부 id : _is_system_message TINYINT
        -메시지 : _message VARCHAR(2047)
        -상담자 전송 여부 : _message_admin_type TINYINT
        -메시지 사용자 유형 : _is_employee TINYINT(0:사용자, 1:상담사)
        -메시지 상세 정보(링크 상세정보) : _message_detail VARCHAR(255)
        -템플릿 id : _template_id INT

    */

    -- new message id
    -- 방의 사용자 count
    -- 방의 상태
    DECLARE v_message_id INT;
    DECLARE v_speaker_count INT;
    DECLARE v_room_state TINYINT(1);
  
    -- room_speaker count 조회
    SELECT COUNT(1) INTO v_speaker_count
      FROM room_speaker
      WHERE room_id = _room_id;

    -- message insert
    INSERT chat_message(company_id, room_id, speaker_id, message_type, is_system_message, message, message_admin_type, is_employee, message_detail, template_id, not_read_count)
      VALUES(_company_id, _room_id, _speaker_id, _message_type, _is_system_message, _message, _message_admin_type, _is_employee, _message_detail, _template_id, (case when _message_admin_type = 1 then 0 else v_speaker_count - 1 end) );
              
    SET v_message_id = LAST_INSERT_ID();

    IF _message_admin_type = 0 THEN

        -- 메시지 작성자는 읽은 메시지 정보를 최신화 시킴.
        UPDATE room_speaker
            SET old_last_message_id = read_last_message_id, read_last_message_id = v_message_id
          WHERE room_id = _room_id AND speaker_id = _speaker_id;

        -- 메시지 읽음 테이블 insert : speaker_id는 제외하고 
        INSERT INTO message_read (company_id, room_id, message_id, speaker_id)
              SELECT _company_id, room_id, v_message_id, speaker_id
                FROM room_speaker
              WHERE room_id = _room_id
                AND speaker_id != _speaker_id;
        
        -- room 상태 가져오기
        SELECT state INTO v_room_state
          FROM room
          WHERE id = _room_id;
          
        -- 방 상태가 종료 이상인 경우 : 상태를 대기로, 종료일, 조인 메시지 id를 최신화
        IF v_room_state > 1 THEN
            UPDATE room
              SET state = 0, end_date = null, join_message_id = v_message_id
            WHERE id = _room_id;
        END IF;
        
    END IF;

    -- 메시지 상세 조회
    SELECT
			m.*,
			(
				CASE WHEN m.is_employee = 1 THEN 0 ELSE 1 END
			) AS is_customer,
			(
        SELECT
          CASE WHEN m.is_employee = 0 AND r.member_id IS NULL THEN 1 ELSE COUNT(1) END
        FROM
          message_read
        WHERE
          message_id = m.id
          AND read_date IS NULL
      ) no_read_count,
			r.name AS room_name,
			s.name AS speaker_name,
      r.join_message_id as join_message_id,
			r.is_online,
			(
			    SELECT
			      gasapp_member_number
			    FROM
			      v_customer
			    WHERE
			      room_id = r.id
			      AND company_id = r.company_id
			) AS gasapp_member_number
		FROM 
			room r 
			INNER JOIN chat_message m ON r.id = m.room_id
			LEFT OUTER JOIN speaker2 s ON m.speaker_id = s.id
		WHERE 
			m.id = v_message_id;

END;
//

DELIMITER ;


-- 8.read_message : 메시지 읽음

DELIMITER //
CREATE OR REPLACE PROCEDURE read_message(
	IN _room_id INT,
	IN _speaker_id INT,
  IN _start_id INT,
  IN _end_id INT
) BEGIN
    /*
      
      기능명 : 메시지 읽음 처리
      매개변수
        -방 id : _room_id INT
        -채팅 사용자 id : _speaker_id INT
        -읽음 시작 id : _start_id INT
        -읽음 종료 id : _end_id INT

    */

    -- 방에 사용자가 존재 여부 체크 id
    DECLARE v_room_speaker_id INT;

    -- 방에 사용자 정보가 존재하는지 조회
    SELECT id INTO v_room_speaker_id 
      FROM room_speaker 
      WHERE room_id = _room_id AND speaker_id = _speaker_id;
    
    -- room에 속한 사용자인 경우만 읽음 처리
    IF v_room_speaker_id IS NOT NULL THEN

        -- 마지막 읽은 메시지 최신화
        UPDATE room_speaker
            SET old_last_message_id = read_last_message_id, read_last_message_id = _end_id
          WHERE room_id = _room_id AND speaker_id = _speaker_id;

        -- 마지막 메시지까지 모두 읽음 처리
        UPDATE chat_message 
            SET not_read_count = not_read_count - 1
          WHERE room_id = _room_id AND id BETWEEN IFNULL(_start_id, 0) AND IFNULL(_end_id, 0);

        -- 사용자의 메시지 읽음 처리 하기
        UPDATE message_read
            SET read_date = now()
          WHERE room_id = _room_id AND speaker_id = _speaker_id AND message_id <= IFNULL(_end_id, 0);

    END IF;

END;
//

DELIMITER ;