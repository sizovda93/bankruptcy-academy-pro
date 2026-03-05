-- Migration: 002_seed_data
-- Description: Начальные данные (настройки, курсы, преподаватели, отзывы)

-- Настройки сайта
INSERT INTO site_settings (setting_key, setting_value) 
VALUES 
  ('hero_background_url', ''),
  ('hero_title', 'Академия Банкротства'),
  ('hero_description', 'Знания, навыки и деловые связи для профессионального роста')
ON CONFLICT (setting_key) DO NOTHING;

-- Начальные курсы
INSERT INTO courses (title, description, price, level)
VALUES 
  (
    'Юридические аспекты процедуры банкротства',
    'Изучите все нюансы правовой базы банкротства, процедурные аспекты и требования законодательства.',
    14500,
    'Продвинутый'
  ),
  (
    'Маркетинг в сфере банкротства',
    'Освойте специфику маркетинга в области банкротства, стратегии привлечения клиентов и брендирования.',
    11200,
    'Средний'
  ),
  (
    'Построение эффективной команды',
    'Научитесь собрать и управлять командой профессионалов в сфере банкротства.',
    8900,
    'Начинающий'
  ),
  (
    'Обзор практики банкротства',
    'Практический курс по реальным кейсам банкротства и методам их решения.',
    6500,
    'Начинающий'
  ),
  (
    'Субсидиарная ответственность',
    'Углублённое изучение вопросов субсидиарной и солидарной ответственности.',
    9800,
    'Средний'
  ),
  (
    'Масштабирование бизнеса в банкротстве',
    'Стратегии развития и масштабирования бизнеса в условиях работы с процедурами банкротства.',
    12000,
    'Продвинутый'
  )
ON CONFLICT DO NOTHING;

-- Начальные преподаватели
INSERT INTO teachers (full_name, position, bio, photo_url, display_order, is_published)
SELECT seed.full_name, seed.position, seed.bio, seed.photo_url, seed.display_order, seed.is_published
FROM (
  VALUES
    (
      'Александр Воронов',
      'Адвокат, партнер практики банкротства',
      '15+ лет в сопровождении банкротных процедур и судебных споров.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Voronov',
      1,
      true
    ),
    (
      'Екатерина Белова',
      'Арбитражный юрист',
      'Специализация: оспаривание сделок и защита контролирующих лиц.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Belova',
      2,
      true
    ),
    (
      'Илья Смирнов',
      'Руководитель образовательных программ',
      'Практикующий юрист и методолог программ для senior-специалистов.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Smirnov',
      3,
      true
    ),
    (
      'Ольга Романова',
      'Адвокат по корпоративным спорам',
      'Сопровождает сложные проекты по реструктуризации задолженности бизнеса.',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Romanova',
      4,
      true
    )
) AS seed(full_name, position, bio, photo_url, display_order, is_published)
WHERE NOT EXISTS (
  SELECT 1 FROM teachers t WHERE t.full_name = seed.full_name
);

-- Начальные отзывы
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
    'Хороший курс, хотя материал и был местами сложным. Стоит того, чтобы потратить время.',
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
  )
ON CONFLICT DO NOTHING;
