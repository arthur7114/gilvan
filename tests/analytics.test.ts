import assert from "node:assert/strict";
import test from "node:test";

import { summarizeCompanyMentions } from "../lib/company-analytics.ts";
import { buildTelemetrySummary, type SurveyEventRecord } from "../lib/telemetry-analytics.ts";

test("company rankings separate total mentions from unique respondents", () => {
  const summary = summarizeCompanyMentions([
    ["Cofel", "Cofel", "Parati"],
    ["cofél", "Nacional"],
    ["Parati"],
  ]);

  assert.deepEqual(summary.slice(0, 2), [
    { name: "Cofel", mentions: 3, respondents: 2 },
    { name: "Parati", mentions: 2, respondents: 2 },
  ]);
});

test("telemetry summary counts distinct sessions and excludes active sessions from abandonment", () => {
  const now = new Date("2026-08-10T15:00:00.000Z");
  const event = (
    sessionId: string,
    eventName: SurveyEventRecord["eventName"],
    occurredAt: string,
    extra: Partial<SurveyEventRecord> = {},
  ): SurveyEventRecord => ({ sessionId, eventName, occurredAt, surveySlug: "tutoia", ...extra });

  const events: SurveyEventRecord[] = [
    event("complete", "survey_view", "2026-08-10T12:00:00.000Z"),
    event("complete", "survey_start", "2026-08-10T12:01:00.000Z"),
    ...[1, 2, 3, 4].map((step) =>
      event("complete", "step_complete", `2026-08-10T12:0${step + 1}:00.000Z`, {
        step,
        durationMs: step * 1_000,
      }),
    ),
    event("complete", "submit_success", "2026-08-10T12:07:00.000Z"),
    event("abandoned", "survey_view", "2026-08-10T13:00:00.000Z"),
    event("abandoned", "survey_start", "2026-08-10T13:01:00.000Z"),
    event("abandoned", "step_complete", "2026-08-10T13:02:00.000Z", { step: 1, durationMs: 2_000 }),
    event("abandoned", "validation_error", "2026-08-10T13:03:00.000Z", {
      step: 2,
      fieldId: "postcardCompany",
      errorCode: "required",
    }),
    event("active", "survey_view", "2026-08-10T14:45:00.000Z"),
  ];

  const summary = buildTelemetrySummary(events, now);

  assert.deepEqual(
    summary.funnel.map(({ key, sessions }) => ({ key, sessions })),
    [
      { key: "view", sessions: 3 },
      { key: "start", sessions: 2 },
      { key: "step_1", sessions: 2 },
      { key: "step_2", sessions: 1 },
      { key: "step_3", sessions: 1 },
      { key: "step_4", sessions: 1 },
      { key: "success", sessions: 1 },
    ],
  );
  assert.equal(summary.abandonedSessions, 1);
  assert.deepEqual(summary.stepDurations[0], { step: 1, medianMs: 1_500, samples: 2 });
  assert.deepEqual(summary.validationErrors[0], {
    fieldId: "postcardCompany",
    errorCode: "required",
    count: 1,
  });
});

test("telemetry infers prior funnel stages when asynchronous events are lost", () => {
  const events: SurveyEventRecord[] = [
    {
      sessionId: "partial",
      eventName: "step_complete",
      occurredAt: "2026-08-10T12:00:00.000Z",
      surveySlug: "tutoia",
      step: 3,
      durationMs: 2_000,
    },
    {
      sessionId: "success-only",
      eventName: "submit_success",
      occurredAt: "2026-08-10T12:05:00.000Z",
      surveySlug: "tutoia",
      step: 4,
    },
  ];

  const summary = buildTelemetrySummary(events, new Date("2026-08-10T12:10:00.000Z"));

  assert.deepEqual(summary.funnel.map(({ sessions }) => sessions), [2, 2, 2, 2, 2, 1, 1]);
  assert.ok(summary.funnel.every((stage, index, funnel) => index === 0 || stage.sessions <= funnel[index - 1].sessions));
});
