import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { canUseDatabase, listYahResponses } from "@/lib/db";
import { yahIncomeRangeLabel } from "@/lib/yah-survey";

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

  const responses = await listYahResponses();
  const headers = [
    "ID", "Data", "Nome", "WhatsApp", "Bairro", "Profissão", "Faixa de renda", "Consentimento", "Tem ou conhece carteirinha Sesc", "Sabia da inauguração do parque",
    "Interesse no Cartão Black", "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content", "UTM Term", "FBCLID",
  ];
  const rows = responses.map((response) => [
    response.id,
    new Date(response.createdAt).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }),
    response.name,
    response.whatsapp,
    response.neighborhood,
    response.profession,
    yahIncomeRangeLabel(response.incomeRange),
    response.consent ? "Sim" : "Não",
    response.sescCard === "yes" ? "Sim" : "Não",
    response.knowsPark === "yes" ? "Sim" : "Não",
    response.blackCardInterest === "yes" ? "Sim, quero saber mais" : "Não no momento",
    response.source?.utm_source,
    response.source?.utm_medium,
    response.source?.utm_campaign,
    response.source?.utm_content,
    response.source?.utm_term,
    response.source?.fbclid,
  ]);
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(safeCell).join(";")).join("\r\n")}`;
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="respostas-yah-aquapark-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
