import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/leads
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leads
router.post('/', async (req: Request, res: Response) => {
  try {
    const { full_name, phone, email, promo_code, consent_policy, consent_offers, source } = req.body;
    const result = await query(
      `INSERT INTO leads (full_name, phone, email, promo_code, consent_policy, consent_offers, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [full_name, phone, email || null, promo_code || null, consent_policy ?? false, consent_offers ?? true, source || 'website']
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
