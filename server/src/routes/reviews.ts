import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/reviews — все отзывы (опционально ?published=true)
router.get('/', async (req: Request, res: Response) => {
  try {
    const published = req.query.published;
    let sql = 'SELECT * FROM reviews';
    if (published === 'true') {
      sql += ' WHERE is_published = true';
    }
    sql += ' ORDER BY created_at DESC';

    const result = await query(sql);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews
router.post('/', async (req: Request, res: Response) => {
  try {
    const { author_name, rating, comment, author_avatar_url, course_id, is_published } = req.body;
    const result = await query(
      `INSERT INTO reviews (author_name, rating, comment, author_avatar_url, course_id, is_published)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [author_name, rating, comment || null, author_avatar_url || null, course_id || null, is_published ?? false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/reviews/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { author_name, rating, comment, author_avatar_url, course_id, is_published } = req.body;
    const result = await query(
      `UPDATE reviews SET author_name=$1, rating=$2, comment=$3, author_avatar_url=$4, course_id=$5, is_published=$6, updated_at=CURRENT_TIMESTAMP
       WHERE id=$7 RETURNING *`,
      [author_name, rating, comment || null, author_avatar_url || null, course_id || null, is_published ?? false, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reviews/:id/publish
router.patch('/:id/publish', async (req: Request, res: Response) => {
  try {
    const { is_published } = req.body;
    const result = await query(
      'UPDATE reviews SET is_published=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
      [is_published, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM reviews WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
