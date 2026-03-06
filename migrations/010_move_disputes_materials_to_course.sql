-- Migration: 010_move_disputes_materials_to_course
-- Description: Создание курса "Оспаривание сделок" и перенос материалов из site_settings

-- Создаём курс по оспариванию, если его ещё нет
INSERT INTO courses (
  title,
  description,
  price,
  level,
  slug,
  is_published,
  display_order
)
SELECT 
  'Оспаривание сделок в БФЛ',
  'Практический курс по оспариванию сделок должника в процедуре банкротства физических лиц',
  15000,
  'Продвинутый',
  'osparivanie-sdelok',
  true,
  5
WHERE NOT EXISTS (
  SELECT 1 FROM courses 
  WHERE lower(title) LIKE '%оспарива%' OR slug = 'osparivanie-sdelok'
);

-- Переносим данные о материалах из site_settings в курс
UPDATE courses
SET 
  download_form_banner_url = (
    SELECT setting_value 
    FROM site_settings 
    WHERE setting_key = 'disputes_materials_banner_url'
  ),
  download_form_file_url = (
    SELECT setting_value 
    FROM site_settings 
    WHERE setting_key = 'disputes_materials_download_url'
  ),
  download_form_title = COALESCE(
    (SELECT setting_value FROM site_settings WHERE setting_key = 'disputes_materials_title'),
    'Получите дополнительные материалы по оспариванию сделок'
  ),
  download_form_description = COALESCE(
    (SELECT setting_value FROM site_settings WHERE setting_key = 'disputes_materials_description'),
    'Практические шаблоны и чек-листы для работы с оспариванием сделок в процедуре БФЛ'
  )
WHERE lower(title) LIKE '%оспарива%' OR slug = 'osparivanie-sdelok';

-- Комментарий о переносе данных
COMMENT ON COLUMN courses.download_form_banner_url IS 'URL обложки для формы скачивания материалов (перенесено из site_settings)';
