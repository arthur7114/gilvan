import type { SurveySlug } from "./campaigns.ts";

export const telemetryEventNames = [
  "survey_view",
  "survey_start",
  "step_view",
  "step_complete",
  "step_back",
  "validation_error",
  "add_company",
  "submit_attempt",
  "submit_success",
  "submit_error",
] as const;

export type TelemetryEventName = (typeof telemetryEventNames)[number];

export const telemetryFieldIds = ["identity0", "postcardCompany", "name", "whatsapp", "email", "consent", "form"] as const;
export const telemetryErrorCodes = ["required", "invalid_phone", "invalid_email", "consent_required", "submit_failed"] as const;
export const telemetryDeviceClasses = ["mobile", "tablet", "desktop"] as const;
export const telemetrySourceKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type TelemetryFieldId = (typeof telemetryFieldIds)[number];
export type TelemetryErrorCode = (typeof telemetryErrorCodes)[number];
export type TelemetryDeviceClass = (typeof telemetryDeviceClasses)[number];
export type TelemetrySource = Partial<Record<(typeof telemetrySourceKeys)[number], string>>;

export type SurveyEventRecord = {
  surveySlug: SurveySlug;
  sessionId: string;
  eventName: TelemetryEventName;
  occurredAt: string;
  step?: number | null;
  fieldId?: TelemetryFieldId | null;
  errorCode?: TelemetryErrorCode | null;
  durationMs?: number | null;
  deviceClass?: TelemetryDeviceClass | null;
  source?: TelemetrySource;
};

export type TelemetrySummary = {
  totalSessions: number;
  startedSessions: number;
  completedSessions: number;
  completionRate: number;
  abandonedSessions: number;
  funnel: Array<{
    key: "view" | "start" | "step_1" | "step_2" | "step_3" | "step_4" | "success";
    label: string;
    sessions: number;
    conversionRate: number;
    dropOffRate: number;
  }>;
  stepDurations: Array<{ step: number; medianMs: number; samples: number }>;
  validationErrors: Array<{ fieldId: string; errorCode: string; count: number }>;
};

const ABANDONMENT_WINDOW_MS = 30 * 60 * 1_000;

function percentage(value: number, total: number) {
  return total ? Math.round((value / total) * 1_000) / 10 : 0;
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

export function buildTelemetrySummary(events: SurveyEventRecord[], now = new Date()): TelemetrySummary {
  const sessions = new Map<string, SurveyEventRecord[]>();
  for (const event of events) {
    const current = sessions.get(event.sessionId) ?? [];
    current.push(event);
    sessions.set(event.sessionId, current);
  }

  const stageDefinitions: Array<{
    key: TelemetrySummary["funnel"][number]["key"];
    label: string;
  }> = [
    { key: "view", label: "Visualizações" },
    { key: "start", label: "Inícios" },
    { key: "step_1", label: "Etapa 1 concluída" },
    { key: "step_2", label: "Etapa 2 concluída" },
    { key: "step_3", label: "Etapa 3 concluída" },
    { key: "step_4", label: "Etapa 4 concluída" },
    { key: "success", label: "Participações" },
  ];

  function eventProgress(event: SurveyEventRecord) {
    if (event.eventName === "submit_success") return 6;
    if (event.eventName === "submit_attempt" || event.eventName === "submit_error") return 5;
    if (event.eventName === "step_complete" && event.step) return Math.min(event.step + 1, 5);
    if ((event.eventName === "step_view" || event.eventName === "step_back") && event.step) {
      return event.step === 1 ? 0 : Math.min(event.step, 4);
    }
    if ((event.eventName === "validation_error" || event.eventName === "add_company") && event.step) {
      return Math.max(1, Math.min(event.step, 4));
    }
    return event.eventName === "survey_start" ? 1 : 0;
  }

  const sessionProgress = [...sessions.values()].map((sessionEvents) =>
    Math.max(...sessionEvents.map(eventProgress)),
  );
  const stageCounts = stageDefinitions.map((_, stageIndex) =>
    sessionProgress.filter((progress) => progress >= stageIndex).length,
  );

  const funnel = stageDefinitions.map((stage, index) => ({
    key: stage.key,
    label: stage.label,
    sessions: stageCounts[index],
    conversionRate: percentage(stageCounts[index], stageCounts[0]),
    dropOffRate: index === 0 ? 0 : percentage(Math.max(stageCounts[index - 1] - stageCounts[index], 0), stageCounts[index - 1]),
  }));

  let abandonedSessions = 0;
  for (const sessionEvents of sessions.values()) {
    if (sessionEvents.some((event) => event.eventName === "submit_success")) continue;
    const lastActivity = Math.max(...sessionEvents.map((event) => new Date(event.occurredAt).getTime()));
    if (now.getTime() - lastActivity >= ABANDONMENT_WINDOW_MS) abandonedSessions += 1;
  }

  const stepDurations = [1, 2, 3, 4]
    .map((step) => {
      const durations: number[] = [];
      for (const sessionEvents of sessions.values()) {
        const firstCompletion = sessionEvents
          .filter((event) => event.eventName === "step_complete" && event.step === step && event.durationMs)
          .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())[0];
        if (firstCompletion?.durationMs) durations.push(firstCompletion.durationMs);
      }
      return durations.length ? { step, medianMs: median(durations), samples: durations.length } : null;
    })
    .filter((entry): entry is { step: number; medianMs: number; samples: number } => Boolean(entry));

  const errorCounts = new Map<string, { fieldId: string; errorCode: string; count: number }>();
  for (const event of events) {
    if (event.eventName !== "validation_error") continue;
    const fieldId = event.fieldId || "unknown";
    const errorCode = event.errorCode || "invalid";
    const key = `${fieldId}:${errorCode}`;
    const current = errorCounts.get(key) ?? { fieldId, errorCode, count: 0 };
    current.count += 1;
    errorCounts.set(key, current);
  }

  return {
    totalSessions: stageCounts[0],
    startedSessions: stageCounts[1],
    completedSessions: stageCounts.at(-1) ?? 0,
    completionRate: percentage(stageCounts.at(-1) ?? 0, stageCounts[0]),
    abandonedSessions,
    funnel,
    stepDurations,
    validationErrors: [...errorCounts.values()].sort(
      (a, b) => b.count - a.count || a.fieldId.localeCompare(b.fieldId, "pt-BR"),
    ),
  };
}
