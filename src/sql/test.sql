SELECT 
  ing_room.*, 
  chat_message.id AS last_message_id, 
  chat_message.message AS last_message, 
  chat_message.create_date AS last_message_create_date, 
  v_customer.name AS customer_name 
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
      ) AS customer_speaker_id 
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
          AND message LIKE concat('%', :message, '%')
      ) messasge_search ON r.id = messasge_search.message_search_room_id 
    WHERE 
      company_id = :companyId 
      AND state < 2 
      AND (
        CASE WHEN : memberId is null THEN 1 = 1 ELSE last_member_id = :memberId END
      ) 
      AND date_format(end_date, '%Y-%m-%d') BETWEEN :startDate 
      and :endDate
  ) AS ing_room 
  LEFT OUTER JOIN chat_message ON ing_room.recent_message_id = chat_message.id 
  INNER JOIN v_customer ON ing_room.customer_speaker_id = v_customer.speaker_id 
WHERE 
  v_customer.company_id = :companyId
  AND v_customer.name LIKE concat('%', :customerName, '%')
ORDER BY 
  ing_room.state, 
  last_message_create_date DESC
