import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../../uploads');

// Обеспечить создание директории загрузок
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

// GET /api/media — все загруженные файлы
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM media ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/media/upload — загрузить файл
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const apiBase = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${apiBase}/uploads/${req.file.filename}`;

    const result = await query(
      `INSERT INTO media (file_name, file_url, file_type, file_size, uploaded_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.file.originalname, fileUrl, req.file.mimetype, req.file.size, null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/media/upload-to-path — загрузить файл с указанным путём (для обложек, аватаров и т.д.)
router.post('/upload-to-path', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const apiBase = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${apiBase}/uploads/${req.file.filename}`;

    res.status(201).json({ publicUrl: fileUrl, filename: req.file.filename });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/media/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Получим информацию о файле
    const fileResult = await query('SELECT * FROM media WHERE id=$1', [req.params.id]);
    if (fileResult.rows.length === 0) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const file = fileResult.rows[0];
    // Удалим файл с диска
    const filename = file.file_url.split('/').pop();
    if (filename) {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Удалим из БД
    await query('DELETE FROM media WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
