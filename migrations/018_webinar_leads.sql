-- Migration: 018_webinar_leads
-- Description: Таблица заявок на вебинары (отдельно от обычных leads)

CREATE TABLE IF NOT EXISTS webinar_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  webinar_title VARCHAR(255) DEFAULT 'Бизнес на банкротстве',
  consent_policy BOOLEAN NOT NULL DEFAULT false,
  consent_offers BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webinar_leads_created ON webinar_leads(created_at);
