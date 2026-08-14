import assert from "node:assert/strict";
import test from "node:test";

import { buildYahDashboardData, yahSurveySchema, type StoredYahResponse } from "../lib/yah-survey.ts";

test("YAH survey requires exactly one valid answer for each question", () => {
  const parsed = yahSurveySchema.parse({
    sescCard: "yes",
    knowsPark: "no",
    blackCardInterest: "yes",
    source: { utm_source: "meta", unexpected: "discarded" },
  });

  assert.deepEqual(parsed, {
    sescCard: "yes",
    knowsPark: "no",
    blackCardInterest: "yes",
    source: { utm_source: "meta" },
  });
  assert.equal(yahSurveySchema.safeParse({ sescCard: "yes", knowsPark: "no" }).success, false);
});

test("YAH dashboard summarizes Black Card interest and each answer", () => {
  const response = (id: string, blackCardInterest: "yes" | "not_now"): StoredYahResponse => ({
    id,
    createdAt: new Date().toISOString(),
    sescCard: id === "1" ? "yes" : "no",
    knowsPark: "yes",
    blackCardInterest,
    source: id === "1" ? { utm_campaign: "black-card" } : {},
  });
  const data = buildYahDashboardData([response("1", "yes"), response("2", "not_now")]);

  assert.equal(data.total, 2);
  assert.equal(data.interested, 1);
  assert.equal(data.interestRate, 50);
  assert.equal(data.trackedResponses, 1);
  assert.deepEqual(data.breakdowns.sescCard.map(({ responses }) => responses), [1, 1]);
});
