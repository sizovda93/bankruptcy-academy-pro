/**
 * Скрипт импорта данных из Supabase в PostgreSQL
 * Заменяет seed-данные реальными данными из Supabase REST API
 */
import { query } from './db.js';

const SUPABASE_URL = 'https://tyepcnakzyfdgryrdeqd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_968O3rZYMHg8vOqyuGz9kw_9PPxV1n9';

async function fetchFromSupabase(table: string) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!resp.ok) throw new Error(`Failed to fetch ${table}: ${resp.statusText}`);
  return resp.json();
}

async function importData() {
  console.log('=== Импорт данных из Supabase ===\n');

  // 1. Очистить seed-данные (в правильном порядке из-за FK)
  console.log('Очистка seed-данных...');
  await query('DELETE FROM course_registrations');
  await query('DELETE FROM reviews');
  await query('DELETE FROM courses');
  await query('DELETE FROM teachers');
  await query('DELETE FROM site_settings');
  console.log('  ✓ Seed-данные удалены\n');

  // 2. Импорт site_settings
  const settings = await fetchFromSupabase('site_settings');
  console.log(`Импорт site_settings (${settings.length})...`);
  for (const s of settings) {
    await query(
      `INSERT INTO site_settings (id, setting_key, setting_value, updated_at) 
       VALUES ($1, $2, $3, $4) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $3, updated_at = $4`,
      [s.id, s.setting_key, s.setting_value, s.updated_at]
    );
  }
  console.log('  ✓ site_settings импортированы\n');

  // 3. Импорт courses
  const courses = await fetchFromSupabase('courses');
  console.log(`Импорт courses (${courses.length})...`);
  for (const c of courses) {
    await query(
      `INSERT INTO courses (id, title, description, benefits, cover_image_url, cover_image_id, price, level, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
      [c.id, c.title, c.description, c.benefits, c.cover_image_url, c.cover_image_id, c.price, c.level, c.created_at, c.updated_at]
    );
  }
  console.log('  ✓ courses импортированы\n');

  // 4. Импорт teachers
  const teachers = await fetchFromSupabase('teachers');
  console.log(`Импорт teachers (${teachers.length})...`);
  for (const t of teachers) {
    await query(
      `INSERT INTO teachers (id, full_name, position, bio, expertise, experience, photo_url, display_order, is_published, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
      [t.id, t.full_name, t.position, t.bio, t.expertise, t.experience, t.photo_url, t.display_order, t.is_published, t.created_at, t.updated_at]
    );
  }
  console.log('  ✓ teachers импортированы\n');

  // 5. Импорт reviews
  const reviews = await fetchFromSupabase('reviews');
  console.log(`Импорт reviews (${reviews.length})...`);
  for (const r of reviews) {
    await query(
      `INSERT INTO reviews (id, user_id, course_id, rating, comment, author_name, author_avatar_url, is_published, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
      [r.id, r.user_id, r.course_id, r.rating, r.comment, r.author_name, r.author_avatar_url, r.is_published, r.created_at, r.updated_at]
    );
  }
  console.log('  ✓ reviews импортированы\n');

  // 6. Импорт leads (если есть)
  const leads = await fetchFromSupabase('leads');
  if (leads.length > 0) {
    console.log(`Импорт leads (${leads.length})...`);
    for (const l of leads) {
      await query(
        `INSERT INTO leads (id, full_name, phone, email, promo_code, consent_policy, consent_offers, source, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [l.id, l.full_name, l.phone, l.email, l.promo_code, l.consent_policy, l.consent_offers, l.source, l.created_at]
      );
    }
    console.log('  ✓ leads импортированы\n');
  } else {
    console.log('Leads: 0 записей, пропускаем\n');
  }

  console.log('=== Импорт завершён успешно! ===');
  
  // Проверка
  const counts = await Promise.all([
    query('SELECT COUNT(*) as c FROM site_settings'),
    query('SELECT COUNT(*) as c FROM courses'),
    query('SELECT COUNT(*) as c FROM teachers'),
    query('SELECT COUNT(*) as c FROM reviews'),
    query('SELECT COUNT(*) as c FROM leads'),
  ]);
  console.log('\nИтого в PostgreSQL:');
  console.log(`  site_settings: ${counts[0].rows[0].c}`);
  console.log(`  courses:       ${counts[1].rows[0].c}`);
  console.log(`  teachers:      ${counts[2].rows[0].c}`);
  console.log(`  reviews:       ${counts[3].rows[0].c}`);
  console.log(`  leads:         ${counts[4].rows[0].c}`);

  process.exit(0);
}

importData().catch((err) => {
  console.error('Ошибка импорта:', err);
  process.exit(1);
});
