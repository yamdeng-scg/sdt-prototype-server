SELECT 
    sub_room.*, 
    chat_message.id AS last_message_id, 
    chat_message.message AS last_message, 
    chat_message.create_date AS last_message_create_date, 
    v_customer.name AS customer_name,
    TIMESTAMPDIFF(MINUTE, sub_room.join_start_date, chat_message.create_date) as speak_minute
FROM 
  (
    SELECT 
      r.*, 
      IFNULL(
        (
          SELECT 
            create_date 
          FROM 
            chat_message 
          WHERE 
            id = r.join_message_id
        ), 
        r.create_date
      ) AS join_start_date, 
      (
        SELECT 
          MAX(id) 
        FROM 
          chat_message 
        WHERE 
          room_id = r.id
      ) AS recent_message_id, 
      (
        SELECT 
          speaker2.id 
        FROM 
          room_speaker 
          INNER JOIN speaker2 ON room_speaker.speaker_id = speaker2.id 
        WHERE 
          room_id = r.id 
          AND speaker2.is_customer = 1
      ) AS customer_speaker_id,
      mb.name as member_name
    FROM 
      room r
      INNER JOIN (
        SELECT 
          DISTINCT(room_id), 
          room_id AS message_search_room_id 
        FROM 
          chat_message 
        WHERE 
          is_system_message = 0
          AND message_admin_type = 0 
          AND message LIKE concat('%', :message, '%')
      ) messasge_search ON r.id = messasge_search.message_search_room_id
      LEFT OUTER JOIN member mb ON r.last_member_id = mb.id
                      AND mb.name LIKE concat('%', :memberName, '%')
    WHERE 
      r.company_id = :companyId 
      AND r.state = 8
      AND (
        CASE WHEN :memberId IS NULL THEN 1 = 1 ELSE last_member_id = :memberId END
      ) 
      AND date_format(end_date, '%Y-%m-%d') BETWEEN :startDate 
      AND :endDate
  ) AS sub_room 
  LEFT OUTER JOIN chat_message ON sub_room.recent_message_id = chat_message.id 
  INNER JOIN v_customer ON sub_room.customer_speaker_id = v_customer.speaker_id 
WHERE 
  v_customer.company_id = :companyId
  AND v_customer.name LIKE concat('%', :customerName, '%')
ORDER BY 
  last_message_create_date DESC