import { query } from './src/db.js';

async function findTeacher() {
  try {
    const result = await query(`
      SELECT id, full_name, position, bio, expertise, experience, photo_url
      FROM teachers
      WHERE lower(full_name) LIKE '%пустельн%' OR lower(full_name) LIKE '%виолетт%'
      ORDER BY full_name
    `);
    console.log('Найденные преподаватели:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

findTeacher();
