import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/reviews — все отзывы (опционально ?published=true, ?page_type=xxx, ?page_id=xxx)
router.get('/', async (req: Request, res: Response) => {
  try {
    const published = req.query.published;
    const pageType = req.query.page_type;
    const pageId = req.query.page_id;
    
    let sql = 'SELECT * FROM reviews';
    const conditions: string[] = [];
    
    if (published === 'true') {
      conditions.push('is_published = true');
    }
    if (pageType) {
      conditions.push(`page_type = '${pageType}'`);
    }
    if (pageId) {
      conditions.push(`page_id = '${pageId}'`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
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
    const { author_name, rating, comment, author_avatar_url, course_id, is_published, page_type, page_id } = req.body;
    const result = await query(
      `INSERT INTO reviews (author_name, rating, comment, author_avatar_url, course_id, is_published, page_type, page_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [author_name, rating, comment || null, author_avatar_url || null, course_id || null, is_published ?? false, page_type || 'general', page_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/reviews/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { author_name, rating, comment, author_avatar_url, course_id, is_published, page_type, page_id } = req.body;
    const result = await query(
      `UPDATE reviews SET author_name=$1, rating=$2, comment=$3, author_avatar_url=$4, course_id=$5, is_published=$6, page_type=$7, page_id=$8, updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
      [author_name, rating, comment || null, author_avatar_url || null, course_id || null, is_published ?? false, page_type || 'general', page_id || null, req.params.id]
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
