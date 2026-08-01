import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { canUseDatabase, listResponses } from "@/lib/db";
import { identityQuestions, segments } from "@/lib/types";

function safeCell(value: unknown) {
  let text = String(value ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  if (!canUseDatabase()) {
    return NextResponse.json(
      { error: "Conecte o Neon antes de exportar. Sem banco conectado, não existem respostas persistentes para baixar." },
      { status: 503 },
    );
  }
  const responses = await listResponses();
  const headers = [
    "ID", "Data", "Nome", "WhatsApp", "E-mail", "Bairro",
    ...identityQuestions.map((_, index) => `Identidade ${index + 1}`),
    ...segments.flatMap((segment) => [1, 2, 3].map((index) => `${segment} ${index}`)),
    "Cartão-postal empresarial", "Motivo", "UTM Source", "UTM Medium", "UTM Campaign", "FBCLID",
  ];
  const rows = responses.map((response) => [
    response.id,
    new Date(response.createdAt).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }),
    response.name,
    response.whatsapp,
    response.email,
    response.neighborhood,
    ...response.identityAnswers.map(({ answer }) => answer),
    ...segments.flatMap((segment) => {
      const found = response.segmentAnswers.find((answer) => answer.segment === segment);
      return [0, 1, 2].map((index) => found?.companies[index] ?? "");
    }),
    response.postcardCompany,
    response.postcardReason,
    response.source?.utm_source,
    response.source?.utm_medium,
    response.source?.utm_campaign,
    response.source?.fbclid,
  ]);
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(safeCell).join(";")).join("\r\n")}`;
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="respostas-conecta-cidades-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
