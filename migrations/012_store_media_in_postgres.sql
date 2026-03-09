-- Migration: 012_store_media_in_postgres
-- Description: Перевод медиа на хранение бинарных данных в PostgreSQL

ALTER TABLE media
  ADD COLUMN IF NOT EXISTS storage_kind VARCHAR(20),
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_data BYTEA;

UPDATE media
SET
  storage_kind = CASE
    WHEN file_data IS NOT NULL THEN 'db'
    WHEN COALESCE(storage_kind, '') = '' THEN 'disk'
    ELSE storage_kind
  END,
  storage_path = CASE
    WHEN file_data IS NULL
      AND file_url LIKE '%/uploads/%'
      AND COALESCE(storage_path, '') = ''
    THEN regexp_replace(file_url, '^.*?/uploads/', '')
    ELSE storage_path
  END
WHERE storage_kind IS NULL
   OR COALESCE(storage_kind, '') = ''
   OR storage_path IS NULL;

ALTER TABLE media
  ALTER COLUMN storage_kind SET DEFAULT 'db';

UPDATE media
SET storage_kind = 'db'
WHERE file_data IS NOT NULL
  AND storage_kind <> 'db';

ALTER TABLE media
  ALTER COLUMN storage_kind SET NOT NULL;
