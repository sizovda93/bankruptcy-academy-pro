import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, full_name, phone } = req.body;
    const result = await query(
      'INSERT INTO users (email, full_name, phone) VALUES ($1,$2,$3) RETURNING *',
      [email, full_name, phone || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM users WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
