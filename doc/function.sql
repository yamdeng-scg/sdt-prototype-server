-- 1.regist_member : 회원 로그인

DELIMITER //

CREATE OR REPLACE PROCEDURE regist_member(
	IN _company_id VARCHAR(255),
	IN _employee_number VARCHAR(255),
	IN _name VARCHAR(255),
  IN _auth_level INT
) BEGIN

        /*
          
          기능명 : 회원 로그인(상담사 로그인)
          매개변수
			     -회사 id : _company_id VARCHAR(255)
           -직원번호 : _employee_number VARCHAR(255)
           -이름 : _name VARCHAR(255)

        */
        DECLARE v_member_id INT;
        DECLARE v_speaker_id INT;

        -- 기존 등록된 회원 조회
        SELECT id, speaker_id INTO v_member_id, v_speaker_id
		      FROM member WHERE company_id = _company_id AND employee_number = _employee_number;

        -- 회원 존재 여부에 따라 분기
        IF v_member_id IS NULL THEN
            -- 등록된 회원이 없으면 speaker, member 테이블 insert 
            INSERT INTO speaker2(company_id, name, is_customer) VALUES(_company_id, _name, 0);
            SET v_speaker_id = LAST_INSERT_ID();
            
            INSERT INTO member(company_id, speaker_id, employee_number, name, auth_level) VALUES(_cid, v_speakerid, _employee_number, _name, _auth_level);
        ELSE
            -- 회원이 존재하면 member, speaker 테이블의 이름 값 컬럼을 update
            UPDATE member
               SET name = _name
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
        DECLARE v_customer_id INT;
        DECLARE v_customer_company_id INT;
        DECLARE v_speaker_id INT;
        DECLARE v_room_id INT;

        -- 기존 등록된 고객 조회
         SELECT id INTO v_customer_id
           FROM customer2
          WHERE gasapp_member_no = _gasapp_member_number;

        -- 기존 등록된 회사별 고객 상세 조회
         SELECT id, speaker_id, room_id INTO v_customer_company_id, v_speaker_id, v_room_id
           FROM v_customer
          WHERE company_id = _company_id AND gasapp_member_no = _gasapp_member_no;

        -- 고객 존재 여부에 따라 분기
        IF v_customer_id IS NULL THEN
            -- 등록된 고객이 없는 경우 : customer, customer_company, speaker, room, room_speaker 테이블 insert
            INSERT INTO customer2(company_id, gasapp_member_number, name, tel_number) VALUE(_company_id, _gasapp_member_number, _name, _tel_number);
            SET v_customer_id = LAST_INSERT_ID();

            INSERT INTO speaker2(company_id, name, is_customer) VALUES(_company_id, _name, 1);
            SET v_speaker_id = LAST_INSERT_ID();
            
            INSERT INTO room(company_id, state, name) VALUES(_company_id, 2, _name);
            SET v_room_id = LAST_INSERT_ID();

            INSERT INTO room_speaker(company_id, room_id, speaker_id) VALUES(_company_id, v_room_id, v_speaker_id);
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

              INSERT INTO room_speaker(company_id, room_id, speaker_id) VALUES(_company_id, v_room_id, v_speaker_id);
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
	IN _speaker_id INT
) BEGIN
        /*
          
          기능명 : 방 join
          매개변수
			     -방 id : _room_id INT
           -채팅 사용자 id : _speaker_id INT

        */
        DECLARE v_max_message_id INT;
        DECLARE v_read_last_message_id INT;
        DECLARE v_room_speaker_id INT;
        DECLARE v_chatid INT;

        -- 가장 최근에 작성된 message max id
        SELECT MAX(id) INTO v_max_message_id 
          FROM chat_message
         WHERE room_id = _room_id;
        
        -- 방에 사용자 정보가 존재하는지 조회
        SELECT room_speaker_id, read_last_message_id INTO v_room_speaker_id, v_read_last_message_id 
          FROM room_speaker 
         WHERE room_id = _room_id AND speaker_id = _speaker_id;

        -- 방에 사용자가 정보가 존재하는 지에 따라 분기
        IF v_room_speaker_id IS NULL THEN
            -- 방에 사용자가 정보가 존재하지 않은 경우 : room_speaker 테이블 insert
            INSERT INTO room_speaker(room_id, speaker_id, read_last_message_id)
                VALUES(_room_id, _speaker_id, v_max_message_id);
            SET v_room_speaker_id = LAST_INSERT_ID();
        ELSE
            -- 방에 사용자가 정보가 존재하는 경우 : 마지막 읽은 메시지 최신화
            UPDATE room_speaker
               SET old_last_message_id = read_last_message_id, read_last_message_id = v_max_message_id
             WHERE room_id = _room_id AND speaker_id = _speaker_id;
        END IF;

        -- 마지막 메시지까지 모두 읽음 처리
        UPDATE chat_message 
           SET not_read_count = not_read_count - 1
         WHERE room_id = _room_id AND id <= IFNULL(v_max_message_id, 0);
        -- where room_id = _room_id and id between IFNULL(v_read_last_message_id, 0) and IFNULL(v_max_message_id, 0);

        -- 사용자의 메시지 읽음 처리 하기
        UPDATE message_read
           SET read_date = now()
         WHERE room_id = _room_id AND speaker_id = _speaker_id AND id <= IFNULL(v_max_message_id, 0);

        -- chatid 조회
        SELECT chatid INTO v_chatid FROM room WHERE id = _room_id;
        IF v_chatid IS NULL THEN
            UPDATE room
               SET chatid=(SELECT MAX(id) FROM room_join_history WHERE room=_room_id) WHERE id= _room_id;
        END IF;
