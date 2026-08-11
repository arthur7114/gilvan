import type { SurveySlug } from "./campaigns.ts";
import type { TelemetrySummary } from "./telemetry-analytics.ts";

export { segments } from "./campaigns.ts";

export type IdentityAnswer = { question: string; answer: string };
export type SegmentAnswer = { segment: string; companies: string[] };

export type SurveyPayload = {
  surveySlug: SurveySlug;
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
  trackedResponses: number;
  metaLeads: number;
  topCompanies: Array<{ name: string; mentions: number; respondents: number }>;
  postcardLeaders: Array<{ name: string; mentions: number; respondents: number }>;
  neighborhoods: Array<{ name: string; responses: number }>;
  daily: Array<{ date: string; responses: number }>;
  segmentLeaders: Record<string, Array<{ name: string; mentions: number; respondents: number }>>;
  channels: Array<{ name: string; leads: number; share: number }>;
  campaigns: Array<{ name: string; leads: number; share: number }>;
  creatives: Array<{ name: string; leads: number; share: number }>;
  telemetry: TelemetrySummary;
};
