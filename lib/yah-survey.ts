import { z } from "zod";

export const yahQuestions = [
  {
    id: "sescCard",
    question: "Você tem ou conhece alguém que tenha carteirinha do Sesc?",
    options: [
      { value: "yes", label: "Sim" },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "knowsPark",
    question: "Você sabia que já foi inaugurado o primeiro parque aquático do litoral do Piauí?",
    options: [
      { value: "yes", label: "Sim" },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "blackCardInterest",
    question: "Você gostaria de conhecer o Cartão Black do YAH Aquapark e aproveitar o parque pelos próximos 3 anos?",
    options: [
      { value: "yes", label: "Sim, quero saber mais" },
      { value: "not_now", label: "Não no momento" },
    ],
  },
] as const;

export const yahSourceKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;

export const yahContactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "Informe um nome com até 120 caracteres."),
  whatsapp: z
    .string()
    .trim()
    .max(30, "Informe um WhatsApp válido.")
    .refine((value) => value.replace(/\D/g, "").length >= 8, "Informe um WhatsApp válido."),
  consent: z.literal(true, { error: "Confirme o uso dos seus dados para enviar a pesquisa." }),
});

export const yahSurveySchema = z.object({
  sescCard: z.enum(["yes", "no"]),
  knowsPark: z.enum(["yes", "no"]),
  blackCardInterest: z.enum(["yes", "not_now"]),
  ...yahContactSchema.shape,
  source: z.object(
    Object.fromEntries(yahSourceKeys.map((key) => [key, z.string().trim().max(500).optional()])),
  ).optional(),
});

export type YahSurveyPayload = z.infer<typeof yahSurveySchema>;

export type StoredYahResponse = Omit<YahSurveyPayload, "consent"> & {
  id: string;
  createdAt: string;
  consent: boolean;
};

export type YahAnswerBreakdown = {
  value: string;
  label: string;
  responses: number;
  share: number;
};

export type YahDashboardData = {
  responses: StoredYahResponse[];
  total: number;
  today: number;
  interested: number;
  interestRate: number;
  trackedResponses: number;
  breakdowns: Record<(typeof yahQuestions)[number]["id"], YahAnswerBreakdown[]>;
};

function percentage(value: number, total: number) {
  return total ? Math.round((value / total) * 1_000) / 10 : 0;
}
export function buildYahDashboardData(responses: StoredYahResponse[]): YahDashboardData {
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" });
  const total = responses.length;
  const interested = responses.filter((response) => response.blackCardInterest === "yes").length;
  const trackedResponses = responses.filter((response) =>
    Boolean(response.source?.utm_source || response.source?.utm_campaign || response.source?.utm_content || response.source?.fbclid),
  ).length;

  const breakdowns = Object.fromEntries(
    yahQuestions.map((question) => [
      question.id,
      question.options.map((option) => {
        const count = responses.filter((response) => response[question.id] === option.value).length;
        return { value: option.value, label: option.label, responses: count, share: percentage(count, total) };
      }),
    ]),
  ) as YahDashboardData["breakdowns"];

  return {
    responses,
    total,
    today: responses.filter(
      (response) => new Date(response.createdAt).toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" }) === todayKey,
    ).length,
    interested,
    interestRate: percentage(interested, total),
    trackedResponses,
    breakdowns,
  };
}
