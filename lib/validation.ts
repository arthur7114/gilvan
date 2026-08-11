import { z } from "zod";
import { surveySlugs } from "./campaigns.ts";
import { telemetryEventNames } from "./telemetry-analytics.ts";

const cleanText = z.string().trim().max(180);

export const surveySchema = z.object({
  surveySlug: z.enum(surveySlugs),
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

export const telemetrySchema = z.object({
  surveySlug: z.enum(surveySlugs),
  sessionId: z.uuid(),
  eventName: z.enum(telemetryEventNames),
  step: z.number().int().min(1).max(4).nullable().optional(),
  fieldId: z
    .enum(["identity0", "postcardCompany", "name", "whatsapp", "email", "consent", "form"])
    .nullable()
    .optional(),
  errorCode: z
    .enum(["required", "invalid_phone", "invalid_email", "consent_required", "submit_failed"])
    .nullable()
    .optional(),
  durationMs: z.number().int().min(0).max(3 * 60 * 60 * 1000).nullable().optional(),
  deviceClass: z.enum(["mobile", "tablet", "desktop"]).nullable().optional(),
  source: z.object({
    utm_source: z.string().max(500).optional(),
    utm_medium: z.string().max(500).optional(),
    utm_campaign: z.string().max(500).optional(),
    utm_content: z.string().max(500).optional(),
    utm_term: z.string().max(500).optional(),
    fbclid: z.string().max(500).optional(),
  }).optional(),
});

export const pixelSchema = z.object({
  pixelId: z.string().trim().regex(/^\d{5,30}$/, "Informe somente os números do Pixel."),
});
