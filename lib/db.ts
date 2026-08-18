import { neon } from "@neondatabase/serverless";
import type { SurveySlug } from "@/lib/campaigns";
import type { SurveyEventRecord } from "@/lib/telemetry-analytics";
import type { StoredResponse, SurveyPayload } from "@/lib/types";
import type { StoredYahResponse, YahSurveyPayload } from "@/lib/yah-survey";

type MemoryStore = { responses: StoredResponse[]; yahResponses: StoredYahResponse[]; events: SurveyEventRecord[]; pixelId: string };

declare global {
  var conectaMemoryStore: MemoryStore | undefined;
  var conectaSchemaPromise: Promise<void> | undefined;
}

const memory = globalThis.conectaMemoryStore ?? { responses: [], yahResponses: [], events: [], pixelId: "" };
memory.events ??= [];
memory.yahResponses ??= [];
globalThis.conectaMemoryStore = memory;

function sqlClient() {
  return process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
}

async function ensureSchema() {
  const sql = sqlClient();
  if (!sql) return;

  globalThis.conectaSchemaPromise ??= (async () => {
    await sql`
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
      )
    `;
    await sql`ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS survey_slug TEXT`;
    await sql`UPDATE survey_responses SET survey_slug = 'cruz-das-almas' WHERE survey_slug IS NULL OR survey_slug = ''`;
    await sql`ALTER TABLE survey_responses ALTER COLUMN survey_slug SET DEFAULT 'cruz-das-almas'`;
    await sql`ALTER TABLE survey_responses ALTER COLUMN survey_slug SET NOT NULL`;
    await sql`
      CREATE INDEX IF NOT EXISTS survey_responses_slug_created_idx
      ON survey_responses (survey_slug, created_at DESC)
    `;
    await sql`
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
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS survey_events_slug_created_idx
      ON survey_events (survey_slug, occurred_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS survey_events_slug_session_idx
      ON survey_events (survey_slug, session_id, event_name)
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS campaign_settings (
        id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        pixel_id TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`INSERT INTO campaign_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
    await sql`
      CREATE TABLE IF NOT EXISTS yah_survey_responses (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        sesc_card TEXT NOT NULL,
        knows_park TEXT NOT NULL,
        black_card_interest TEXT NOT NULL,
        name TEXT NOT NULL DEFAULT '',
        whatsapp TEXT NOT NULL DEFAULT '',
        neighborhood TEXT NOT NULL DEFAULT '',
        profession TEXT NOT NULL DEFAULT '',
        income_range TEXT NOT NULL DEFAULT '',
        consent BOOLEAN NOT NULL DEFAULT FALSE,
        source JSONB NOT NULL DEFAULT '{}'::jsonb
      )
    `;
    await sql`ALTER TABLE yah_survey_responses ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE yah_survey_responses ADD COLUMN IF NOT EXISTS whatsapp TEXT NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE yah_survey_responses ADD COLUMN IF NOT EXISTS neighborhood TEXT NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE yah_survey_responses ADD COLUMN IF NOT EXISTS profession TEXT NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE yah_survey_responses ADD COLUMN IF NOT EXISTS income_range TEXT NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE yah_survey_responses ADD COLUMN IF NOT EXISTS consent BOOLEAN NOT NULL DEFAULT FALSE`;
    await sql`
      CREATE INDEX IF NOT EXISTS yah_survey_responses_created_idx
      ON yah_survey_responses (created_at DESC)
    `;
  })();

  try {
    await globalThis.conectaSchemaPromise;
  } catch (error) {
    // Uma falha transitória não pode deixar a promise rejeitada em cache:
    // sem isto, toda escrita seguinte nesta instância reusaria a rejeição.
    globalThis.conectaSchemaPromise = undefined;
    throw error;
  }
}

export async function insertYahResponse(payload: YahSurveyPayload): Promise<StoredYahResponse> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const stored: StoredYahResponse = { ...payload, id, createdAt };
  const sql = sqlClient();

  if (!sql) {
    memory.yahResponses.unshift(stored);
    return stored;
  }

  await ensureSchema();
  await sql`
    INSERT INTO yah_survey_responses (
      id, created_at, sesc_card, knows_park, black_card_interest, name, whatsapp,
      neighborhood, profession, income_range, consent, source
    ) VALUES (
      ${id}, ${createdAt}, ${payload.sescCard}, ${payload.knowsPark},
      ${payload.blackCardInterest}, ${payload.name}, ${payload.whatsapp},
      ${payload.neighborhood}, ${payload.profession}, ${payload.incomeRange}, ${payload.consent},
      ${JSON.stringify(payload.source ?? {})}
    )
  `;
  return stored;
}

