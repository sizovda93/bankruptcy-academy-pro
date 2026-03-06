-- ==========================================
-- РљРћРџРР РЈР™ Р­РўРћ Р§РђРЎРўР¬Р® Р’ SUPABASE SQL EDITOR
-- ==========================================

-- Р§РђРЎРўР¬ 1: РўР°Р±Р»РёС†Р° РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Р§РђРЎРўР¬ 1.5: РўР°Р±Р»РёС†Р° РЅР°СЃС‚СЂРѕРµРє СЃР°Р№С‚Р°
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Р’СЃС‚Р°РІРёРј РЅР°С‡Р°Р»СЊРЅС‹Рµ Р·РЅР°С‡РµРЅРёСЏ
INSERT INTO site_settings (setting_key, setting_value) 
VALUES 
  ('hero_background_url', ''),
  ('hero_title', 'РђРєР°РґРµРјРёСЏ Р‘Р°РЅРєСЂРѕС‚СЃС‚РІР°'),
  ('hero_description', 'Р—РЅР°РЅРёСЏ, РЅР°РІС‹РєРё Рё РґРµР»РѕРІС‹Рµ СЃРІСЏР·Рё РґР»СЏ РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅРѕРіРѕ СЂРѕСЃС‚Р°'),
  ('bfl_book_banner_url', ''),
  ('bfl_book_download_url', ''),
  ('bfl_book_title', 'Получите книгу по банкротству физических лиц 2026'),
  ('bfl_book_description', 'Краткое практическое руководство по изменениям и судебной логике БФЛ')
ON CONFLICT (setting_key) DO NOTHING;

-- Р§РђРЎРўР¬ 2: РўР°Р±Р»РёС†Р° РјРµРґРёР° (Р·Р°РіСЂСѓР¶РµРЅРЅС‹Рµ РєР°СЂС‚РёРЅРєРё)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Р§РђРЎРўР¬ 3: РўР°Р±Р»РёС†Р° РєСѓСЂСЃРѕРІ
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

-- For existing databases created before this update
ALTER TABLE courses DROP COLUMN IF EXISTS duration_hours;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS benefits TEXT;

-- Р§РђРЎРўР¬ 4: РўР°Р±Р»РёС†Р° РѕС‚Р·С‹РІРѕРІ
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

-- For existing databases created before this update
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS expertise TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience TEXT;

-- Р§РђРЎРўР¬ 5: РўР°Р±Р»РёС†Р° РѕС‚Р·С‹РІРѕРІ
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

-- Р§РђРЎРўР¬ 5: РўР°Р±Р»РёС†Р° СЂРµРіРёСЃС‚СЂР°С†РёР№ РЅР° РєСѓСЂСЃС‹
CREATE TABLE IF NOT EXISTS course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, course_id)
);

-- Р§РђРЎРўР¬ 5.5: РўР°Р±Р»РёС†Р° Р·Р°СЏРІРѕРє СЃ С„РѕСЂРјС‹
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

