---
name: "Conecta Cidades — Pesquisa Cruz das Almas"
description: "Uma cédula cívica digital que transforma memória empresarial local em legado."
colors:
  navy-night: "#03152e"
  navy-civic: "#072449"
  navy-active: "#0b315f"
  heritage-gold: "#d79b24"
  celebration-gold: "#efb844"
  gold-light: "#f8dea0"
  official-paper: "#fffaf0"
  aged-paper: "#f3e8d2"
  ink: "#10233f"
  secondary-ink: "#596575"
  rule: "#d9d1c2"
  danger: "#a62f34"
  success: "#17704b"
  yah-pool-blue: "#087bc2"
  yah-deep-blue: "#063e73"
  yah-cyan: "#19b9dc"
  yah-coral: "#f41364"
  yah-coral-action: "#d10a50"
  yah-yellow: "#ffd324"
  yah-ink: "#123651"
typography:
  display:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(3rem, 8.1vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.91
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Barlow, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.12em"
rounded:
  control: "12px"
  surface: "14px"
  campaign: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "42px"
components:
  button-primary:
    backgroundColor: "{colors.celebration-gold}"
    textColor: "{colors.navy-night}"
    rounded: "{rounded.surface}"
    padding: "0 24px"
    height: "56px"
  button-admin:
    backgroundColor: "{colors.navy-civic}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 17px"
    height: "51px"
  input:
    backgroundColor: "#fffdf9"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 15px"
    height: "51px"
  survey-surface:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.campaign}"
    padding: "46px 50px"
  yah-submit:
    backgroundColor: "{colors.yah-coral-action}"
    textColor: "#ffffff"
    rounded: "{rounded.surface}"
    padding: "0 24px"
    height: "58px"
  yah-access-band:
    backgroundColor: "#ffffff"
    textColor: "{colors.yah-ink}"
    rounded: "{rounded.pill}"
    padding: "9px 13px 9px 34px"
    height: "48px"
  yah-access-band-selected:
    backgroundColor: "{colors.yah-deep-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "9px 13px 9px 34px"
    height: "48px"
---

# Design System: Conecta Cidades — Pesquisa Cruz das Almas

## Overview

**Creative North Star: “A Cédula Cívica de Cruz das Almas”**

O sistema traduz a solenidade de uma escolha pública para uma experiência acolhedora e simples no celular. A campanha é expressiva e comemorativa; o formulário preserva a mesma identidade com a disciplina de um documento oficial. O resultado deve parecer local, histórico e confiável — nunca um formulário genérico com uma marca aplicada por cima.

**Extensão de rota YAH: “A Pulseira de Acesso em Três Toques”**

A rota `/yah` é um mundo oficial próprio, não uma recoloração do sistema cívico. Fotografia solar, azul-piscina em grandes campos, coral e amarelo de sinalização transformam a pesquisa objetiva em uma pulseira de acesso: reconhecer o parque, responder e manifestar interesse no Cartão Black. A extensão compartilha a disciplina tipográfica, responsiva e acessível do produto, mas mantém paleta, material e componentes isolados das campanhas Conecta Cidades.

**Key Characteristics:**

- Azul profundo como campo institucional dominante.
- Dourado usado para eleição, celebração e ação principal.
- Papel claro nas áreas de resposta, com tipografia firme e legível.
- Patrimônio e memória local apresentados por meio do criativo oficial.
- Painel administrativo mais sóbrio, mantendo a marca em detalhes precisos.
- YAH como extensão isolada de fotografia costeira, água em escala e controles-pulseira.
- Marcas oficiais apresentadas por assets fornecidos, nunca por recriação tipográfica.

## Colors

A paleta combina a noite azul institucional com ouro comemorativo e papéis quentes.

### Primary

- **Noite Institucional** (`#03152e`): hero, rodapé e navegação administrativa.
- **Azul Cívico** (`#072449`): cabeçalhos do formulário, botões administrativos e títulos escuros.
- **Azul Ativo** (`#0b315f`): estados ativos e hover sobre o azul.

### Secondary

- **Ouro Patrimonial** (`#d79b24`): detalhes, rankings e foco.
- **Ouro de Celebração** (`#efb844`): ações públicas e destaques de campanha.
- **Luz Dourada** (`#f8dea0`): texto secundário sobre azul e acentos discretos.

### Neutral

- **Papel Oficial** (`#fffaf0`): fundo público.
- **Papel Envelhecido** (`#f3e8d2`): grupos de escolha e destaques.
- **Tinta** (`#10233f`): texto principal.
- **Tinta Secundária** (`#596575`): texto auxiliar com contraste acessível.
- **Regra de Papel** (`#d9d1c2`): divisores e bordas.

### Route-scoped palette: YAH Aquapark

