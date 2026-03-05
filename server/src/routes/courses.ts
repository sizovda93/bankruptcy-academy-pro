import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/courses — все курсы
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM courses ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, benefits, cover_image_url, price, level } = req.body;
    const result = await query(
      `INSERT INTO courses (title, description, benefits, cover_image_url, price, level)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description || null, benefits || null, cover_image_url || null, price || 0, level || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/courses/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, description, benefits, cover_image_url, price, level } = req.body;
    const result = await query(
      `UPDATE courses SET title=$1, description=$2, benefits=$3, cover_image_url=$4, price=$5, level=$6, updated_at=CURRENT_TIMESTAMP
       WHERE id=$7 RETURNING *`,
      [title, description || null, benefits || null, cover_image_url || null, price || 0, level || null, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/courses/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM courses WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
