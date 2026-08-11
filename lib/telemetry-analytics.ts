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

export type SurveyEventRecord = {
  surveySlug: SurveySlug;
  sessionId: string;
  eventName: TelemetryEventName;
  occurredAt: string;
  step?: number | null;
  fieldId?: string | null;
  errorCode?: string | null;
  durationMs?: number | null;
  deviceClass?: "mobile" | "tablet" | "desktop" | null;
  source?: Record<string, string>;
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
    matches: (event: SurveyEventRecord) => boolean;
  }> = [
    { key: "view", label: "Visualizações", matches: (event: SurveyEventRecord) => event.eventName === "survey_view" },
    { key: "start", label: "Inícios", matches: (event: SurveyEventRecord) => event.eventName === "survey_start" },
    { key: "step_1", label: "Etapa 1 concluída", matches: (event) => event.eventName === "step_complete" && event.step === 1 },
    { key: "step_2", label: "Etapa 2 concluída", matches: (event) => event.eventName === "step_complete" && event.step === 2 },
    { key: "step_3", label: "Etapa 3 concluída", matches: (event) => event.eventName === "step_complete" && event.step === 3 },
    { key: "step_4", label: "Etapa 4 concluída", matches: (event) => event.eventName === "step_complete" && event.step === 4 },
    { key: "success", label: "Participações", matches: (event: SurveyEventRecord) => event.eventName === "submit_success" },
  ];

  const stageCounts = stageDefinitions.map((stage) =>
    [...sessions.values()].filter((sessionEvents) => sessionEvents.some(stage.matches)).length,
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
