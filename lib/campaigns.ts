export const surveySlugs = ["cruz-das-almas", "tutoia"] as const;

export type SurveySlug = (typeof surveySlugs)[number];

export const segments = [
  "Gastronomia",
  "Saúde",
  "Moda",
  "Comércio",
  "Construção",
  "Beleza",
  "Educação",
  "Agronegócio",
  "Serviços",
  "Tecnologia",
] as const;

export type SurveyConfig = {
  slug: SurveySlug;
  city: string;
  state: string;
  edition: string;
  active: boolean;
  route: string;
  image: { src: string; width: number; height: number; alt: string };
  metadata: { title: string; description: string };
  heroLabel: string;
  headline: string;
  heroLead: string;
  figcaption: string;
  institutionalLine: string;
  surveyTitle: string;
  surveyIntro: string;
  identityQuestions: readonly string[];
  postcardQuestion: string;
  successTitle: string;
  successDescription: string;
  phonePlaceholder: string;
};

function identityQuestions(city: string) {
  return [
    `Na sua opinião, qual empresa mais representa ${city}?`,
    `Qual empresa você indicaria para alguém que está visitando ${city} pela primeira vez?`,
    `Qual empresa faz parte da história de ${city}?`,
    "Qual empresa transmite mais confiança?",
    "Qual empresa mais contribui para o desenvolvimento da cidade?",
    "Qual empresa merece ser mais conhecida pela população?",
    `Qual empresa é motivo de orgulho para ${city}?`,
  ] as const;
}

export const campaigns: Record<SurveySlug, SurveyConfig> = {
  "cruz-das-almas": {
    slug: "cruz-das-almas",
    city: "Cruz das Almas",
    state: "Bahia",
    edition: "Edição histórica · 130 anos",
    active: false,
    route: "/",
    image: {
      src: "/criativo-conecta-cidades.png",
      width: 1024,
      height: 1536,
      alt: "Criativo da campanha Cruz das Almas está escolhendo",
    },
    metadata: {
      title: "Cruz das Almas está escolhendo | Conecta Cidades",
      description: "Ajude a escolher as empresas que mais representam Cruz das Almas.",
    },
    heroLabel: "Cruz das Almas está escolhendo",
    headline: "Quais empresas são a cara de Cruz das Almas?",
    heroLead:
      "Quem vive a cidade conhece quem faz a diferença. Participe da escolha das empresas que mais representam Cruz das Almas na opinião da população.",
    figcaption: "Uma homenagem à história que construímos juntos.",
    institutionalLine: "A identidade de uma cidade também é construída pelas empresas que fazem parte da sua história.",
    surveyTitle: "Faça parte desta escolha",
    surveyIntro: "Não existem respostas certas. Queremos saber quais nomes vêm primeiro à sua memória.",
    identityQuestions: identityQuestions("Cruz das Almas"),
    postcardQuestion:
      "Se hoje fosse criado um Cartão-Postal Empresarial de Cruz das Almas, qual empresa você escolheria para representar a cidade?",
    successTitle: "Obrigado por ser a voz de Cruz das Almas.",
    successDescription: "Sua opinião ajuda a valorizar as empresas que constroem a identidade da nossa cidade.",
    phonePlaceholder: "(75) 99999-9999",
  },
  tutoia: {
    slug: "tutoia",
    city: "Tutóia",
    state: "Maranhão",
    edition: "Edição histórica · rumo aos 89 anos",
    active: true,
    route: "/tutoia",
    image: {
      src: "/criativo-tutoia.png",
      width: 1054,
      height: 1492,
      alt: "Criativo da campanha Tutóia está escolhendo",
    },
    metadata: {
      title: "Tutóia está escolhendo | Conecta Cidades",
      description: "Ajude a escolher as empresas que mais representam Tutóia.",
    },
    heroLabel: "Tutóia está escolhendo",
    headline: "Quais empresas mais representam Tutóia?",
    heroLead:
      "Quem vive Tutóia conhece quem faz a diferença. Participe da escolha das empresas que mais representam a cidade na opinião da população.",
    figcaption: "Uma homenagem às empresas que constroem a história de Tutóia.",
    institutionalLine: "A identidade de Tutóia também é construída pelas empresas que fazem parte da sua história.",
    surveyTitle: "A resposta está nas suas mãos",
    surveyIntro: "Não existem respostas certas. Queremos saber quais nomes vêm primeiro à sua memória.",
    identityQuestions: identityQuestions("Tutóia"),
    postcardQuestion:
      "Se hoje fosse criado um Cartão-Postal Empresarial de Tutóia, qual empresa você escolheria para representar a cidade?",
    successTitle: "Obrigado por ser a voz de Tutóia.",
    successDescription: "Sua opinião ajuda a valorizar as empresas que constroem a identidade de Tutóia.",
    phonePlaceholder: "(98) 99999-9999",
  },
};

export const activeSurveySlug: SurveySlug = "tutoia";

export function getSurveyConfig(slug: SurveySlug) {
  return campaigns[slug];
}

export function resolveSurveySlug(value: unknown): SurveySlug | null {
  if (value === undefined || value === null || value === "") return "cruz-das-almas";
  return typeof value === "string" && surveySlugs.includes(value as SurveySlug) ? (value as SurveySlug) : null;
}
