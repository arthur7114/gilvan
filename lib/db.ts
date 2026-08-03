import { neon } from "@neondatabase/serverless";
import type { StoredResponse, SurveyPayload } from "@/lib/types";

type MemoryStore = { responses: StoredResponse[]; pixelId: string };

declare global {
  var conectaMemoryStore: MemoryStore | undefined;
  var conectaSchemaPromise: Promise<void> | undefined;
}

const memory = globalThis.conectaMemoryStore ?? { responses: [], pixelId: "" };
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
    await sql`
      CREATE TABLE IF NOT EXISTS campaign_settings (
        id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        pixel_id TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`INSERT INTO campaign_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
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
      id, created_at, name, whatsapp, email, neighborhood,
      identity_answers, segment_answers, postcard_company,
      postcard_reason, consent, source
    ) VALUES (
      ${id}, ${createdAt}, ${payload.name}, ${payload.whatsapp}, ${payload.email},
      ${payload.neighborhood}, ${JSON.stringify(payload.identityAnswers)},
      ${JSON.stringify(payload.segmentAnswers)}, ${payload.postcardCompany},
      ${payload.postcardReason}, ${payload.consent}, ${JSON.stringify(payload.source ?? {})}
    )
  `;

  return stored;
}

export async function listResponses(): Promise<StoredResponse[]> {
  const sql = sqlClient();
  if (!sql) return memory.responses;
  await ensureSchema();
  const rows = await sql`
    SELECT id, created_at, name, whatsapp, email, neighborhood,
      identity_answers, segment_answers, postcard_company,
      postcard_reason, consent, source
    FROM survey_responses
    ORDER BY created_at DESC
  `;

  return rows.map((row) => ({
    id: String(row.id),
    createdAt: new Date(String(row.created_at)).toISOString(),
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
