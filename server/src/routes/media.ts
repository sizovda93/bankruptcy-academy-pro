import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|avif|pdf|doc|docx|rtf|txt)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

const router = Router();

const buildMediaUrl = (_req: Request, mediaId: string) => `/api/media/${mediaId}/content`;

const getDiskPath = (storagePath?: string | null, fileUrl?: string | null) => {
  const resolvedName = storagePath || fileUrl?.split('/').pop();
  return resolvedName ? path.join(uploadDir, resolvedName) : null;
};

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, file_name, file_url, file_type, file_size, uploaded_by, created_at, storage_kind
       FROM media
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/content', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM media WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const file = result.rows[0];
    res.setHeader('Content-Type', file.file_type || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.file_name)}"`);

    if (file.storage_kind === 'db' && file.file_data) {
      res.send(file.file_data);
      return;
    }

    const filePath = getDiskPath(file.storage_path, file.file_url);
    if (!filePath || !fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File payload not found' });
      return;
    }

    res.sendFile(filePath);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const mediaId = randomUUID();
    const fileUrl = buildMediaUrl(req, mediaId);

    const result = await query(
      `INSERT INTO media (id, file_name, file_url, file_type, file_size, uploaded_by, storage_kind, storage_path, file_data)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, file_name, file_url, file_type, file_size, uploaded_by, created_at, storage_kind`,
      [mediaId, req.file.originalname, fileUrl, req.file.mimetype, req.file.size, null, 'db', null, req.file.buffer]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-to-path', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const mediaId = randomUUID();
    const fileUrl = buildMediaUrl(req, mediaId);

    await query(
      `INSERT INTO media (id, file_name, file_url, file_type, file_size, uploaded_by, storage_kind, storage_path, file_data)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [mediaId, req.file.originalname, fileUrl, req.file.mimetype, req.file.size, null, 'db', null, req.file.buffer]
    );

    res.status(201).json({ publicUrl: fileUrl, filename: req.file.originalname, mediaId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const fileResult = await query('SELECT * FROM media WHERE id=$1', [req.params.id]);
    if (fileResult.rows.length === 0) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const file = fileResult.rows[0];
    if (file.storage_kind === 'disk') {
      const filePath = getDiskPath(file.storage_path, file.file_url);
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await query('DELETE FROM media WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
