ALTER TABLE yah_survey_responses
ADD COLUMN IF NOT EXISTS neighborhood TEXT NOT NULL DEFAULT '';

ALTER TABLE yah_survey_responses
ADD COLUMN IF NOT EXISTS profession TEXT NOT NULL DEFAULT '';

ALTER TABLE yah_survey_responses
ADD COLUMN IF NOT EXISTS income_range TEXT NOT NULL DEFAULT '';
