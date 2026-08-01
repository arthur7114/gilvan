CREATE TABLE IF NOT EXISTS survey_responses (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  identity_answers JSONB NOT NULL,
  segment_answers JSONB NOT NULL,
  postcard_company TEXT NOT NULL,
  postcard_reason TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  source JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS campaign_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pixel_id TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO campaign_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
