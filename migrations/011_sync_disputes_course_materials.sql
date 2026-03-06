-- Migration: 011_sync_disputes_course_materials
-- Description: Принудительная синхронизация данных о материалах по оспариванию из site_settings в курс

-- Обновляем курс по оспариванию, переносим все данные из site_settings
UPDATE courses
SET 
  download_form_banner_url = COALESCE(
    download_form_banner_url,
    (SELECT setting_value FROM site_settings WHERE setting_key = 'disputes_materials_banner_url')
  ),
  download_form_file_url = COALESCE(
    download_form_file_url,
    (SELECT setting_value FROM site_settings WHERE setting_key = 'disputes_materials_download_url')
  ),
  download_form_title = COALESCE(
    NULLIF(download_form_title, ''),
    (SELECT setting_value FROM site_settings WHERE setting_key = 'disputes_materials_title'),
    'Получите дополнительные материалы по оспариванию сделок'
  ),
  download_form_description = COALESCE(
    NULLIF(download_form_description, ''),
    (SELECT setting_value FROM site_settings WHERE setting_key = 'disputes_materials_description'),
    'Практические инструменты для работы: чек-листы аудита, матрица риска, шаблоны документов'
  )
WHERE lower(title) LIKE '%оспарив%' OR slug = 'osparivanie-sdelok';

-- Выводим результат для проверки
DO $$
DECLARE
  course_record RECORD;
BEGIN
  SELECT 
    id, 
    title, 
    download_form_title,
    download_form_banner_url IS NOT NULL AS has_banner,
    download_form_file_url IS NOT NULL AS has_file
  INTO course_record
  FROM courses
  WHERE lower(title) LIKE '%оспарив%' OR slug = 'osparivanie-sdelok'
  LIMIT 1;
  
  IF FOUND THEN
    RAISE NOTICE 'Course updated: % (banner: %, file: %)', 
      course_record.title, 
      course_record.has_banner,
      course_record.has_file;
  END IF;
END $$;
