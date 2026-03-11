-- Migration: 019_add_media_fields_to_student_cases
-- Description: Добавление фото и видео в кейсы студентов

ALTER TABLE student_cases
  ADD COLUMN IF NOT EXISTS case_image_url TEXT,
  ADD COLUMN IF NOT EXISTS case_video_url TEXT;
