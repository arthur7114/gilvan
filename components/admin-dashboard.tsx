import { BarChart3, Building2, CalendarDays, Database, Download, LogOut, MapPinned, Megaphone, MousePointerClick, Settings2, Target, Trophy, Users } from "lucide-react";
import Link from "next/link";
import type { DashboardData } from "@/lib/types";
import { CampaignChart, DailyChart } from "@/components/dashboard-charts";
import { PixelSettings } from "@/components/pixel-settings";

export function AdminDashboard({ data, pixelId, databaseConfigured }: { data: DashboardData; pixelId: string; databaseConfigured: boolean }) {
  const exportControl = databaseConfigured
    ? <a className="export-button" href="/api/admin/export"><Download size={18} /> Exportar CSV</a>
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
          <a href="#campanha"><Megaphone size={18} /> Campanha</a>
          <a href="#segmentos"><Trophy size={18} /> Segmentos</a>
          <a href="#respostas"><Users size={18} /> Respostas</a>
          <a href="#configuracoes"><Settings2 size={18} /> Configurações</a>
        </nav>
        <form action="/api/admin/logout" method="post"><button><LogOut size={17} /> Sair</button></form>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div><h1>Painel da pesquisa</h1><p>Cruz das Almas · Edição histórica de 130 anos</p></div>
          {exportControl}
        </header>

        {!databaseConfigured && (
          <div className="demo-banner"><Database size={19} /><span><b>Banco ainda não conectado:</b> conecte o Neon na Vercel antes de divulgar a pesquisa. Sem isso, nenhuma participação será registrada.</span></div>
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
                <ol>{data.topCompanies.slice(0, 6).map((company, index) => <li key={company.name}><b>{index + 1}</b><span>{company.name}</span><strong>{company.mentions}</strong></li>)}</ol>
              ) : <div className="panel-empty">Os rankings aparecerão aqui.</div>}
            </article>
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
              {data.postcardLeaders.length ? <ol>{data.postcardLeaders.map((item, index) => <li key={item.name}><b>{index + 1}</b><span>{item.name}</span><strong>{item.mentions}<small>votos</small></strong></li>)}</ol> : <div className="panel-empty">As escolhas aparecerão aqui.</div>}
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
                {companies.length ? <ol>{companies.map((company, index) => <li key={company.name}><span>{index + 1}. {company.name}</span><b>{company.mentions}</b></li>)}</ol> : <p>Aguardando respostas</p>}
              </article>
            ))}
          </div>
        </section>

        <section id="respostas" className="dashboard-section">
          <div className="section-heading"><div><h2>Respostas recentes</h2><p>Uma visão rápida das últimas participações.</p></div>{databaseConfigured ? <a href="/api/admin/export"><Download size={17} /> Baixar tudo</a> : <span className="export-unavailable">Exportação disponível após conectar o Neon.</span>}</div>
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
            <article className="panel"><h3>Meta Pixel</h3><p>Configure o identificador usado nesta campanha.</p><PixelSettings initialPixelId={pixelId} disabled={!databaseConfigured} /></article>
            <article className="panel database-status"><h3>Armazenamento</h3><p>Onde as respostas da campanha são guardadas.</p><div className={databaseConfigured ? "connected" : "pending"}><Database size={22} /><span><b>{databaseConfigured ? "Neon conectado" : "Neon pendente"}</b><small>{databaseConfigured ? "Respostas persistentes e protegidas." : "Configure DATABASE_URL na Vercel antes de publicar a campanha."}</small></span></div></article>
          </div>
        </section>
      </div>
    </main>
  );
}
