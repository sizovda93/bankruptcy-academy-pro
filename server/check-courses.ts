import { query } from './src/db.js';

async function checkCourses() {
  try {
    const coursesResult = await query('SELECT id, title FROM courses ORDER BY created_at');
    console.log('Курсы в БД:');
    console.log(JSON.stringify(coursesResult.rows, null, 2));
    
    const casesResult = await query(`
      SELECT sc.id, sc.student_name, sc.course_id, c.title as course_title 
      FROM student_cases sc 
      LEFT JOIN courses c ON sc.course_id = c.id 
      WHERE c.title LIKE '%продаж%' OR c.title LIKE '%продавать%'
      ORDER BY sc.display_order
    `);
    console.log('\nКейсы для курса продаж:');
    console.log(JSON.stringify(casesResult.rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

checkCourses();
