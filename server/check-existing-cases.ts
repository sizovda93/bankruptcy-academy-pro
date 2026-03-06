import { query } from './src/db.js';

async function checkExistingCases() {
  try {
    const result = await query(`
      SELECT sc.id, sc.student_name, sc.course_id, c.title as course_title
      FROM student_cases sc
      LEFT JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_name IN ('Дмитрий В.', 'Елена К.', 'Андрей М.', 'Мария Л.', 'Игорь Т.', 'Светлана Б.')
      ORDER BY sc.student_name
    `);
    console.log('Существующие кейсы с именами из курса продаж:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    const salesCourseId = await query(`
      SELECT id FROM courses WHERE lower(title) LIKE '%продаж%' AND lower(title) NOT LIKE '%оспарив%' ORDER BY created_at LIMIT 1
    `);
    console.log('\nID курса продаж:', salesCourseId.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

checkExistingCases();