-- Р§РђРЎРўР¬ 6: РРЅРґРµРєСЃС‹ РґР»СЏ Р±С‹СЃС‚СЂРѕРіРѕ РїРѕРёСЃРєР°
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_teachers_order ON teachers(display_order);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON course_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_course ON course_registrations(course_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- Р§РђРЎРўР¬ 7: Р’РєР»СЋС‡РµРЅРёРµ RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Р§РђРЎРўР¬ 8: РџРѕР»РёС‚РёРєРё Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё
DROP POLICY IF EXISTS "РљСѓСЂСЃС‹ РІРёРґРЅС‹ РІСЃРµРј" ON courses;
DROP POLICY IF EXISTS "РџСЂРµРїРѕРґР°РІР°С‚РµР»Рё РІРёРґРЅС‹ РІСЃРµРј" ON teachers;
DROP POLICY IF EXISTS "РћРїСѓР±Р»РёРєРѕРІР°РЅРЅС‹Рµ РѕС‚Р·С‹РІС‹ РІРёРґРЅС‹ РІСЃРµРј" ON reviews;
DROP POLICY IF EXISTS "Р’СЃРµ РѕС‚Р·С‹РІС‹ РІРёРґРЅС‹ РІСЃРµРј" ON reviews;

CREATE POLICY "РљСѓСЂСЃС‹ РІРёРґРЅС‹ РІСЃРµРј" ON courses FOR SELECT USING (true);
CREATE POLICY "РџСЂРµРїРѕРґР°РІР°С‚РµР»Рё РІРёРґРЅС‹ РІСЃРµРј" ON teachers FOR SELECT USING (is_published = true);
-- Р’СЃРµ РѕС‚Р·С‹РІС‹ РІРёРґРЅС‹ (Р°РґРјРёРЅ РїР°РЅРµР»СЊ РјРѕР¶РµС‚ РІРёРґРµС‚СЊ РІСЃРµ, РІРєР»СЋС‡Р°СЏ РЅРµРѕРїСѓР±Р»РёРєРѕРІР°РЅРЅС‹Рµ)
CREATE POLICY "Р’СЃРµ РѕС‚Р·С‹РІС‹ РІРёРґРЅС‹ РІСЃРµРј" ON reviews FOR SELECT USING (true);

-- Р§РђРЎРўР¬ 8.5: РџРѕР»РёС‚РёРєРё Р·Р°РїРёСЃРё РґР»СЏ Р°РґРјРёРЅ-РїР°РЅРµР»Рё (РєР»РёРµРЅС‚СЃРєРѕРµ Р°РґРјРёРЅ-РїСЂРёР»РѕР¶РµРЅРёРµ)
-- Р’РђР–РќРћ: СЌС‚Рѕ РѕС‚РєСЂС‹РІР°РµС‚ Р·Р°РїРёСЃСЊ СЃ РїСѓР±Р»РёС‡РЅРѕРіРѕ РєР»СЋС‡Р°. Р”Р»СЏ production Р»СѓС‡С€Рµ РІС‹РЅРµСЃС‚Рё Р°РґРјРёРЅРєСѓ РЅР° СЃРµСЂРІРµСЂ.
DROP POLICY IF EXISTS "РљСѓСЂСЃС‹ РјРѕР¶РЅРѕ РёР·РјРµРЅСЏС‚СЊ" ON courses;
DROP POLICY IF EXISTS "РћС‚Р·С‹РІС‹ РјРѕР¶РЅРѕ РёР·РјРµРЅСЏС‚СЊ" ON reviews;
DROP POLICY IF EXISTS "РџСЂРµРїРѕРґР°РІР°С‚РµР»РµР№ РјРѕР¶РЅРѕ РёР·РјРµРЅСЏС‚СЊ" ON teachers;
DROP POLICY IF EXISTS "Р—Р°СЏРІРєРё РјРѕР¶РЅРѕ РѕС‚РїСЂР°РІР»СЏС‚СЊ" ON leads;

CREATE POLICY "РљСѓСЂСЃС‹ РјРѕР¶РЅРѕ РёР·РјРµРЅСЏС‚СЊ" ON courses
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "РћС‚Р·С‹РІС‹ РјРѕР¶РЅРѕ РёР·РјРµРЅСЏС‚СЊ" ON reviews
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "РџСЂРµРїРѕРґР°РІР°С‚РµР»РµР№ РјРѕР¶РЅРѕ РёР·РјРµРЅСЏС‚СЊ" ON teachers
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Р—Р°СЏРІРєРё РјРѕР¶РЅРѕ РѕС‚РїСЂР°РІР»СЏС‚СЊ" ON leads
FOR INSERT WITH CHECK (true);

-- Р§РђРЎРўР¬ 9: РќР°С‡Р°Р»СЊРЅС‹Рµ РєСѓСЂСЃС‹
INSERT INTO courses (title, description, price, level)
SELECT title, description, price, level
FROM (
VALUES 
  (
    'Р®СЂРёРґРёС‡РµСЃРєРёРµ Р°СЃРїРµРєС‚С‹ РїСЂРѕС†РµРґСѓСЂС‹ Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°',
    'РР·СѓС‡РёС‚Рµ РІСЃРµ РЅСЋР°РЅСЃС‹ РїСЂР°РІРѕРІРѕР№ Р±Р°Р·С‹ Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°, РїСЂРѕС†РµРґСѓСЂРЅС‹Рµ Р°СЃРїРµРєС‚С‹ Рё С‚СЂРµР±РѕРІР°РЅРёСЏ Р·Р°РєРѕРЅРѕРґР°С‚РµР»СЊСЃС‚РІР°.',
    14500,
    6,
    'РџСЂРѕРґРІРёРЅСѓС‚С‹Р№'
  ),
  (
    'РњР°СЂРєРµС‚РёРЅРі РІ СЃС„РµСЂРµ Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°',
    'РћСЃРІРѕР№С‚Рµ СЃРїРµС†РёС„РёРєСѓ РјР°СЂРєРµС‚РёРЅРіР° РІ РѕР±Р»Р°СЃС‚Рё Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°, СЃС‚СЂР°С‚РµРіРёРё РїСЂРёРІР»РµС‡РµРЅРёСЏ РєР»РёРµРЅС‚РѕРІ Рё Р±СЂРµРЅРґРёСЂРѕРІР°РЅРёСЏ.',
    11200,
    4,
    'РЎСЂРµРґРЅРёР№'
  ),
  (
    'РџРѕСЃС‚СЂРѕРµРЅРёРµ СЌС„С„РµРєС‚РёРІРЅРѕР№ РєРѕРјР°РЅРґС‹',
    'РќР°СѓС‡РёС‚РµСЃСЊ СЃРѕР±СЂР°С‚СЊ Рё СѓРїСЂР°РІР»СЏС‚СЊ РєРѕРјР°РЅРґРѕР№ РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»РѕРІ РІ СЃС„РµСЂРµ Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°.',
    8900,
    3,
    'РќР°С‡РёРЅР°СЋС‰РёР№'
  ),
  (
    'РћР±Р·РѕСЂ РїСЂР°РєС‚РёРєРё Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°',
    'РџСЂР°РєС‚РёС‡РµСЃРєРёР№ РєСѓСЂСЃ РїРѕ СЂРµР°Р»СЊРЅС‹Рј РєРµР№СЃР°Рј Р±Р°РЅРєСЂРѕС‚СЃС‚РІР° Рё РјРµС‚РѕРґР°Рј РёС… СЂРµС€РµРЅРёСЏ.',
    6500,
    2,
    'РќР°С‡РёРЅР°СЋС‰РёР№'
  ),
  (
    'РЎСѓР±СЃРёРґРёР°СЂРЅР°СЏ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚СЊ',
    'РЈРіР»СѓР±Р»С‘РЅРЅРѕРµ РёР·СѓС‡РµРЅРёРµ РІРѕРїСЂРѕСЃРѕРІ СЃСѓР±СЃРёРґРёР°СЂРЅРѕР№ Рё СЃРѕР»РёРґР°СЂРЅРѕР№ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚Рё.',
    9800,
    3,
    'РЎСЂРµРґРЅРёР№'
  ),
  (
    'РњР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёРµ Р±РёР·РЅРµСЃР° РІ Р±Р°РЅРєСЂРѕС‚СЃС‚РІРµ',
    'РЎС‚СЂР°С‚РµРіРёРё СЂР°Р·РІРёС‚РёСЏ Рё РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёСЏ Р±РёР·РЅРµСЃР° РІ СѓСЃР»РѕРІРёСЏС… СЂР°Р±РѕС‚С‹ СЃ РїСЂРѕС†РµРґСѓСЂР°РјРё Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°.',
    12000,
    5,
    'РџСЂРѕРґРІРёРЅСѓС‚С‹Р№'
  )
) AS seed(title, description, price, legacy_duration, level)
ON CONFLICT DO NOTHING;

-- Р§РђРЎРўР¬ 9.5: РќР°С‡Р°Р»СЊРЅС‹Рµ РїСЂРµРїРѕРґР°РІР°С‚РµР»Рё
INSERT INTO teachers (full_name, position, bio, photo_url, display_order, is_published)
SELECT seed.full_name, seed.position, seed.bio, seed.photo_url, seed.display_order, seed.is_published
FROM (
  VALUES
    (
      'РђР»РµРєСЃР°РЅРґСЂ Р’РѕСЂРѕРЅРѕРІ',
      'РђРґРІРѕРєР°С‚, РїР°СЂС‚РЅРµСЂ РїСЂР°РєС‚РёРєРё Р±Р°РЅРєСЂРѕС‚СЃС‚РІР°',
      '15+ Р»РµС‚ РІ СЃРѕРїСЂРѕРІРѕР¶РґРµРЅРёРё Р±Р°РЅРєСЂРѕС‚РЅС‹С… РїСЂРѕС†РµРґСѓСЂ Рё СЃСѓРґРµР±РЅС‹С… СЃРїРѕСЂРѕРІ.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Voronov',
      1,
      true
    ),
    (
      'Р•РєР°С‚РµСЂРёРЅР° Р‘РµР»РѕРІР°',
      'РђСЂР±РёС‚СЂР°Р¶РЅС‹Р№ СЋСЂРёСЃС‚',
      'РЎРїРµС†РёР°Р»РёР·Р°С†РёСЏ: РѕСЃРїР°СЂРёРІР°РЅРёРµ СЃРґРµР»РѕРє Рё Р·Р°С‰РёС‚Р° РєРѕРЅС‚СЂРѕР»РёСЂСѓСЋС‰РёС… Р»РёС†.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Belova',
      2,
      true
    ),
    (
      'РР»СЊСЏ РЎРјРёСЂРЅРѕРІ',
      'Р СѓРєРѕРІРѕРґРёС‚РµР»СЊ РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј',
      'РџСЂР°РєС‚РёРєСѓСЋС‰РёР№ СЋСЂРёСЃС‚ Рё РјРµС‚РѕРґРѕР»РѕРі РїСЂРѕРіСЂР°РјРј РґР»СЏ senior-СЃРїРµС†РёР°Р»РёСЃС‚РѕРІ.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Smirnov',
      3,
      true
    ),
    (
      'РћР»СЊРіР° Р РѕРјР°РЅРѕРІР°',
      'РђРґРІРѕРєР°С‚ РїРѕ РєРѕСЂРїРѕСЂР°С‚РёРІРЅС‹Рј СЃРїРѕСЂР°Рј',
      'РЎРѕРїСЂРѕРІРѕР¶РґР°РµС‚ СЃР»РѕР¶РЅС‹Рµ РїСЂРѕРµРєС‚С‹ РїРѕ СЂРµСЃС‚СЂСѓРєС‚СѓСЂРёР·Р°С†РёРё Р·Р°РґРѕР»Р¶РµРЅРЅРѕСЃС‚Рё Р±РёР·РЅРµСЃР°.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Romanova',
      4,
      true
    )
) AS seed(full_name, position, bio, photo_url, display_order, is_published)
WHERE NOT EXISTS (
  SELECT 1 FROM teachers t WHERE t.full_name = seed.full_name
);

-- Р§РђРЎРўР¬ 10: РќР°С‡Р°Р»СЊРЅС‹Рµ РѕС‚Р·С‹РІС‹ (С‚РµСЃС‚РѕРІС‹Рµ РґР°РЅРЅС‹Рµ)
INSERT INTO reviews (author_name, rating, comment, author_avatar_url, is_published)
VALUES
  (
    'РРІР°РЅ РџРµС‚СЂРѕРІ',
    5,
    'РћС‚Р»РёС‡РЅС‹Р№ РєСѓСЂСЃ! РћС‡РµРЅСЊ РјРЅРѕРіРѕ РїРѕР»РµР·РЅРѕР№ РїСЂР°РєС‚РёС‡РµСЃРєРѕР№ РёРЅС„РѕСЂРјР°С†РёРё. РџСЂРµРїРѕРґР°РІР°С‚РµР»СЏРј РѕРіСЂРѕРјРЅРѕРµ СЃРїР°СЃРёР±Рѕ!',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    true
  ),
  (
    'РњР°СЂРёСЏ РЎРёРґРѕСЂРѕРІР°',
    5,
    'РџСЂРµРІРѕСЃС…РѕРґРЅР°СЏ РїСЂРѕРіСЂР°РјРјР° РѕР±СѓС‡РµРЅРёСЏ. РџРѕСЃР»Рµ СЌС‚РѕРіРѕ РєСѓСЂСЃР° СЏ С‡СѓРІСЃС‚РІСѓСЋ СЃРµР±СЏ РіРѕСЂР°Р·РґРѕ СѓРІРµСЂРµРЅРЅРµРµ РІ СЃРІРѕРµР№ СЂР°Р±РѕС‚Рµ.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    true
  ),
  (
    'Р”РјРёС‚СЂРёР№ РљРѕР·Р»РѕРІ',
    4,
    'РҐРѕСЂРѕС€РёР№ РєСѓСЂСЃ, С…РѕС‚СЊ РјР°С‚РµСЂРёР°Р» Рё Р±С‹Р» РјРµСЃС‚Р°РјРё СЃР»РѕР¶РЅС‹Рј. РЎС‚РѕРёС‚ С‚РѕРіРѕ, С‡С‚РѕР±С‹ РїРѕС‚СЂР°С‚РёС‚СЊ РІСЂРµРјСЏ.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
    true
  ),
  (
    'Р•РєР°С‚РµСЂРёРЅР° Р›РµР±РµРґРµРІР°',
    5,
    'Р›СѓС‡С€РёР№ РєСѓСЂСЃ РёР· РІСЃРµС…, С‡С‚Рѕ СЏ РїСЂРѕС…РѕРґРёР». Р РµРєРѕРјРµРЅРґСѓСЋ РІСЃРµРј, РєС‚Рѕ СЂР°Р±РѕС‚Р°РµС‚ РІ СЌС‚РѕР№ СЃС„РµСЂРµ!',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ekaterina',
    true
  ),
  (
    'РђР»РµРєСЃРµР№ РњРѕСЂРѕР·РѕРІ',
    4,
    'РљР°С‡РµСЃС‚РІРµРЅРЅРѕРµ СЃРѕРґРµСЂР¶Р°РЅРёРµ, РїРѕРЅСЏС‚РЅРѕРµ РёР·Р»РѕР¶РµРЅРёРµ. РќРµРјРЅРѕРіРѕ РЅРµ С…РІР°С‚РёР»Рѕ Р¶РёРІС‹С… РїСЂРёРјРµСЂРѕРІ РёР· РїСЂР°РєС‚РёРєРё.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey',
    true
  );


-- Leads read policy for admin panel
DROP POLICY IF EXISTS leads_select_all ON leads;
CREATE POLICY leads_select_all ON leads FOR SELECT USING (true);

-- Student cases (кейсы студентов для страниц курсов)
CREATE TABLE IF NOT EXISTS student_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_role VARCHAR(255),
  case_text TEXT NOT NULL,
  result_text TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_cases_course ON student_cases(course_id);
CREATE INDEX IF NOT EXISTS idx_student_cases_published ON student_cases(is_published);
CREATE INDEX IF NOT EXISTS idx_student_cases_order ON student_cases(display_order);

ALTER TABLE student_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Кейсы видны всем" ON student_cases;
DROP POLICY IF EXISTS "Кейсы можно изменять" ON student_cases;

CREATE POLICY "Кейсы видны всем" ON student_cases
FOR SELECT USING (is_published = true);

CREATE POLICY "Кейсы можно изменять" ON student_cases
FOR ALL USING (true) WITH CHECK (true);

INSERT INTO student_cases (course_id, student_name, student_role, case_text, result_text, is_published, display_order)
SELECT
  c.id,
  s.student_name,
  s.student_role,
  s.case_text,
  s.result_text,
  true,
  s.display_order
FROM (
  VALUES
    (
      'Александр М.',
      'Выпускник курса',
      'После внедрения карты аудита и чек-листов сократил срок подготовки дела к подаче в суд с 5 дней до 2 дней. Снизил количество процессуальных доработок и повысил предсказуемость результата по делам БФЛ.',
      'Результат: рост конверсии в договор на 27%',
      1
    ),
    (
      'Ольга К.',
      'Руководитель практики',
      'Перестроила работу команды по модульной схеме курса: отдельно аудит входа, отдельно сбор доказательств и сопровождение процедуры. Команда начала работать по единому стандарту, без просадок в качестве.',
      'Результат: +35% к производительности команды',
      2
    ),
    (
      'Петр Н.',
      'Юрист по БФЛ',
      'Применил из курса модель взаимодействия с АУ и стандартизировал коммуникацию с доверителями. Это позволило закрыть частые возражения до суда и улучшить клиентский опыт без увеличения нагрузки.',
      'Результат: снижение отказов клиентов на 22%',
      3
    ),
    (
      'Мария Л.',
      'Старший юрист',
      'После блока по торгам и оспариванию сделок улучшила стратегию по сложным делам с имуществом. Перешла от реактивной тактики к планированию рисков на входе в процедуру.',
      'Результат: +18% успешных кейсов в сложных делах',
      4
    )
) AS s(student_name, student_role, case_text, result_text, display_order)
JOIN courses c ON lower(c.title) LIKE '%юридические аспекты%'
WHERE NOT EXISTS (
  SELECT 1
  FROM student_cases sc
  WHERE sc.course_id = c.id
    AND sc.student_name = s.student_name
);