export async function listYahResponses(): Promise<StoredYahResponse[]> {
  const sql = sqlClient();
  if (!sql) return memory.yahResponses;
  await ensureSchema();
  const rows = await sql`
    SELECT id, created_at, sesc_card, knows_park, black_card_interest, name, whatsapp,
      neighborhood, profession, income_range, consent, source
    FROM yah_survey_responses
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: String(row.id),
    createdAt: new Date(String(row.created_at)).toISOString(),
    sescCard: String(row.sesc_card) as StoredYahResponse["sescCard"],
    knowsPark: String(row.knows_park) as StoredYahResponse["knowsPark"],
    blackCardInterest: String(row.black_card_interest) as StoredYahResponse["blackCardInterest"],
    name: String(row.name ?? ""),
    whatsapp: String(row.whatsapp ?? ""),
    neighborhood: String(row.neighborhood ?? ""),
    profession: String(row.profession ?? ""),
    incomeRange: String(row.income_range ?? "") as StoredYahResponse["incomeRange"],
    consent: Boolean(row.consent),
    source: (row.source ?? {}) as Record<string, string>,
  }));
}

export async function insertResponse(payload: SurveyPayload): Promise<StoredResponse> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const stored: StoredResponse = { ...payload, id, createdAt };
  const sql = sqlClient();

  if (!sql) {
    memory.responses.unshift(stored);
    return stored;
  }

  await ensureSchema();
  await sql`
    INSERT INTO survey_responses (
      id, created_at, survey_slug, name, whatsapp, email, neighborhood,
      identity_answers, segment_answers, postcard_company,
      postcard_reason, consent, source
    ) VALUES (
      ${id}, ${createdAt}, ${payload.surveySlug}, ${payload.name}, ${payload.whatsapp}, ${payload.email},
      ${payload.neighborhood}, ${JSON.stringify(payload.identityAnswers)},
      ${JSON.stringify(payload.segmentAnswers)}, ${payload.postcardCompany},
      ${payload.postcardReason}, ${payload.consent}, ${JSON.stringify(payload.source ?? {})}
    )
  `;

  return stored;
}

export async function listResponses(surveySlug?: SurveySlug): Promise<StoredResponse[]> {
  const sql = sqlClient();
  if (!sql) return surveySlug ? memory.responses.filter((response) => response.surveySlug === surveySlug) : memory.responses;
  await ensureSchema();
  const rows = surveySlug
    ? await sql`
    SELECT id, created_at, survey_slug, name, whatsapp, email, neighborhood,
      identity_answers, segment_answers, postcard_company,
      postcard_reason, consent, source
    FROM survey_responses
    WHERE survey_slug = ${surveySlug}
    ORDER BY created_at DESC
  `
    : await sql`
    SELECT id, created_at, survey_slug, name, whatsapp, email, neighborhood,
      identity_answers, segment_answers, postcard_company,
      postcard_reason, consent, source
    FROM survey_responses
    ORDER BY created_at DESC
  `;

  return rows.map((row) => ({
    id: String(row.id),
    createdAt: new Date(String(row.created_at)).toISOString(),
    surveySlug: String(row.survey_slug) as SurveySlug,
    name: String(row.name),
    whatsapp: String(row.whatsapp),
    email: String(row.email),
    neighborhood: String(row.neighborhood),
    identityAnswers: row.identity_answers as StoredResponse["identityAnswers"],
    segmentAnswers: row.segment_answers as StoredResponse["segmentAnswers"],
    postcardCompany: String(row.postcard_company),
    postcardReason: String(row.postcard_reason),
    consent: Boolean(row.consent),
    source: (row.source ?? {}) as Record<string, string>,
  }));
}

export async function insertSurveyEvent(
  event: Omit<SurveyEventRecord, "occurredAt">,
): Promise<void> {
  const occurredAt = new Date().toISOString();
  const stored: SurveyEventRecord = { ...event, occurredAt };
  const sql = sqlClient();
  if (!sql) {
    memory.events.push(stored);
    return;
  }
  await ensureSchema();
  await sql`
    INSERT INTO survey_events (
      id, occurred_at, survey_slug, session_id, event_name, step,
      field_id, error_code, duration_ms, device_class, source
    ) VALUES (
      ${crypto.randomUUID()}, ${occurredAt}, ${event.surveySlug}, ${event.sessionId},
      ${event.eventName}, ${event.step ?? null}, ${event.fieldId ?? null},
      ${event.errorCode ?? null}, ${event.durationMs ?? null}, ${event.deviceClass ?? null},
      ${JSON.stringify(event.source ?? {})}
    )
  `;
}

export async function listSurveyEvents(surveySlug: SurveySlug): Promise<SurveyEventRecord[]> {
  const sql = sqlClient();
  if (!sql) return memory.events.filter((event) => event.surveySlug === surveySlug);
  await ensureSchema();
  const rows = await sql`
    SELECT occurred_at, survey_slug, session_id, event_name, step,
      field_id, error_code, duration_ms, device_class, source
    FROM survey_events
    WHERE survey_slug = ${surveySlug}
    ORDER BY occurred_at ASC
  `;
  return rows.map((row) => ({
    occurredAt: new Date(String(row.occurred_at)).toISOString(),
    surveySlug: String(row.survey_slug) as SurveySlug,
    sessionId: String(row.session_id),
    eventName: String(row.event_name) as SurveyEventRecord["eventName"],
    step: row.step == null ? null : Number(row.step),
    fieldId: row.field_id == null ? null : (String(row.field_id) as SurveyEventRecord["fieldId"]),
    errorCode: row.error_code == null ? null : (String(row.error_code) as SurveyEventRecord["errorCode"]),
    durationMs: row.duration_ms == null ? null : Number(row.duration_ms),
    deviceClass: row.device_class == null ? null : (String(row.device_class) as SurveyEventRecord["deviceClass"]),
    source: (row.source ?? {}) as SurveyEventRecord["source"],
  }));
}

export async function getPixelId(): Promise<string> {
  const sql = sqlClient();
  if (!sql) return memory.pixelId;
  await ensureSchema();
  const rows = await sql`SELECT pixel_id FROM campaign_settings WHERE id = 1`;
  return rows[0]?.pixel_id ? String(rows[0].pixel_id) : "";
}

export async function updatePixelId(pixelId: string): Promise<void> {
  const sql = sqlClient();
  if (!sql) {
    memory.pixelId = pixelId;
    return;
  }
  await ensureSchema();
  await sql`
    INSERT INTO campaign_settings (id, pixel_id, updated_at)
    VALUES (1, ${pixelId}, NOW())
    ON CONFLICT (id) DO UPDATE SET pixel_id = EXCLUDED.pixel_id, updated_at = NOW()
  `;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function canUseDatabase() {
  return isDatabaseConfigured() || process.env.NODE_ENV !== "production";
}