END;
//

DELIMITER ;

-- 4.close_room : 방 종료

DELIMITER //
CREATE OR REPLACE PROCEDURE close_room(
	IN _room_id INT
) BEGIN
        /*
          
          기능명 : 방 종료
          매개변수
			     -방 id : _room_id INT

        */
        -- 종료 상태로 변경(close_room) : 2로 변경, room_join_history 정보 최신화, 방의 사용자 정보 삭제시키기, 메시지 전부 읽음 처리 시키기, space 정보 최신화 시키기(emp null)
        DECLARE v_message_max_id INT;

        -- 가장 최근에 작성된 message max id
        SELECT MAX(id) INTO v_message_max_id
          FROM chat_message
         WHERE room_id = _room_id;

        -- room_join_history 정보 최신화
        UPDATE room_join_history 
           SET end_message_id = v_message_max_id, end_date = now()
         WHERE id = (SELECT chatid 
                       FROM room
                      WHERE id = _room_id);
        
        -- 방의 사용자 정보 삭제시키기(사용자 유형이 상담사인 경우만 삭제)
        DELETE 
          FROM room_speaker 
         WHERE room = _room_id AND speaker_id IN (SELECT speaker_id
                                                    FROM room_speaker INNER JOIN speaker2 ON room_speaker.speaker_id = speaker2.id
                                                   WHERE room_speaker.room_id = _room_id AND speaker2.is_customer = 0);

        -- 방 정보 최신화 시키기
        UPDATE room
           SET state = 8, member_id = null, last_member_id = member_id, join_message_id = null, end_date = now()
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
  IN _type INT,
	IN _room_id INT,
  IN _member_id INT
) BEGIN
        /*
          
          기능명 : 방 이관 시키기
          매개변수
           -이관 타입 : _type INT(1:접수대기로 이동, 2:특정 상담사로 이관)
			     -방 id : _room_id INT
           -상담사 id : _member_id INT

        */

        DECLARE v_last_speaker_id INT;
        DECLARE v_update_speaker_id INT;

        -- 이전 speaker_id 가져오기
        SELECT speaker_id into v_last_speaker_id
          FROM member
          WHERE id = (SELECT member_id 
                        FROM room
                      WHERE id = _room_id);

        -- 이관 유형에 따라 분기(1:접수대기로 이관, 2:지정한 상담사에게 이관)
        IF _type = 1 THEN
            -- 접수대기로 이관인 경우
            -- 방의 이전 사용자 정보 삭제
            DELETE 
              FROM room_speaker
            WHERE room_id = _room_id AND speaker_id = v_last_speaker_id;

            -- 메세지 읽음 정보 삭제
            DELETE
              FROM message_read
             WHERE room = _room_id AND speaker_id = v_last_speaker_id;

            -- 조인 history 정보 최신화
            UPDATE room_join_history
              SET last_member_id=member_id, member_id=null
            WHERE room_id = _room_id AND END_DATE IS NULL;
        ELSE
            -- 지정한 상담사에게 이관인 경우
            -- 이관할 상담사의 speaker_id 가져오기 
            SELECT speaker_id INTO v_update_speaker_id
              FROM member
            WHERE id = _member_id;

            -- 방의 사용자 정보를 이관할 상담사로 변경
            UPDATE room_speaker
              SET speaker_id = v_update_speaker_id
            WHERE room = _room_id AND speaker_id = v_last_speaker_id;

            -- 메시지 읽음 정보를 이관할 상담사로 변경 시킴
            UPDATE message_read
              SET speaker_id = v_update_speaker_id
            WHERE room = _room_id AND speaker_id = v_last_speaker_id;
            
            -- 조인 history 정보 최신화
            UPDATE room_join_history
               SET last_member_id=member_id, member_id=_member_id
             WHERE room = _room_id AND END_DATE IS NULL;
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

        DECLARE v_member_id INT;
        DECLARE v_speaker_id INT;
        DECLARE v_chatid INT;

        -- 상담사가 존재하는지 체크하기 위한
        SELECT member_id INTO v_member_id
          FROM room WHERE id = _room_id;

        -- 상담사의 speaker id
        SELECT speaker_id INTO v_speaker_id
          FROM member WHERE id = _member_id;

        -- 상담사가 셋팅이 않된 방만 처리
        IF v_member_id IS NULL THEN
            INSERT INTO room_join_history (room_id, start_message_id, member_id, join_history_json, company_id)
                SELECT id, join_message_id, _member_id, join_history_json, company_id
                  FROM room
                 WHERE id = _room_id;
            SET v_chatid = Last_Insert_ID();

            -- 방의 담당자 셋팅, 상태 변경, chatid 최신화
            UPDATE room SET member = _member_id, state=0, chatid = IFNULL(v_chatid, chatid)
             WHERE id = _room_id;
            
            -- 방의 사용자 정보 삭제시키기(사용자 유형이 상담사인 경우만 삭제하고 상담할 상담사는 제외)
            DELETE 
              FROM room_speaker 
              WHERE room = _room_id AND speaker_id IN (SELECT speaker_id
                                                        FROM room_speaker INNER JOIN speaker2 ON room_speaker.speaker_id = speaker2.id
                                                        WHERE room_speaker.room_id = _room_id AND speaker2.is_customer = 0)
                    AND speaker_id != v_speaker_id;
                    
            -- 메세지 읽음 정보 삭제(사용자 유형이 상담사인 경우만 삭제하고 상담할 상담사는 제외)
            DELETE
              FROM message_read
              WHERE room = _room_id AND speaker_id IN (SELECT speaker_id
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
  IN _message_detail VARCHAR(255)
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

        */
        DECLARE v_message_id INT;
        DECLARE v_speaker_count INT;
        DECLARE v_room_state TINYINT(1);
			
			  -- room_speaker count 조회
        SELECT COUNT(*) INTO v_speaker_count
          FROM room_speaker
         WHERE room_id = _room_id;

        -- message insert
        INSERT chat_message(company_id, room_id, speaker_id, message_type, is_system_message, message, message_admin_type, is_employee, message_detail, not_read_count)
          VALUES(_company_id, _room_id, _speaker_id, _message_type, _is_system_message, _message, _message_admin_type, _is_employee, _message_detail, (case when _message_admin_type = 1 then 0 else v_speakercnt - 1 end) );
                 
        SET v_message_id = LAST_INSERT_ID();

        IF _message_admin_type = 0 THEN

            -- 메시지 작성자는 읽은 메시지 정보를 최신화 시킴.
            UPDATE room_speaker
               SET read_last_message_id = read_last_message_id, read_last_message_id = v_message_id
             WHERE room = _room_id AND speaker_id = _speaker_id;

						-- 메시지 읽음 테이블 insert
            INSERT INTO message_read (company_id, room_id, message_id, speaker_id)
                 SELECT _company_id, room_id, v_message_id, speaker_id
                   FROM room_speaker;

            -- room 상태 가져오기
            SELECT state INTO v_room_state
              FROM room
              WHERE id = _room_id;
              
            IF v_room_state > 2 THEN
                -- 방 상태가 종료 이상인 경우
                IF _is_employee = 1 THEN
                    -- 상담사가 작성한 메시지인 경우
                    UPDATE room
                       SET state = 0, end_date = null, join_message_id = (case when v_room_state = 8 then v_message_id else join_message_id end),
                           member_id = (select id from member where company_id=_company_id and speaker_id=_speaker_id)
                     WHERE id = _room_id;
                ELSE
                    -- 고객이 작성한 메시지인 경우
                    UPDATE room
                       SET state = 0, end_date = null, join_message_id = (case when v_room_state = 8 then v_message_id else join_message_id end)
                     WHERE id = _room_id;
                END IF; 
            END IF;

        END IF;
END;
//

DELIMITER ;
