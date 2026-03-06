-- Migration: 005_add_page_fields_to_reviews
-- Description: Добавление полей page_type и page_id для привязки отзывов к разным типам страниц

-- Добавляем поле page_type для указания типа страницы (course, webinar, general)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS page_type VARCHAR(50) DEFAULT 'general';

-- Добавляем поле page_id для хранения ID конкретной страницы
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS page_id VARCHAR(255);

-- Создаём индекс для быстрого поиска по типу страницы
CREATE INDEX IF NOT EXISTS idx_reviews_page_type ON reviews(page_type);

-- Создаём индекс для быстрого поиска по ID страницы
CREATE INDEX IF NOT EXISTS idx_reviews_page_id ON reviews(page_id);

-- Мигрируем существующие отзывы с course_id в новую структуру
UPDATE reviews SET page_type = 'course', page_id = course_id::TEXT WHERE course_id IS NOT NULL;

-- Отзывы без курса помечаем как general
UPDATE reviews SET page_type = 'general' WHERE course_id IS NULL;

-- Добавляем комментарий для поля page_type
COMMENT ON COLUMN reviews.page_type IS 'Тип страницы: course (курс), webinar (вебинар), general (общие)';

-- Добавляем комментарий для поля page_id  
COMMENT ON COLUMN reviews.page_id IS 'ID страницы (для вебинаров - строковый идентификатор, для курсов - UUID курса)';
