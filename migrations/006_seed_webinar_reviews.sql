-- Migration: 006_seed_webinar_reviews
-- Description: Добавление примеров отзывов для вебинара "Как в кризис построить устойчивый бизнес на БФЛ"

-- Seed первый отзыв
INSERT INTO reviews (author_name, rating, comment, author_avatar_url, is_published, page_type, page_id, created_at, updated_at)
VALUES (
  'Дмитрий Ковалев',
  5,
  'Отличный вебинар! Узнал много нового о построении бизнеса на банкротстве. Особенно полезными оказались блоки про бизнес-модели и масштабирование. Теперь есть четкий план действий на ближайшие 30 дней.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
  true,
  'webinar',
  'bankruptcy-business',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Seed второй отзыв
INSERT INTO reviews (author_name, rating, comment, author_avatar_url, is_published, page_type, page_id, created_at, updated_at)
VALUES (
  'Елена Смирнова',
  5,
  'Вебинар превзошел ожидания. Очень понравился подход с реальными кейсами и практическими примерами. Наконец-то поняла, как можно монетизировать знания в области банкротства физлиц. Спасибо за структурированную подачу материала!',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  true,
  'webinar',
  'bankruptcy-business',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Seed третий отзыв
INSERT INTO reviews (author_name, rating, comment, author_avatar_url, is_published, page_type, page_id, created_at, updated_at)
VALUES (
  'Андрей Волков',
  4,
  'Полезный контент для тех, кто хочет войти в нишу банкротства. Понравились блоки про источники клиентов и ценообразование. Единственный минус — хотелось бы больше времени на вопросы, но это компенсировалось материалами после вебинара.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Andrey',
  true,
  'webinar',
  'bankruptcy-business',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;
