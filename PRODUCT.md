# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js com React e TypeScript, hospedado na Vercel, com Neon Postgres para persistência.

## Users

- Moradores e pessoas que conhecem Cruz das Almas ou Tutóia, respondendo pelo celular após chegar por anúncios no Meta.
- Equipe do Conecta Cidades, acompanhando a participação, analisando empresas citadas e exportando os dados.

## Product Purpose

Realizar pesquisas públicas sobre as empresas que mais representam cada cidade, preservar as respostas sem misturar campanhas e oferecer análise, funil e exportação para a equipe do projeto. O sucesso significa uma jornada rápida para o participante, respostas válidas salvas e dados acionáveis para a organização.

## Positioning

Une uma pesquisa de identidade empresarial local à mensuração de campanha: cada participação salva gera o evento `Lead` do Meta Pixel configurado pela administração.

## Operating Context

O tráfego chega principalmente por Meta Ads em dispositivos móveis. O participante responde perguntas abertas sobre empresas da cidade, informa nome, WhatsApp, e-mail e bairro para concorrer a prêmios e aceita o uso desses dados para a finalidade da campanha. A equipe usa um painel protegido por senha.

## Capabilities and Constraints

- Formulário em blocos com progresso, validação e experiência mobile-first.
- Perguntas abertas do roteiro fornecido, incluindo até três empresas em cada segmento.
- Persistência no Neon Postgres.
- Painel administrativo protegido por uma senha única na primeira versão.
- Configuração do ID do Meta Pixel pelo painel.
- Evento `Lead` somente após confirmação de que a resposta foi salva.
- Análise agregada das respostas e exportação CSV compatível com planilhas.
- Não há contas individuais de administradores nesta versão.

## Brand Commitments

- Nome institucional: Conecta Cidades.
- Campanha: “Cruz das Almas está escolhendo”.
- Campanha: “Tutóia está escolhendo”, edição histórica rumo aos 89 anos.
- Frase institucional: “A identidade de uma cidade também é construída pelas empresas que fazem parte da sua história.”
- Preservar a linguagem visual do criativo fornecido: azul-marinho, dourado, patrimônio histórico, celebração cívica e tom de orgulho local.

## Evidence on Hand

- Roteiro completo da pesquisa fornecido pelo usuário.
- Criativos oficiais versionados em `public/criativo-conecta-cidades.png` e `public/criativo-tutoia.png`.
- Não há resultados, depoimentos ou empresas vencedoras previamente confirmados; o produto não deve inventá-los.

## Product Principles

- Tornar a participação fácil e respeitosa, sobretudo no celular.
- Manter a escolha genuinamente aberta, sem sugerir empresas.
- Separar claramente a experiência pública da operação administrativa.
- Tratar dados pessoais com transparência e coletar somente o necessário para a campanha.
- Considerar uma participação como lead somente depois de persistir a resposta.

## Accessibility & Inclusion

Campos com rótulos explícitos, navegação por teclado, foco visível, mensagens de erro úteis, contraste adequado e suporte a redução de movimento.
