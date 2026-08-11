import { NextResponse } from "next/server";
import { canUseDatabase, insertSurveyEvent } from "@/lib/db";
import { telemetrySchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!canUseDatabase()) return NextResponse.json({ ok: false }, { status: 503 });
  const body = await request.json().catch(() => null);
  const parsed = telemetrySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    await insertSurveyEvent(parsed.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("survey_telemetry_failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
