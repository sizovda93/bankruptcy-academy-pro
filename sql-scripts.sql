-- ==========================================
-- ТАБЛИЦЫ ДЛЯ BANKRUPTCY ACADEMY
-- ==========================================

-- 1. ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.5. ТАБЛИЦА НАСТРОЕК САЙТА
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставим начальные значения
INSERT INTO site_settings (setting_key, setting_value) 
VALUES 
  ('hero_background_url', ''),
  ('hero_title', 'Академия Банкротства'),
  ('hero_description', 'Знания, навыки и деловые связи для профессионального роста')
ON CONFLICT (setting_key) DO NOTHING;

-- 2. ТАБЛИЦА МЕДИА (ЗАГРУЖЕННЫЕ КАРТИНКИ)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ТАБЛИЦА КУРСОВ
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  cover_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  duration_hours INTEGER,
  level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ТАБЛИЦА ОТЗЫВОВ
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

-- 5. ТАБЛИЦА РЕГИСТРАЦИЙ НА КУРСЫ
CREATE TABLE IF NOT EXISTS course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, course_id)
);

-- 6. ИНДЕКСЫ ДЛЯ БЫСТРОГО ПОИСКА
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON course_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_course ON course_registrations(course_id);

-- ==========================================
-- RLS ПОЛИТИКИ (Row Level Security)
-- ==========================================

-- Включите RLS для таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;

-- Политики для ПУБЛИЧНОГО доступа (чтение)
CREATE POLICY "Курсы видны всем" ON courses FOR SELECT USING (true);
CREATE POLICY "Опубликованные отзывы видны всем" ON reviews FOR SELECT USING (is_published = true);

-- Политики для АДМИНА (полный доступ) - если у вас есть админ пользователи
-- CREATE POLICY "Админ может управлять медиа" ON media FOR ALL USING (auth.uid() = uploaded_by);
