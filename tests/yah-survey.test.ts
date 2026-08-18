import assert from "node:assert/strict";
import test from "node:test";

import { buildYahDashboardData, yahPrizeOffer, yahSurveySchema, type StoredYahResponse } from "../lib/yah-survey.ts";

test("YAH offer includes every announced prize", () => {
  assert.deepEqual(yahPrizeOffer.prizes.map((prize) => prize.name), [
    "Cartão Black do YAH Aquapark",
    "iPhone 17",
    "Passagem internacional",
  ]);
});

test("YAH survey requires exactly one valid answer for each question", () => {
  const parsed = yahSurveySchema.parse({
    sescCard: "yes",
    knowsPark: "no",
    blackCardInterest: "yes",
    name: "Maria da Silva",
    whatsapp: "(86) 99999-9999",
    neighborhood: "Centro",
    profession: "Professora",
    incomeRange: "2_to_5",
    consent: true,
    source: { utm_source: "meta", unexpected: "discarded" },
  });

  assert.deepEqual(parsed, {
    sescCard: "yes",
    knowsPark: "no",
    blackCardInterest: "yes",
    name: "Maria da Silva",
    whatsapp: "(86) 99999-9999",
    neighborhood: "Centro",
    profession: "Professora",
    incomeRange: "2_to_5",
    consent: true,
    source: { utm_source: "meta" },
  });
  assert.equal(yahSurveySchema.safeParse({ sescCard: "yes", knowsPark: "no" }).success, false);
});

test("YAH survey keeps the contact details of participants who consent", () => {
  const parsed = yahSurveySchema.parse({
    sescCard: "yes",
    knowsPark: "yes",
    blackCardInterest: "yes",
    name: "Maria da Silva",
    whatsapp: "(86) 99999-9999",
    neighborhood: "Centro",
    profession: "Professora",
    incomeRange: "2_to_5",
    consent: true,
  });

  assert.equal(parsed.name, "Maria da Silva");
  assert.equal(parsed.whatsapp, "(86) 99999-9999");
  assert.equal(parsed.neighborhood, "Centro");
  assert.equal(parsed.profession, "Professora");
  assert.equal(parsed.incomeRange, "2_to_5");
  assert.equal(parsed.consent, true);
});

test("YAH survey rejects missing profile details and unknown income ranges", () => {
  const participant = {
    sescCard: "yes",
    knowsPark: "yes",
    blackCardInterest: "yes",
    name: "Maria da Silva",
    whatsapp: "86999999999",
    neighborhood: "Centro",
    profession: "Professora",
    consent: true,
  } as const;

  assert.equal(yahSurveySchema.safeParse({ ...participant, incomeRange: "2_to_5" }).success, true);
  assert.equal(yahSurveySchema.safeParse({ ...participant, profession: "", incomeRange: "2_to_5" }).success, false);
  assert.equal(yahSurveySchema.safeParse({ ...participant, incomeRange: "unknown" }).success, false);
});

test("YAH survey rejects invalid WhatsApp numbers and missing consent", () => {
  const answers = {
    sescCard: "yes",
    knowsPark: "yes",
    blackCardInterest: "yes",
    name: "Maria da Silva",
    neighborhood: "Centro",
    profession: "Professora",
    incomeRange: "2_to_5",
  } as const;

  assert.equal(yahSurveySchema.safeParse({ ...answers, whatsapp: "abcdefgh", consent: true }).success, false);
  assert.equal(yahSurveySchema.safeParse({ ...answers, whatsapp: "86999999999" }).success, false);
});

test("YAH dashboard summarizes Black Card interest and each answer", () => {
  const response = (id: string, blackCardInterest: "yes" | "not_now"): StoredYahResponse => ({
    id,
    createdAt: new Date().toISOString(),
    sescCard: id === "1" ? "yes" : "no",
    knowsPark: "yes",
    blackCardInterest,
    name: `Participante ${id}`,
    whatsapp: `8699999999${id}`,
    neighborhood: "Centro",
    profession: "Professora",
    incomeRange: "2_to_5",
    consent: true,
    source: id === "1" ? { utm_campaign: "black-card" } : {},
  });
  const data = buildYahDashboardData([response("1", "yes"), response("2", "not_now")]);

  assert.equal(data.total, 2);
  assert.equal(data.interested, 1);
  assert.equal(data.interestRate, 50);
  assert.equal(data.trackedResponses, 1);
  assert.deepEqual(data.breakdowns.sescCard.map(({ responses }) => responses), [1, 1]);
});
