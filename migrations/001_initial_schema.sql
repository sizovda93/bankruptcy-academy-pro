-- Migration: 001_initial_schema
-- Description: Создание всех таблиц, индексов и начальных данных из Supabase

-- Расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблица настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблица медиа (загруженные файлы)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Таблица курсов
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  benefits TEXT,
  cover_image_url TEXT,
  cover_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Таблица преподавателей
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  bio TEXT,
  expertise TEXT,
  experience TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  author_name VARCHAR(255) NOT NULL,
  author_avatar_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Таблица регистраций на курсы
CREATE TABLE IF NOT EXISTS course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, course_id)
);

-- 8. Таблица заявок (лидов)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  promo_code VARCHAR(100),
  consent_policy BOOLEAN NOT NULL DEFAULT false,
  consent_offers BOOLEAN NOT NULL DEFAULT true,
  source VARCHAR(100) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Таблица миграций (для отслеживания выполненных миграций)
CREATE TABLE IF NOT EXISTS _migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Индексы
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_teachers_order ON teachers(display_order);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON course_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_course ON course_registrations(course_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
