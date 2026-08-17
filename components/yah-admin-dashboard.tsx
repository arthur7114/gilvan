import { BarChart3, Database, Download, LogOut, Megaphone, MousePointerClick, Settings2, Users } from "lucide-react";
import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { yahQuestions, type YahDashboardData } from "@/lib/yah-survey";

function answerLabel(questionId: (typeof yahQuestions)[number]["id"], value: string) {
  return yahQuestions.find((question) => question.id === questionId)?.options.find((option) => option.value === value)?.label ?? value;
}
export function YahAdminDashboard({ data, databaseConfigured }: { data: YahDashboardData; databaseConfigured: boolean }) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/yah">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span><strong>conecta</strong><small>CIDADES</small></span>
        </Link>
        <nav aria-label="Navegação do painel">
          <a className="active" href="#visao-geral"><BarChart3 size={18} /> Visão geral</a>
          <a href="#perguntas"><MousePointerClick size={18} /> Perguntas</a>
          <a href="#respostas"><Users size={18} /> Respostas</a>
          <a href="/admin?survey=tutoia"><Settings2 size={18} /> Painel principal</a>
        </nav>
        <form action="/api/admin/logout" method="post"><button><LogOut size={17} /> Sair</button></form>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div><h1>Painel da pesquisa</h1><p>YAH Aquapark · Pesquisa Rápida</p></div>
          {databaseConfigured ? (
            <a className="export-button" href="/api/admin/export-yah"><Download size={18} /> Exportar CSV</a>
          ) : (
            <button className="export-button" disabled title="Conecte o Neon para liberar a exportação."><Download size={18} /> Exportar CSV</button>
          )}
        </header>

        <nav className="campaign-switcher" aria-label="Selecionar pesquisa">
          <span>Resultados de</span>
          {Object.values(campaigns).map((campaign) => (
            <Link key={campaign.slug} href={`/admin?survey=${campaign.slug}`}>
              <strong>{campaign.city}</strong><small>{campaign.state}</small>
            </Link>
          ))}
          <Link className="active" href="/admin/yah" aria-current="page">
            <strong>YAH Aquapark</strong><small>Litoral do Piauí</small>
          </Link>
        </nav>

        {!databaseConfigured && (
          <div className="demo-banner"><Database size={19} /><span><b>Banco ainda não conectado:</b> conecte o Neon na Vercel antes de divulgar a pesquisa. Sem isso, nenhuma participação será persistida.</span></div>
        )}

        <section id="visao-geral" className="dashboard-section">
          <div className="metric-strip yah-admin-metrics">
            <article><span><Users size={20} /></span><div><strong>{data.total}</strong><small>Participações</small></div></article>
            <article><span><MousePointerClick size={20} /></span><div><strong>{data.today}</strong><small>Respostas hoje</small></div></article>
            <article><span><Megaphone size={20} /></span><div><strong>{data.interested}</strong><small>Querem conhecer o Black</small></div></article>
            <article><span><BarChart3 size={20} /></span><div><strong>{data.interestRate}%</strong><small>Taxa de interesse</small></div></article>
          </div>
        </section>

        <section id="perguntas" className="dashboard-section yah-admin-section">
          <div className="section-heading"><div><h2>Resultado por pergunta</h2><p>Distribuição das respostas válidas desta pesquisa.</p></div><span className="tracking-badge">{data.trackedResponses}/{data.total} com rastreamento</span></div>
          <div className="yah-answer-panels">
            {yahQuestions.map((question) => (
              <article className="panel yah-answer-panel" key={question.id}>
                <div className="panel-heading"><div><h2>{question.question}</h2></div></div>
                <ol>
                  {data.breakdowns[question.id].map((answer) => (
                    <li key={answer.value}>
                      <div><span>{answer.label}</span><strong>{answer.responses} <small>({answer.share}%)</small></strong></div>
                      <i aria-hidden="true"><b style={{ width: `${answer.share}%` }} /></i>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <section id="respostas" className="dashboard-section">
          <div className="section-heading"><div><h2>Respostas recentes</h2><p>Últimas participações registradas no YAH Aquapark.</p></div></div>
          <div className="responses-table-wrap">
            <table>
              <thead><tr><th>Participante</th><th>Carteirinha Sesc</th><th>Conhecia o parque</th><th>Interesse no Black</th><th>Data</th></tr></thead>
              <tbody>
                {data.responses.slice(0, 20).map((response) => (
                  <tr key={response.id}>
                    <td>
                      <strong>{response.name || "Contato não coletado"}</strong>
                      <small>{response.whatsapp || "WhatsApp não coletado"}<br />{response.consent ? "Consentimento confirmado" : "Sem consentimento registrado"}</small>
                    </td>
                    <td>{answerLabel("sescCard", response.sescCard)}</td>
                    <td>{answerLabel("knowsPark", response.knowsPark)}</td>
                    <td><strong>{answerLabel("blackCardInterest", response.blackCardInterest)}</strong></td>
                    <td>{new Date(response.createdAt).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" })}</td>
                  </tr>
                ))}
                {!data.responses.length && <tr><td colSpan={5} className="table-empty">Nenhuma resposta registrada ainda.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
