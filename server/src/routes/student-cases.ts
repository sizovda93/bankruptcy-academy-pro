import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/student-cases?published=true&courseId=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const { published, courseId } = req.query;
    const filters: string[] = [];
    const params: any[] = [];

    if (published === 'true') {
      filters.push('is_published = true');
    }

    if (courseId && typeof courseId === 'string') {
      params.push(courseId);
      filters.push(`course_id = $${params.length}`);
    }

    let sql = 'SELECT * FROM student_cases';
    if (filters.length > 0) {
      sql += ` WHERE ${filters.join(' AND ')}`;
    }
    sql += ' ORDER BY display_order ASC NULLS LAST, created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/student-cases
router.post('/', async (req: Request, res: Response) => {
  try {
    const { course_id, student_name, student_role, case_text, result_text, is_published, display_order } = req.body;
    const result = await query(
      `INSERT INTO student_cases (course_id, student_name, student_role, case_text, result_text, is_published, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        course_id || null,
        student_name,
        student_role || null,
        case_text,
        result_text || null,
        is_published ?? true,
        display_order || 0,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/student-cases/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { course_id, student_name, student_role, case_text, result_text, is_published, display_order } = req.body;
    const result = await query(
      `UPDATE student_cases
       SET course_id=$1, student_name=$2, student_role=$3, case_text=$4, result_text=$5, is_published=$6, display_order=$7, updated_at=CURRENT_TIMESTAMP
       WHERE id=$8
       RETURNING *`,
      [
        course_id || null,
        student_name,
        student_role || null,
        case_text,
        result_text || null,
        is_published ?? true,
        display_order || 0,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student case not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/student-cases/:id/publish
router.patch('/:id/publish', async (req: Request, res: Response) => {
  try {
    const { is_published } = req.body;
    const result = await query(
      'UPDATE student_cases SET is_published=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
      [is_published, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student case not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/student-cases/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM student_cases WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student case not found' });
      return;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
