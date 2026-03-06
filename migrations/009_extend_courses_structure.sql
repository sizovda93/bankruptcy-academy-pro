-- Migration: 009_extend_courses_structure
-- Description: Расширение таблицы courses для хранения полного контента курса

-- Добавляем новые поля для hero-раздела
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT,
ADD COLUMN IF NOT EXISTS hero_highlights JSONB DEFAULT '[]'::jsonb;

-- Добавляем поля для целевой аудитории
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS target_audience JSONB DEFAULT '[]'::jsonb;

-- Добавляем поля для программы обучения (уроки/модули)
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS lessons JSONB DEFAULT '[]'::jsonb;

-- Добавляем поля для ключевых преимуществ
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS selling_points JSONB DEFAULT '[]'::jsonb;

-- Добавляем поля для FAQ
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS faq_items JSONB DEFAULT '[]'::jsonb;

-- Добавляем порядок отображения команды преподавателей
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS team_order JSONB DEFAULT '[]'::jsonb;

-- Добавляем поля для форм скачивания материалов
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS download_form_banner_url TEXT,
ADD COLUMN IF NOT EXISTS download_form_file_url TEXT,
ADD COLUMN IF NOT EXISTS download_form_title TEXT,
ADD COLUMN IF NOT EXISTS download_form_description TEXT;

-- Добавляем slug для URL курса
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Добавляем флаги публикации и сортировки
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_order ON courses(display_order);

-- Комментарии к новым полям
COMMENT ON COLUMN courses.hero_title IS 'Заголовок в hero-секции курса';
COMMENT ON COLUMN courses.hero_description IS 'Описание в hero-секции курса';
COMMENT ON COLUMN courses.hero_highlights IS 'Массив ключевых моментов для hero-секции';
COMMENT ON COLUMN courses.target_audience IS 'Массив строк с описанием целевой аудитории';
COMMENT ON COLUMN courses.lessons IS 'Массив объектов уроков [{title, points: []}]';
COMMENT ON COLUMN courses.selling_points IS 'Массив ключевых преимуществ курса';
COMMENT ON COLUMN courses.faq_items IS 'Массив вопросов и ответов [{question, answer}]';
COMMENT ON COLUMN courses.team_order IS 'Порядок отображения преподавателей ["фамилия1", "фамилия2"]';
COMMENT ON COLUMN courses.download_form_banner_url IS 'URL обложки для формы скачивания материалов';
COMMENT ON COLUMN courses.download_form_file_url IS 'URL файла для скачивания';
COMMENT ON COLUMN courses.download_form_title IS 'Заголовок формы скачивания';
COMMENT ON COLUMN courses.download_form_description IS 'Описание формы скачивания';
COMMENT ON COLUMN courses.slug IS 'URL-идентификатор курса для маршрутизации';
COMMENT ON COLUMN courses.is_published IS 'Опубликован ли курс на сайте';
COMMENT ON COLUMN courses.display_order IS 'Порядок отображения курса в списке';
