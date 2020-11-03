SELECT *
  FROM keyword2
  WHERE id IN (SELECT keyword_id
                  FROM template_keyword
                WHERE template_id = :templateId)