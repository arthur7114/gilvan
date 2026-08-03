import { z } from "zod";

const cleanText = z.string().trim().max(180);

export const surveySchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120),
  whatsapp: z.string().trim().min(8, "Informe um WhatsApp válido.").max(30),
  email: z
    .string()
    .trim()
    .max(160)
    .refine((value) => value === "" || /^\S+@\S+\.\S+$/.test(value), "Informe um e-mail válido ou deixe em branco."),
  neighborhood: z.string().trim().max(120),
  identityAnswers: z.array(
    z.object({ question: z.string().trim().max(240), answer: cleanText }),
  ).length(7),
  segmentAnswers: z.array(
    z.object({
      segment: z.string().trim().max(80),
      companies: z.array(cleanText).max(3),
    }),
  ).length(10),
  postcardCompany: z.string().trim().min(2, "Informe a empresa escolhida.").max(180),
  postcardReason: z.string().trim().max(1200),
  consent: z.literal(true, { error: "É necessário aceitar o uso dos dados para participar." }),
  source: z.record(z.string(), z.string().max(500)).optional(),
});

export const pixelSchema = z.object({
  pixelId: z.string().trim().regex(/^\d{5,30}$/, "Informe somente os números do Pixel."),
});
