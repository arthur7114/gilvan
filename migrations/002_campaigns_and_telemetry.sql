ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS survey_slug TEXT;

UPDATE survey_responses
SET survey_slug = 'cruz-das-almas'
WHERE survey_slug IS NULL OR survey_slug = '';

ALTER TABLE survey_responses
ALTER COLUMN survey_slug SET DEFAULT 'cruz-das-almas';

ALTER TABLE survey_responses
ALTER COLUMN survey_slug SET NOT NULL;

CREATE INDEX IF NOT EXISTS survey_responses_slug_created_idx
ON survey_responses (survey_slug, created_at DESC);

CREATE TABLE IF NOT EXISTS survey_events (
  id TEXT PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  survey_slug TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  step SMALLINT,
  field_id TEXT,
  error_code TEXT,
  duration_ms INTEGER,
  device_class TEXT,
  source JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS survey_events_slug_created_idx
ON survey_events (survey_slug, occurred_at DESC);

CREATE INDEX IF NOT EXISTS survey_events_slug_session_idx
ON survey_events (survey_slug, session_id, event_name);
