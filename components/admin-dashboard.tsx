import { Activity, BarChart3, Building2, CalendarDays, Clock3, Database, Download, LogOut, MapPinned, Megaphone, MousePointerClick, Settings2, Target, TriangleAlert, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { campaigns, type SurveyConfig } from "@/lib/campaigns";
import type { DashboardData } from "@/lib/types";
import { CampaignChart, DailyChart } from "@/components/dashboard-charts";
import { PixelSettings } from "@/components/pixel-settings";

function formatDuration(milliseconds: number) {
  const seconds = Math.round(milliseconds / 1_000);
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}min ${seconds % 60}s`;
}

const fieldLabels: Record<string, string> = {
  identity0: "Primeira pergunta",
  postcardCompany: "Grande escolha",
  name: "Nome",
  whatsapp: "WhatsApp",
  email: "E-mail",
  consent: "Consentimento",
  form: "Envio",
};

export function AdminDashboard({
  data,
  pixelId,
  databaseConfigured,
  selectedCampaign,
}: {
  data: DashboardData;
  pixelId: string;
  databaseConfigured: boolean;
  selectedCampaign: SurveyConfig;
}) {
  const exportHref = `/api/admin/export?survey=${selectedCampaign.slug}`;
  const exportControl = databaseConfigured
    ? <a className="export-button" href={exportHref}><Download size={18} /> Exportar CSV</a>
    : <button className="export-button" disabled title="Conecte o Neon para liberar a exportação."><Download size={18} /> Exportar CSV</button>;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span><strong>conecta</strong><small>CIDADES</small></span>
        </Link>
        <nav aria-label="Navegação do painel">
          <a className="active" href="#visao-geral"><Building2 size={18} /> Visão geral</a>
          <a href="#funil"><Activity size={18} /> Funil</a>
          <a href="#campanha"><Megaphone size={18} /> Campanha</a>
          <a href="#segmentos"><Trophy size={18} /> Segmentos</a>
          <a href="#respostas"><Users size={18} /> Respostas</a>
          <a href="#configuracoes"><Settings2 size={18} /> Configurações</a>
        </nav>
        <form action="/api/admin/logout" method="post"><button><LogOut size={17} /> Sair</button></form>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div><h1>Painel da pesquisa</h1><p>{selectedCampaign.city} · {selectedCampaign.edition}</p></div>
          {exportControl}
        </header>

        <nav className="campaign-switcher" aria-label="Selecionar pesquisa">
          <span>Resultados de</span>
          {Object.values(campaigns).map((campaign) => (
            <Link
              key={campaign.slug}
              href={`/admin?survey=${campaign.slug}`}
              className={campaign.slug === selectedCampaign.slug ? "active" : ""}
              aria-current={campaign.slug === selectedCampaign.slug ? "page" : undefined}
            >
              <strong>{campaign.city}</strong>
              <small>{campaign.state}</small>
            </Link>
          ))}
        </nav>

        {!databaseConfigured && (
          <div className="demo-banner"><Database size={19} /><span><b>Banco ainda não conectado:</b> conecte o Neon na Vercel antes de divulgar a pesquisa. Sem isso, nenhuma participação será persistida.</span></div>
        )}

        <section id="visao-geral" className="dashboard-section">
          <div className="metric-strip">
            <article><span><Users size={20} /></span><div><strong>{data.total}</strong><small>Participações</small></div></article>
            <article><span><CalendarDays size={20} /></span><div><strong>{data.today}</strong><small>Respostas hoje</small></div></article>
            <article><span><Trophy size={20} /></span><div><strong>{data.topCompanies[0]?.name ?? "—"}</strong><small>Mais mencionada</small></div></article>
            <article><span><MapPinned size={20} /></span><div><strong>{data.neighborhoods[0]?.name ?? "—"}</strong><small>Bairro mais ativo</small></div></article>
          </div>

          <div className="dashboard-grid">
            <article className="panel chart-panel">
              <div className="panel-heading"><div><h2>Participações por dia</h2><p>Últimos 14 dias com respostas</p></div></div>
              <DailyChart data={data.daily} />
            </article>
            <article className="panel ranking-panel">
              <div className="panel-heading"><div><h2>Empresas mais lembradas</h2><p>Menções em toda a pesquisa</p></div></div>
              {data.topCompanies.length ? (
                <ol>{data.topCompanies.slice(0, 6).map((company, index) => <li key={company.name}><b>{index + 1}</b><span>{company.name}</span><strong>{company.mentions}<small>{company.respondents} pessoas</small></strong></li>)}</ol>
              ) : <div className="panel-empty">Os rankings aparecerão aqui.</div>}
            </article>
          </div>
        </section>

        <section id="funil" className="dashboard-section funnel-section">
          <div className="section-heading">
            <div><h2>Funil e pontos de fricção</h2><p>Sessões anônimas da pesquisa de {selectedCampaign.city}. Sessões ativas há menos de 30 minutos não contam como abandono.</p></div>
            <span className="tracking-badge"><Activity size={16} /> {data.telemetry.completionRate}% de conclusão</span>
          </div>

          <div className="campaign-metric-strip telemetry-metrics">
            <article><span><Users size={20} /></span><div><strong>{data.telemetry.totalSessions}</strong><small>Visualizações medidas</small></div></article>
            <article><span><MousePointerClick size={20} /></span><div><strong>{data.telemetry.startedSessions}</strong><small>Pesquisas iniciadas</small></div></article>
            <article><span><TriangleAlert size={20} /></span><div><strong>{data.telemetry.abandonedSessions}</strong><small>Sessões abandonadas</small></div></article>
          </div>

          <div className="funnel-grid">
            <article className="panel funnel-panel">
              <div className="panel-heading"><div><h2>Conversão por etapa</h2><p>Pessoas únicas por sessão, não quantidade de eventos.</p></div></div>
              {data.telemetry.totalSessions ? (
                <ol className="funnel-list">
                  {data.telemetry.funnel.map((stage) => (
                    <li key={stage.key}>
                      <div><strong>{stage.label}</strong><small>{stage.dropOffRate ? `${stage.dropOffRate}% de queda na etapa` : "Entrada do funil"}</small></div>
                      <span><i style={{ width: `${Math.max(stage.conversionRate, 3)}%` }} /></span>
                      <b>{stage.sessions}<small>{stage.conversionRate}%</small></b>
                    </li>
                  ))}
                </ol>
              ) : <div className="panel-empty">O funil começará a aparecer após a publicação da telemetria.</div>}
            </article>

            <div className="friction-stack">
              <article className="panel friction-panel">
                <div className="panel-heading"><div><h2>Tempo por etapa</h2><p>Mediana até a primeira conclusão válida.</p></div></div>
                {data.telemetry.stepDurations.length ? <ol>{data.telemetry.stepDurations.map((item) => <li key={item.step}><span><Clock3 size={15} /> Etapa {item.step}</span><strong>{formatDuration(item.medianMs)}<small>{item.samples} sessões</small></strong></li>)}</ol> : <div className="compact-empty">Aguardando sessões concluídas.</div>}
              </article>
              <article className="panel friction-panel">
                <div className="panel-heading"><div><h2>Erros mais frequentes</h2><p>Somente campo e tipo de erro; nenhum conteúdo digitado.</p></div></div>
                {data.telemetry.validationErrors.length ? <ol>{data.telemetry.validationErrors.slice(0, 5).map((item) => <li key={`${item.fieldId}:${item.errorCode}`}><span>{fieldLabels[item.fieldId] ?? item.fieldId}</span><strong>{item.count}<small>ocorrências</small></strong></li>)}</ol> : <div className="compact-empty">Nenhum erro medido ainda.</div>}
              </article>
            </div>
          </div>
        </section>

        <section id="campanha" className="dashboard-section campaign-section">
          <div className="section-heading">
            <div><h2>Analytics da campanha</h2><p>Leads captados por origem, campanha e criativo.</p></div>
            <span className="tracking-badge"><Target size={16} /> {data.trackedResponses}/{data.total} com rastreamento</span>
          </div>

          <div className="campaign-metric-strip">
            <article><span><Megaphone size={20} /></span><div><strong>{data.metaLeads}</strong><small>Leads de Meta Ads</small></div></article>
            <article><span><BarChart3 size={20} /></span><div><strong>{data.campaigns[0]?.name ?? "—"}</strong><small>Campanha com mais leads</small></div></article>
            <article><span><MousePointerClick size={20} /></span><div><strong>{data.creatives[0]?.name ?? "—"}</strong><small>Criativo mais identificado</small></div></article>
          </div>

          <div className="campaign-grid">
            <article className="panel chart-panel">
              <div className="panel-heading"><div><h2>Leads por campanha</h2><p>Baseado em <code>utm_campaign</code>.</p></div></div>
              <CampaignChart data={data.campaigns} />
            </article>
            <article className="panel campaign-list-panel">
              <div className="panel-heading"><div><h2>Origem dos leads</h2><p>Baseado em <code>utm_source</code> e <code>fbclid</code>.</p></div></div>
              {data.channels.length ? <ol>{data.channels.map((item, index) => <li key={item.name}><b>{index + 1}</b><span>{item.name}</span><strong>{item.leads}<small>{item.share}%</small></strong></li>)}</ol> : <div className="panel-empty">As origens aparecerão aqui.</div>}
            </article>
          </div>

          <div className="campaign-insights-grid">
            <article className="panel campaign-list-panel">
              <div className="panel-heading"><div><h2>Criativos e anúncios</h2><p>Compare seus links usando <code>utm_content</code>.</p></div></div>
              {data.creatives.length ? <ol>{data.creatives.map((item, index) => <li key={item.name}><b>{index + 1}</b><span>{item.name}</span><strong>{item.leads}<small>{item.share}%</small></strong></li>)}</ol> : <div className="panel-empty">Os criativos aparecerão aqui.</div>}
            </article>
            <article className="panel campaign-list-panel">
              <div className="panel-heading"><div><h2>Grande escolha</h2><p>Empresas escolhidas para o Cartão-Postal Empresarial.</p></div></div>
              {data.postcardLeaders.length ? <ol>{data.postcardLeaders.map((item, index) => <li key={item.name}><b>{index + 1}</b><span>{item.name}</span><strong>{item.mentions}<small>{item.respondents} pessoas</small></strong></li>)}</ol> : <div className="panel-empty">As escolhas aparecerão aqui.</div>}
            </article>
          </div>

          <p className="campaign-note">Este painel mede os leads que chegaram ao formulário. Custo, alcance e CPA continuam no Gerenciador de Anúncios da Meta.</p>
        </section>

        <section id="segmentos" className="dashboard-section">
          <div className="section-heading"><div><h2>Líderes por segmento</h2><p>As cinco empresas mais citadas em cada categoria.</p></div></div>
          <div className="segment-rankings">
            {Object.entries(data.segmentLeaders).map(([segment, companies]) => (
              <article key={segment}>
                <h3>{segment}</h3>
                {companies.length ? <ol>{companies.map((company, index) => <li key={company.name}><span>{index + 1}. {company.name}</span><b>{company.mentions}<small>{company.respondents} pessoas</small></b></li>)}</ol> : <p>Aguardando respostas</p>}
              </article>
            ))}
          </div>
        </section>

        <section id="respostas" className="dashboard-section">
          <div className="section-heading"><div><h2>Respostas recentes</h2><p>Uma visão rápida das últimas participações de {selectedCampaign.city}.</p></div>{databaseConfigured ? <a href={exportHref}><Download size={17} /> Baixar esta pesquisa</a> : <span className="export-unavailable">Exportação disponível após conectar o Neon.</span>}</div>
          <div className="responses-table-wrap">
            <table>
              <thead><tr><th>Participante</th><th>Bairro</th><th>Grande escolha</th><th>Data</th></tr></thead>
              <tbody>
                {data.responses.slice(0, 12).map((response) => (
                  <tr key={response.id}>
                    <td><strong>{response.name}</strong><small>{response.email}<br />{response.whatsapp}</small></td>
                    <td>{response.neighborhood}</td>
                    <td><strong>{response.postcardCompany}</strong><small>{response.postcardReason}</small></td>
                    <td>{new Date(response.createdAt).toLocaleDateString("pt-BR", { timeZone: "America/Fortaleza" })}</td>
                  </tr>
                ))}
                {!data.responses.length && <tr><td colSpan={4} className="table-empty">Nenhuma resposta registrada ainda.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section id="configuracoes" className="dashboard-section settings-section">
          <div className="section-heading"><div><h2>Configurações da campanha</h2><p>Mensuração e conexão dos dados.</p></div></div>
          <div className="settings-grid">
            <article className="panel"><h3>Meta Pixel global</h3><p>O mesmo Pixel atende todas as campanhas; cada evento leva o slug da pesquisa.</p><PixelSettings initialPixelId={pixelId} disabled={!databaseConfigured} /></article>
            <article className="panel database-status"><h3>Armazenamento</h3><p>Onde as respostas da campanha são guardadas.</p><div className={databaseConfigured ? "connected" : "pending"}><Database size={22} /><span><b>{databaseConfigured ? "Neon conectado" : "Neon pendente"}</b><small>{databaseConfigured ? "Respostas persistentes e protegidas." : "Configure DATABASE_URL na Vercel antes de publicar a campanha."}</small></span></div></article>
          </div>
        </section>
      </div>
    </main>
  );
}
