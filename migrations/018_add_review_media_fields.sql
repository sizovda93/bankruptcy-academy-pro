-- Migration: 018_add_review_media_fields
-- Description: Добавление полей медиа в отзывы (фото и видео отзыва)

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS review_image_url TEXT,
  ADD COLUMN IF NOT EXISTS review_video_url TEXT;

CREATE INDEX IF NOT EXISTS idx_reviews_page_type_page_id ON reviews(page_type, page_id);
