import assert from "node:assert/strict";
import test from "node:test";

import { getSurveyConfig, resolveSurveySlug } from "../lib/campaigns.ts";
import { telemetrySchema } from "../lib/validation.ts";

test("Tutóia exposes the campaign copy and city-specific questions", () => {
  const campaign = getSurveyConfig("tutoia");

  assert.equal(campaign.slug, "tutoia");
  assert.equal(campaign.city, "Tutóia");
  assert.equal(campaign.edition, "Edição histórica · rumo aos 89 anos");
  assert.equal(campaign.identityQuestions[0], "Na sua opinião, qual empresa mais representa Tutóia?");
  assert.match(campaign.postcardQuestion, /Cartão-Postal Empresarial de Tutóia/);
});

test("legacy payloads resolve to Cruz das Almas and unknown campaigns are rejected", () => {
  assert.equal(resolveSurveySlug(undefined), "cruz-das-almas");
  assert.equal(resolveSurveySlug("cruz-das-almas"), "cruz-das-almas");
  assert.equal(resolveSurveySlug("tutoia"), "tutoia");
  assert.equal(resolveSurveySlug("cidade-inexistente"), null);
});

test("telemetry accepts only enumerated attribution fields and drops personal data", () => {
  const parsed = telemetrySchema.parse({
    surveySlug: "tutoia",
    sessionId: "9c4fe67c-d930-4cc2-96b0-7b8fbc072302",
    eventName: "survey_view",
    deviceClass: "mobile",
    source: {
      utm_source: "meta",
      utm_content: "criativo-a",
      answer: "conteúdo que nunca deve ser persistido",
      phone: "98999999999",
    },
    name: "Dado pessoal",
  });

  assert.deepEqual(parsed.source, {
    utm_source: "meta",
    utm_content: "criativo-a",
  });
  assert.equal("name" in parsed, false);
});
