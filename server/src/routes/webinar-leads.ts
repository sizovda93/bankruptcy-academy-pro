import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/webinar-leads
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM webinar_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webinar-leads
router.post('/', async (req: Request, res: Response) => {
  try {
    const { full_name, phone, email, webinar_title, consent_policy, consent_offers } = req.body;
    const result = await query(
      `INSERT INTO webinar_leads (full_name, phone, email, webinar_title, consent_policy, consent_offers)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        full_name,
        phone,
        email || null,
        webinar_title || 'Бизнес на банкротстве',
        consent_policy ?? false,
        consent_offers ?? true,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