- **Azul de Piscina** (`#087bc2`): numeração, títulos de marca e respostas administrativas da campanha YAH.
- **Azul de Profundidade** (`#063e73`): campo visual, títulos e estado selecionado das pulseiras.
- **Ciano de Onda** (`#19b9dc`): grande gesto aquático sobre a fotografia.
- **Coral de Sinalização** (`#f41364`): ícones, sinalização e acentos do ingresso.
- **Coral de Ação** (`#d10a50`): envio da pesquisa; escurece no hover sem mudar de papel semântico.
- **Amarelo de Acesso** (`#ffd324`): ponto selecionado, ícone de onda e confirmação de sucesso.
- **Tinta de Água** (`#123651`): texto principal da pesquisa sobre superfícies frias.

**Regra do Ouro.** O dourado marca escolha, celebração ou ação. Não espalhá-lo como decoração sem função.

**Regra da Paleta Isolada.** Azul-piscina, coral e amarelo pertencem à rota YAH; azul-marinho, ouro e papel continuam sendo a voz das campanhas Conecta Cidades e do painel.

## Typography

**Display Font:** Bebas Neue, sans-serif
**Body Font:** Barlow, sans-serif

**Character:** Bebas Neue recupera a força dos letreiros e cartazes da campanha; Barlow mantém respostas, instruções e dados confortáveis em telas pequenas.

### Hierarchy

- **Display** (400, até `6rem`, `0.91`): títulos de campanha e grandes momentos.
- **Headline** (400, `clamp(3rem, 5vw, 4.4rem)`, `0.96`): aberturas de seção e estado de sucesso.
- **Title** (700, `18–24px`, `1.2`): painel e agrupamentos operacionais.
- **Body** (400, `16–20px`, `1.55`): explicações e conteúdo principal.
- **Label** (700, `12–14px`): campos, progresso e metadados; caixa alta somente em selos institucionais curtos.

**Regra da Voz Dupla.** Bebas Neue fala pela cidade; Barlow ajuda a pessoa a completar a tarefa.

Na rota YAH, a mesma dupla muda de cadência sem mudar de família: Bebas Neue assume títulos solares e diretos; Barlow mantém as três perguntas compactas, legíveis e sem aparência promocional excessiva.

## Layout

O hero usa uma composição de duas colunas até `900px`, com manifesto e ação à esquerda e o criativo oficial à direita. O conteúdo público respeita um máximo de `1180px`; o formulário usa até `860px`. Em telas menores, a campanha empilha, a arte permanece reconhecível no primeiro viewport e o formulário reduz de duas colunas para uma. O painel usa uma navegação lateral fixa de `246px`, convertida em barra superior abaixo de `820px`.

O ritmo aproxima rótulo e controle, separa perguntas em blocos de cerca de `20–24px` e reserva espaços maiores (`42–105px`) entre capítulos da campanha.

Na rota YAH, o primeiro viewport de desktop é uma grade de duas colunas em altura total: fotografia costeira à esquerda e o início da pesquisa à direita. O envio permanece no mesmo fluxo contínuo, depois das três respostas e dos dados obrigatórios, e pode exigir rolagem em alturas compactas. Abaixo de `1080px`, cada pergunta empilha enunciado e respostas; em `860px`, a rota passa a um fluxo vertical com fotografia compacta de `430px` antes do formulário; em `520px`, a abertura cai para `355px` e a pesquisa usa margens de `18px`. O conteúdo não cria etapas adicionais: perguntas, dados e envio permanecem uma única tarefa.

**Regra da Primeira Dobra.** Desktop mostra costa e início da pesquisa juntos; celular mostra uma foto compacta e conduz imediatamente às três perguntas. Os dados adicionais continuam no fluxo natural de rolagem, sem modal ou etapa separada.

## Elevation & Depth

A profundidade é estrutural: o cartaz deve parecer uma peça impressa em exposição; o formulário, uma folha oficial elevada; o painel, uma pilha discreta de superfícies operacionais.

### Shadow Vocabulary

- **Cartaz:** `0 28px 70px rgba(0,0,0,.42), 0 0 55px rgba(215,155,36,.14)`.
- **Cédula:** `0 24px 70px rgba(18,32,54,.14)`.
- **Painel:** `0 7px 22px rgba(20,35,55,.05)`.
- **Ação elevada:** `0 13px 28px rgba(0,0,0,.24)`.
- **Ingresso YAH:** `0 28px 65px rgba(1,43,75,.38)` para o Cartão Black inclinado sobre a fotografia.
- **Ação YAH:** `0 13px 28px rgba(205,16,84,.22)`; amplia no hover para confirmar interatividade.
- **Confirmação YAH:** `0 18px 38px rgba(4,100,152,.16)` sob o selo amarelo de sucesso.

O gesto autoral da rota YAH é o ingresso inclinado que revela de baixo para cima em `850ms` com `cubic-bezier(.16,1,.3,1)`. A preferência por movimento reduzido elimina essa animação.

**Regra do Gesto Único.** Movimento expressivo apresenta o ingresso uma vez; respostas e envio usam apenas transições curtas de estado.

## Shapes

