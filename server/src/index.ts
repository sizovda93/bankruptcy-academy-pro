import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { testConnection } from './db.js';
import coursesRouter from './routes/courses.js';
import teachersRouter from './routes/teachers.js';
import reviewsRouter from './routes/reviews.js';
import leadsRouter from './routes/leads.js';
import usersRouter from './routes/users.js';
import settingsRouter from './routes/settings.js';
import mediaRouter from './routes/media.js';
import studentCasesRouter from './routes/student-cases.js';
import webinarLeadsRouter from './routes/webinar-leads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = parseInt(process.env.API_PORT || '3001');

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Статические файлы (загруженные изображения)
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/courses', coursesRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/users', usersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/student-cases', studentCasesRouter);
app.use('/api/webinar-leads', webinarLeadsRouter);

// Health check
app.get('/api/health', async (_req, res) => {
  const dbOk = await testConnection();
  res.json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  🚀 API Server running at http://localhost:${PORT}`);
  console.log(`  📁 Uploads served from ${uploadDir}`);
  console.log(`  🔗 Health check: http://localhost:${PORT}/api/health\n`);
  testConnection();
});
