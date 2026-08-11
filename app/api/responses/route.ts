import { NextResponse } from "next/server";
import { canUseDatabase, insertResponse } from "@/lib/db";
import { resolveSurveySlug } from "@/lib/campaigns";
import { surveySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.companyWebsite) return NextResponse.json({ ok: true, id: crypto.randomUUID() });

    const surveySlug = resolveSurveySlug(body.surveySlug);
    if (!surveySlug) return NextResponse.json({ error: "Pesquisa não encontrada." }, { status: 400 });

    if (!canUseDatabase()) {
      return NextResponse.json(
        { error: "A pesquisa ainda está em configuração. Tente novamente em alguns minutos." },
        { status: 503 },
      );
    }

    const parsed = surveySchema.safeParse({ ...body, surveySlug });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Revise os campos da pesquisa." },
        { status: 400 },
      );
    }

    const saved = await insertResponse(parsed.data);
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("survey_submission_failed", error);
    return NextResponse.json({ error: "Não foi possível salvar agora. Aguarde um instante e tente novamente." }, { status: 500 });
  }
}
