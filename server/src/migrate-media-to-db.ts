import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads');

const DB_MEDIA_URL = (id: string) => `/api/media/${id}/content`;

type RefTarget = {
  table: 'courses' | 'teachers' | 'reviews' | 'site_settings';
  idColumn: 'id' | 'setting_key';
  idValue: string;
  valueColumn: string;
  url: string;
};

const getFilenameFromUrl = (url: string) => {
  const match = url.match(/\/uploads\/([^/?#]+)/i);
  return match?.[1] || null;
};

const readFileIfExists = (filename: string) => {
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) return null;
  const stat = fs.statSync(filePath);
  return {
    buffer: fs.readFileSync(filePath),
    filePath,
    fileName: filename,
    size: stat.size,
    ext: path.extname(filename).slice(1).toLowerCase(),
  };
};

const inferMimeType = (filename: string) => {
  const ext = path.extname(filename).slice(1).toLowerCase();
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    avif: 'image/avif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    rtf: 'application/rtf',
    txt: 'text/plain',
  };
  return map[ext] || 'application/octet-stream';
};

async function fetchTargets(): Promise<RefTarget[]> {
  const targets: RefTarget[] = [];

  const mappings = [
    {
      table: 'courses',
      idColumn: 'id',
      columns: ['cover_image_url', 'download_form_banner_url', 'download_form_file_url'],
    },
    {
      table: 'teachers',
      idColumn: 'id',
      columns: ['photo_url'],
    },
    {
      table: 'reviews',
      idColumn: 'id',
      columns: ['author_avatar_url'],
    },
  ] as const;

  for (const mapping of mappings) {
    const rows = await query(`SELECT ${mapping.idColumn}, ${mapping.columns.join(', ')} FROM ${mapping.table}`);
    for (const row of rows.rows) {
      for (const valueColumn of mapping.columns) {
        const url = row[valueColumn];
        if (typeof url === 'string' && url.includes('/uploads/')) {
          targets.push({
            table: mapping.table,
            idColumn: mapping.idColumn,
            idValue: row[mapping.idColumn],
            valueColumn,
            url,
          });
        }
      }
    }
  }

  const settings = await query(`SELECT setting_key, setting_value FROM site_settings WHERE setting_value LIKE '%/uploads/%'`);
  for (const row of settings.rows) {
    targets.push({
      table: 'site_settings',
      idColumn: 'setting_key',
      idValue: row.setting_key,
      valueColumn: 'setting_value',
      url: row.setting_value,
    });
  }

  return targets;
}

async function updateRef(target: RefTarget, nextUrl: string) {
  await query(
    `UPDATE ${target.table} SET ${target.valueColumn}=$1 WHERE ${target.idColumn}=$2`,
    [nextUrl, target.idValue]
  );
}

async function migrateMediaRows() {
  const result = await query(`SELECT * FROM media WHERE file_url LIKE '%/uploads/%' AND COALESCE(storage_kind, 'disk') = 'disk'`);
  let migrated = 0;

  for (const row of result.rows) {
    const filename = row.storage_path || getFilenameFromUrl(row.file_url);
    if (!filename) continue;

    const file = readFileIfExists(filename);
    if (!file) continue;

    await query(
      `UPDATE media
       SET file_url=$1, file_type=$2, file_size=$3, storage_kind='db', storage_path=NULL, file_data=$4
       WHERE id=$5`,
      [DB_MEDIA_URL(row.id), row.file_type || inferMimeType(filename), file.size, file.buffer, row.id]
    );
    migrated++;
  }

  return migrated;
}

async function migrateReferencedUploads() {
  const refs = await fetchTargets();
  const byUrl = new Map<string, RefTarget[]>();

  for (const ref of refs) {
    const bucket = byUrl.get(ref.url) || [];
    bucket.push(ref);
    byUrl.set(ref.url, bucket);
  }

  let created = 0;
  let updatedRefs = 0;

  for (const [url, targets] of byUrl.entries()) {
    const filename = getFilenameFromUrl(url);
    if (!filename) continue;

    const file = readFileIfExists(filename);
    if (!file) continue;

    const mediaId = randomUUID();
    const nextUrl = DB_MEDIA_URL(mediaId);

    await query(
      `INSERT INTO media (id, file_name, file_url, file_type, file_size, uploaded_by, storage_kind, storage_path, file_data)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [mediaId, filename, nextUrl, inferMimeType(filename), file.size, null, 'db', null, file.buffer]
    );

    for (const target of targets) {
      await updateRef(target, nextUrl);
      updatedRefs++;
    }

    created++;
  }

  return { created, updatedRefs };
}

async function main() {
  console.log('Migrating legacy uploads into PostgreSQL...');
  const mediaRowsMigrated = await migrateMediaRows();
  const { created, updatedRefs } = await migrateReferencedUploads();
  console.log(`Media rows migrated: ${mediaRowsMigrated}`);
  console.log(`New media records created from loose references: ${created}`);
  console.log(`References updated: ${updatedRefs}`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Legacy media migration failed:', error);
  process.exit(1);
});
