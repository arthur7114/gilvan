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
---

# Design System: Conecta Cidades — Pesquisa Cruz das Almas

## Overview

**Creative North Star: “A Cédula Cívica de Cruz das Almas”**

O sistema traduz a solenidade de uma escolha pública para uma experiência acolhedora e simples no celular. A campanha é expressiva e comemorativa; o formulário preserva a mesma identidade com a disciplina de um documento oficial. O resultado deve parecer local, histórico e confiável — nunca um formulário genérico com uma marca aplicada por cima.

**Key Characteristics:**

- Azul profundo como campo institucional dominante.
- Dourado usado para eleição, celebração e ação principal.
- Papel claro nas áreas de resposta, com tipografia firme e legível.
- Patrimônio e memória local apresentados por meio do criativo oficial.
- Painel administrativo mais sóbrio, mantendo a marca em detalhes precisos.

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

**Regra do Ouro.** O dourado marca escolha, celebração ou ação. Não espalhá-lo como decoração sem função.

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

## Layout

O hero usa uma composição de duas colunas até `900px`, com manifesto e ação à esquerda e o criativo oficial à direita. O conteúdo público respeita um máximo de `1180px`; o formulário usa até `860px`. Em telas menores, a campanha empilha, a arte permanece reconhecível no primeiro viewport e o formulário reduz de duas colunas para uma. O painel usa uma navegação lateral fixa de `246px`, convertida em barra superior abaixo de `820px`.

O ritmo aproxima rótulo e controle, separa perguntas em blocos de cerca de `20–24px` e reserva espaços maiores (`42–105px`) entre capítulos da campanha.

## Elevation & Depth

A profundidade é estrutural: o cartaz deve parecer uma peça impressa em exposição; o formulário, uma folha oficial elevada; o painel, uma pilha discreta de superfícies operacionais.

### Shadow Vocabulary

- **Cartaz:** `0 28px 70px rgba(0,0,0,.42), 0 0 55px rgba(215,155,36,.14)`.
- **Cédula:** `0 24px 70px rgba(18,32,54,.14)`.
- **Painel:** `0 7px 22px rgba(20,35,55,.05)`.
- **Ação elevada:** `0 13px 28px rgba(0,0,0,.24)`.

## Shapes

Controles usam cantos de `12px`; superfícies operacionais, `14px`; blocos principais e o cartaz, `16px`. Pílulas ficam restritas a selos pequenos. Campos têm borda fina e clara; não combinar borda decorativa com sombra pesada. A marca de elos é construída com dois anéis dourados inclinados.

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

## Do's and Don'ts

### Do:

- **Do** preservar azul, ouro, papel e o criativo oficial como um único mundo visual.
- **Do** manter a ação principal visível no primeiro viewport de desktop e celular.
- **Do** usar linguagem espontânea e controles familiares para reduzir abandono.
- **Do** manter textos auxiliares com contraste mínimo de `4.5:1`.

### Don't:

- **Don't** transformar o formulário em uma sequência de cartões genéricos com ícones decorativos.
- **Don't** usar texto em degradê, vidro decorativo, emojis ou ilustrações improvisadas.
- **Don't** inventar empresas vencedoras, métricas, parceiros ou prêmios.
- **Don't** usar dourado em todo elemento; sua raridade comunica escolha.