Controles usam cantos de `12px`; superfícies operacionais, `14px`; blocos principais e o cartaz, `16px`. Pílulas ficam restritas a selos pequenos. Campos têm borda fina e clara; não combinar borda decorativa com sombra pesada. A marca de elos é construída com dois anéis dourados inclinados.

Na rota YAH, a pílula ganha uma exceção funcional: cada resposta é uma pulseira de acesso alongada com furo circular e linha perfurada. O Cartão Black usa um retângulo compacto de `14px`, rotação de `3.5deg` e sobreposição circular coral; o grande arco ciano atrás dele sugere uma onda, não um cartão adicional.

## Components

### Buttons

- **Primary:** ouro de celebração, tinta azul-noite, `13px` de raio e altura mínima de `56px`.
- **Hover:** clareia para `#f6c963`, sobe `2px` e amplia a sombra.
- **Focus:** contorno azul-claro de `3px` com afastamento.
- **Administrative:** azul cívico com texto branco; não compete com a ação pública dourada.

### Cards / Containers

- **Cédula:** branca, raio de `16px`, sombra ampla e cabeçalho azul com progresso dourado.
- **Painel:** branco, raio de `14px`, sombra baixa e conteúdo compacto.
- **Destaque de escolha:** papel envelhecido, sem sombra própria.

### Inputs / Fields

Campos usam fundo `#fffdf9`, borda `#c9c3b8`, raio de `12px` e altura mínima de `51px`. O foco muda a borda para ouro e acrescenta um halo translúcido. Erros usam `#a62f34` e instruem a recuperação em linguagem direta.

### Navigation

A navegação pública é mínima e deixa campanha e formulário liderarem. No painel, o item ativo recebe fundo azul ativo e ícone dourado; no celular, a lateral vira uma barra curta com marca e saída.

### Campaign Poster

O criativo oficial é a principal evidência visual. Ele entra uma vez com `clip-path`, leve desfoque e deslocamento vertical, usando `cubic-bezier(.16,1,.3,1)`. Em preferência por movimento reduzido, a animação é praticamente eliminada.

### YAH Access Wristbands

- **Rest:** fundo branco, borda azul fria, texto em tinta de água e altura mínima de `48px`.
- **Selected:** fundo azul de profundidade, texto branco e ponto amarelo encaixado no furo da pulseira.
- **Hover / Focus:** sobe `1px` no hover e recebe contorno azul-claro de `3px` no foco visível.
- **Validation:** a pergunta e a mensagem assumem o vermelho de erro do produto, sem apagar as outras respostas.

### YAH Submit and Success

O envio ocupa toda a largura, usa coral de ação, altura mínima de `58px` e elevação curta. Desabilitado, mantém a forma e reduz a opacidade. O sucesso troca a tarefa por um selo amarelo circular e uma confirmação direta. Nome, WhatsApp, bairro, profissão e faixa de renda são solicitados com consentimento e ficam visíveis somente no painel administrativo e na exportação autenticada.

### YAH Official Brand and Black Card Ticket

O logotipo oficial do YAH é sempre um recorte direto do criativo fornecido, com `background-position` e `background-size` documentados na implementação; nunca compor o nome com texto para simular a marca. O Cartão Black aparece como ingresso roxo inclinado, compacto e sem acrescentar benefícios, preços ou condições ausentes do roteiro.

**Regra da Marca Direta.** Logotipo oficial é asset recortado, nunca recriação tipográfica.

## Do's and Don'ts

### Do:

- **Do** preservar azul, ouro, papel e o criativo oficial como um único mundo visual.
- **Do** manter a ação principal no fluxo contínuo da pesquisa, imediatamente após os dados obrigatórios.
- **Do** usar linguagem espontânea e controles familiares para reduzir abandono.
- **Do** manter textos auxiliares com contraste mínimo de `4.5:1`.
- **Do** tratar `/yah` como uma extensão visual isolada, com persistência e conteúdo igualmente isolados.
- **Do** manter fotografia compacta antes da pesquisa no celular e a pesquisa completa ao lado da foto no desktop.
- **Do** confirmar apenas o registro da opinião no sucesso da YAH; interesse positivo no Cartão Black só vira `Lead` depois da persistência.

### Don't:

- **Don't** transformar o formulário em uma sequência de cartões genéricos com ícones decorativos.
- **Don't** usar texto em degradê, vidro decorativo, emojis ou ilustrações improvisadas.
- **Don't** inventar empresas vencedoras, métricas, parceiros ou prêmios.
- **Don't** usar dourado em todo elemento; sua raridade comunica escolha.
- **Don't** aplicar azul-piscina, coral ou amarelo da YAH às campanhas Conecta Cidades ou ao painel administrativo.
- **Don't** recriar o logotipo oficial do YAH com tipografia, nem inventar benefícios, preços ou condições do Cartão Black.
- **Don't** pedir dados pessoais além de nome, WhatsApp, bairro, profissão e faixa de renda, nem coletá-los sem consentimento explícito na pesquisa YAH.
