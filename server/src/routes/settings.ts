import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM site_settings');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings/:key
router.put('/:key', async (req: Request, res: Response) => {
  try {
    const { setting_value } = req.body;
    const result = await query(
      'UPDATE site_settings SET setting_value=$1, updated_at=CURRENT_TIMESTAMP WHERE setting_key=$2 RETURNING *',
      [setting_value, req.params.key]
    );
    if (result.rows.length === 0) {
      // Upsert — создать если не существует
      const insertResult = await query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES ($1, $2) RETURNING *',
        [req.params.key, setting_value]
      );
      res.json(insertResult.rows[0]);
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
