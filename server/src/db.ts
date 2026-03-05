import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new pg.Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'bankruptcy_academy',
  user: process.env.DATABASE_USER || 'ba_app',
  password: process.env.DATABASE_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connected:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}

export default pool;
