import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await query('SELECT name FROM _migrations ORDER BY id');
  return result.rows.map((r: any) => r.name);
}

async function runMigration(name: string, sql: string) {
  console.log(`  Running migration: ${name}`);
  await query(sql);
  await query('INSERT INTO _migrations (name) VALUES ($1)', [name]);
  console.log(`  ✓ ${name} completed`);
}

async function migrate() {
  const isSeed = process.argv.includes('--seed');
  
  console.log('Starting migrations...');
  await ensureMigrationsTable();
  
  const executed = await getExecutedMigrations();
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  let migrationFiles = files;
  if (!isSeed) {
    migrationFiles = files.filter(f => !f.includes('seed'));
  }

  let ranCount = 0;
  for (const file of migrationFiles) {
    const name = path.basename(file, '.sql');
    if (executed.includes(name)) {
      console.log(`  Skipping (already executed): ${name}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await runMigration(name, sql);
    ranCount++;
  }

  if (ranCount === 0) {
    console.log('All migrations are up to date.');
  } else {
    console.log(`\n${ranCount} migration(s) executed successfully.`);
  }

  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
