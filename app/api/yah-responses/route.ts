import { NextResponse } from "next/server";
import { canUseDatabase, insertYahResponse } from "@/lib/db";
import { yahSurveySchema } from "@/lib/yah-survey";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.companyWebsite) return NextResponse.json({ ok: true, id: crypto.randomUUID() });

    if (!canUseDatabase()) {
      return NextResponse.json(
        { error: "A pesquisa ainda está em configuração. Tente novamente em alguns minutos." },
        { status: 503 },
      );
    }

    const parsed = yahSurveySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Responda às três perguntas, informe seu contato e aceite o uso dos dados." },
        { status: 400 },
      );
    }

    const saved = await insertYahResponse(parsed.data);
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("yah_survey_submission_failed", error);
    return NextResponse.json(
      { error: "Não foi possível salvar agora. Aguarde um instante e tente novamente." },
      { status: 500 },
    );
  }
}
