import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

const courseColumns = [
  'title',
  'description',
  'benefits',
  'cover_image_url',
  'price',
  'level',
  'hero_title',
  'hero_subtitle',
  'hero_description',
  'hero_highlights',
  'intro_title',
  'intro_description',
  'learning_results',
  'target_audience',
  'lessons',
  'program_badge',
  'program_features',
  'program_format_title',
  'program_format_description',
  'practice_tasks',
  'selling_points',
  'faq_items',
  'team_order',
  'download_form_banner_url',
  'download_form_file_url',
  'download_form_title',
  'download_form_description',
  'special_offer_title',
  'special_offer_description',
  'special_offer_badge',
  'special_offer_button_text',
  'materials_includes',
  'cta_title',
  'cta_description',
  'cta_button_text',
  'slug',
  'is_published',
  'display_order',
] as const;

type CourseColumn = (typeof courseColumns)[number];

const normalizeCoursePayload = (body: Record<string, any>) => {
  const data: Record<CourseColumn, any> = {
    title: body.title,
    description: body.description || null,
    benefits: body.benefits || null,
    cover_image_url: body.cover_image_url || null,
    price: body.price || 0,
    level: body.level || null,
    hero_title: body.hero_title || null,
    hero_subtitle: body.hero_subtitle || null,
    hero_description: body.hero_description || null,
    hero_highlights: Array.isArray(body.hero_highlights) ? JSON.stringify(body.hero_highlights) : JSON.stringify([]),
    intro_title: body.intro_title || null,
    intro_description: body.intro_description || null,
    learning_results: Array.isArray(body.learning_results) ? JSON.stringify(body.learning_results) : JSON.stringify([]),
    target_audience: Array.isArray(body.target_audience) ? JSON.stringify(body.target_audience) : JSON.stringify([]),
    lessons: Array.isArray(body.lessons) ? JSON.stringify(body.lessons) : JSON.stringify([]),
    program_badge: body.program_badge || null,
    program_features: Array.isArray(body.program_features) ? JSON.stringify(body.program_features) : JSON.stringify([]),
    program_format_title: body.program_format_title || null,
    program_format_description: body.program_format_description || null,
    practice_tasks: Array.isArray(body.practice_tasks) ? JSON.stringify(body.practice_tasks) : JSON.stringify([]),
    selling_points: Array.isArray(body.selling_points) ? JSON.stringify(body.selling_points) : JSON.stringify([]),
    faq_items: Array.isArray(body.faq_items) ? JSON.stringify(body.faq_items) : JSON.stringify([]),
    team_order: Array.isArray(body.team_order) ? JSON.stringify(body.team_order) : JSON.stringify([]),
    download_form_banner_url: body.download_form_banner_url || null,
    download_form_file_url: body.download_form_file_url || null,
    download_form_title: body.download_form_title || null,
    download_form_description: body.download_form_description || null,
    special_offer_title: body.special_offer_title || null,
    special_offer_description: body.special_offer_description || null,
    special_offer_badge: body.special_offer_badge || null,
    special_offer_button_text: body.special_offer_button_text || null,
    materials_includes: Array.isArray(body.materials_includes) ? JSON.stringify(body.materials_includes) : JSON.stringify([]),
    cta_title: body.cta_title || null,
    cta_description: body.cta_description || null,
    cta_button_text: body.cta_button_text || null,
    slug: body.slug || null,
    is_published: body.is_published ?? true,
    display_order: body.display_order || 0,
  };

  return data;
};

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM courses ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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

router.post('/', async (req: Request, res: Response) => {
  try {
    const payload = normalizeCoursePayload(req.body);
    const values = courseColumns.map((column) => payload[column]);
    const placeholders = courseColumns.map((_, index) => `$${index + 1}`).join(', ');

    const result = await query(
      `INSERT INTO courses (${courseColumns.join(', ')})
       VALUES (${placeholders})
       RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const payload = normalizeCoursePayload(req.body);
    const values = courseColumns.map((column) => payload[column]);
    const updates = courseColumns.map((column, index) => `${column}=$${index + 1}`).join(', ');

    const result = await query(
      `UPDATE courses
       SET ${updates}, updated_at=CURRENT_TIMESTAMP
       WHERE id=$${courseColumns.length + 1}
       RETURNING *`,
      [...values, req.params.id]
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
