# Pesquisas Conecta Cidades

Aplicação Next.js das campanhas “Cruz das Almas está escolhendo”, “Tutóia está escolhendo” e da Pesquisa Rápida do YAH Aquapark. Inclui formulários públicos, painel administrativo separado por campanha, funil anônimo, análise das respostas, exportação CSV e Meta Pixel.

## Rodar localmente

```bash
npm install
npm run dev
```

Sem variáveis de ambiente, a aplicação funciona em modo de demonstração e mantém os dados apenas enquanto o servidor estiver ativo. A senha local padrão do painel é `admin123`.

## Publicar na Vercel com Neon

1. Importe este projeto na Vercel.
2. No projeto, abra **Marketplace → Neon** e crie um banco no plano gratuito.
3. Vincule o banco ao projeto. A integração adicionará `DATABASE_URL` automaticamente.
4. Em **Settings → Environment Variables**, adicione:
   - `ADMIN_PASSWORD`: senha forte para o painel.
   - `ADMIN_SESSION_SECRET`: texto aleatório longo usado para proteger a sessão.
5. Faça um novo deploy.
6. Acesse `/admin`, entre com a senha e configure o ID do Meta Pixel.

As tabelas e índices são criados automaticamente na primeira utilização. A migração idempotente `migrations/002_campaigns_and_telemetry.sql` adiciona `survey_slug`, atribui as respostas legadas a `cruz-das-almas` e cria `survey_events`; a mesma atualização também é executada pela aplicação ao conectar o Neon. O evento `Lead` é disparado no navegador somente após a API confirmar o salvamento da resposta.

## Rotas

- `/` — campanha e pesquisa pública.
- `/tutoia` — campanha e pesquisa pública de Tutóia.
- `/yah` — Pesquisa Rápida do YAH Aquapark.
- `/admin` — painel protegido por senha.
- `/admin/yah` — resultados e respostas da pesquisa do YAH Aquapark.
- `/api/admin/export?survey=tutoia` — exportação CSV autenticada da campanha selecionada.

O painel abre Tutóia por padrão e permite alternar entre as três pesquisas sem misturar respostas. A pesquisa YAH usa uma tabela própria, solicita nome e WhatsApp com consentimento e dispara o evento `Lead` somente quando a pessoa manifesta interesse no Cartão Black. A telemetria das campanhas Conecta Cidades guarda identificador anônimo da aba, evento, etapa, duração, classe de dispositivo, códigos de erro e UTMs; conteúdo digitado, dados de contato, IP e identificadores de clique não são enviados para `survey_events`.

## Antes de divulgar

- Troque a senha administrativa.
- Conecte o Neon e confirme que o painel mostra “Neon conectado”.
- Configure o Meta Pixel e valide o evento com a extensão Meta Pixel Helper.
- Publique a política de privacidade aplicável à campanha e confirme o regulamento da premiação.
