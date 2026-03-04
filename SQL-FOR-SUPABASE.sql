-- ==========================================
-- КОПИРУЙ ЭТО ЧАСТЬЮ В SUPABASE SQL EDITOR
-- ==========================================

-- ЧАСТЬ 1: Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ЧАСТЬ 1.5: Таблица настроек сайта
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

-- ЧАСТЬ 2: Таблица медиа (загруженные картинки)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ЧАСТЬ 3: Таблица курсов
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  cover_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For existing databases created before this update
ALTER TABLE courses DROP COLUMN IF EXISTS duration_hours;

-- ЧАСТЬ 4: Таблица отзывов
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

-- ЧАСТЬ 5: Таблица регистраций на курсы
CREATE TABLE IF NOT EXISTS course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, course_id)
);

-- ЧАСТЬ 6: Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON course_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_course ON course_registrations(course_id);

-- ЧАСТЬ 7: Включение RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;

-- ЧАСТЬ 8: Политики безопасности
DROP POLICY IF EXISTS "Курсы видны всем" ON courses;
DROP POLICY IF EXISTS "Опубликованные отзывы видны всем" ON reviews;
DROP POLICY IF EXISTS "Все отзывы видны всем" ON reviews;

CREATE POLICY "Курсы видны всем" ON courses FOR SELECT USING (true);
-- Все отзывы видны (админ панель может видеть все, включая неопубликованные)
CREATE POLICY "Все отзывы видны всем" ON reviews FOR SELECT USING (true);

-- ЧАСТЬ 9: Начальные курсы
INSERT INTO courses (title, description, price, level)
SELECT title, description, price, level
FROM (
VALUES 
  (
    'Юридические аспекты процедуры банкротства',
    'Изучите все нюансы правовой базы банкротства, процедурные аспекты и требования законодательства.',
    14500,
    6,
    'Продвинутый'
  ),
  (
    'Маркетинг в сфере банкротства',
    'Освойте специфику маркетинга в области банкротства, стратегии привлечения клиентов и брендирования.',
    11200,
    4,
    'Средний'
  ),
  (
    'Построение эффективной команды',
    'Научитесь собрать и управлять командой профессионалов в сфере банкротства.',
    8900,
    3,
    'Начинающий'
  ),
  (
    'Обзор практики банкротства',
    'Практический курс по реальным кейсам банкротства и методам их решения.',
    6500,
    2,
    'Начинающий'
  ),
  (
    'Субсидиарная ответственность',
    'Углублённое изучение вопросов субсидиарной и солидарной ответственности.',
    9800,
    3,
    'Средний'
  ),
  (
    'Масштабирование бизнеса в банкротстве',
    'Стратегии развития и масштабирования бизнеса в условиях работы с процедурами банкротства.',
    12000,
    5,
    'Продвинутый'
  )
) AS seed(title, description, price, legacy_duration, level)
ON CONFLICT DO NOTHING;

-- ЧАСТЬ 10: Начальные отзывы (тестовые данные)
INSERT INTO reviews (author_name, rating, comment, author_avatar_url, is_published)
VALUES
  (
    'Иван Петров',
    5,
    'Отличный курс! Очень много полезной практической информации. Преподавателям огромное спасибо!',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    true
  ),
  (
    'Мария Сидорова',
    5,
    'Превосходная программа обучения. После этого курса я чувствую себя гораздо увереннее в своей работе.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    true
  ),
  (
    'Дмитрий Козлов',
    4,
    'Хороший курс, хоть материал и был местами сложным. Стоит того, чтобы потратить время.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
    true
  ),
  (
    'Екатерина Лебедева',
    5,
    'Лучший курс из всех, что я проходил. Рекомендую всем, кто работает в этой сфере!',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ekaterina',
    true
  ),
  (
    'Алексей Морозов',
    4,
    'Качественное содержание, понятное изложение. Немного не хватило живых примеров из практики.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey',
    true
  );

