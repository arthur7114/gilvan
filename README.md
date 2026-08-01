# Pesquisa Conecta Cidades

Aplicação Next.js da campanha “Cruz das Almas está escolhendo”. Inclui formulário público, painel administrativo, análise das respostas, exportação CSV e Meta Pixel.

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

As tabelas são criadas automaticamente na primeira utilização. O evento `Lead` é disparado no navegador somente após a API confirmar o salvamento da resposta.

## Rotas

- `/` — campanha e pesquisa pública.
- `/admin` — painel protegido por senha.
- `/api/admin/export` — exportação CSV autenticada.

## Antes de divulgar

- Troque a senha administrativa.
- Conecte o Neon e confirme que o painel mostra “Neon conectado”.
- Configure o Meta Pixel e valide o evento com a extensão Meta Pixel Helper.
- Publique a política de privacidade aplicável à campanha e confirme o regulamento da premiação.
