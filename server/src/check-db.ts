import { query } from './db.js';

const tables = ['site_settings', 'courses', 'teachers', 'reviews', 'leads', 'users', 'media', 'course_registrations', '_migrations'];

for (const t of tables) {
  const r = await query(`SELECT COUNT(*) as count FROM ${t}`);
  console.log(`${t}: ${r.rows[0].count} записей`);
}

// Показать пример данных
const courses = await query('SELECT id, title, price FROM courses ORDER BY created_at');
console.log('\nКурсы:');
console.table(courses.rows);

const teachers = await query('SELECT id, full_name, position FROM teachers ORDER BY display_order');
console.log('\nПреподаватели:');
console.table(teachers.rows);

process.exit(0);
