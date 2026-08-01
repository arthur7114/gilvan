export const identityQuestions = [
  "Na sua opinião, qual empresa mais representa Cruz das Almas?",
  "Qual empresa você indicaria para alguém que está visitando Cruz das Almas pela primeira vez?",
  "Qual empresa faz parte da história de Cruz das Almas?",
  "Qual empresa transmite mais confiança?",
  "Qual empresa mais contribui para o desenvolvimento da cidade?",
  "Qual empresa merece ser mais conhecida pela população?",
  "Qual empresa é motivo de orgulho para Cruz das Almas?",
] as const;

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

export type IdentityAnswer = { question: string; answer: string };
export type SegmentAnswer = { segment: string; companies: string[] };

export type SurveyPayload = {
  name: string;
  whatsapp: string;
  email: string;
  neighborhood: string;
  identityAnswers: IdentityAnswer[];
  segmentAnswers: SegmentAnswer[];
  postcardCompany: string;
  postcardReason: string;
  consent: boolean;
  source?: Record<string, string>;
};

export type StoredResponse = SurveyPayload & {
  id: string;
  createdAt: string;
};

export type DashboardData = {
  responses: StoredResponse[];
  total: number;
  today: number;
  topCompanies: Array<{ name: string; mentions: number }>;
  neighborhoods: Array<{ name: string; responses: number }>;
  daily: Array<{ date: string; responses: number }>;
  segmentLeaders: Record<string, Array<{ name: string; mentions: number }>>;
};
