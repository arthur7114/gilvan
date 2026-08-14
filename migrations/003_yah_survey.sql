CREATE TABLE IF NOT EXISTS yah_survey_responses (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sesc_card TEXT NOT NULL,
  knows_park TEXT NOT NULL,
  black_card_interest TEXT NOT NULL,
  source JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS yah_survey_responses_created_idx
ON yah_survey_responses (created_at DESC);
