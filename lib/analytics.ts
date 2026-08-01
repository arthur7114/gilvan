import type { DashboardData, StoredResponse } from "@/lib/types";
import { segments } from "@/lib/types";

function key(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

function rankings(values: string[]) {
  const counts = new Map<string, { name: string; count: number }>();
  values.filter(Boolean).forEach((value) => {
    const normalized = key(value);
    if (!normalized) return;
    const current = counts.get(normalized);
    counts.set(normalized, { name: current?.name ?? value.trim(), count: (current?.count ?? 0) + 1 });
  });
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"))
    .map(({ name, count }) => ({ name, mentions: count }));
}

export function buildDashboardData(responses: StoredResponse[]): DashboardData {
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" });
  const allCompanies: string[] = [];
  const neighborhoods: string[] = [];
  const dailyMap = new Map<string, number>();
  const segmentValues: Record<string, string[]> = Object.fromEntries(segments.map((segment) => [segment, []]));

  for (const response of responses) {
    neighborhoods.push(response.neighborhood);
    response.identityAnswers.forEach(({ answer }) => allCompanies.push(answer));
    allCompanies.push(response.postcardCompany);
    response.segmentAnswers.forEach(({ segment, companies }) => {
      allCompanies.push(...companies);
      if (segmentValues[segment]) segmentValues[segment].push(...companies);
    });
    const day = new Date(response.createdAt).toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" });
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }

  const neighborhoodCounts = new Map<string, { name: string; count: number }>();
  neighborhoods.forEach((name) => {
    const normalized = key(name);
    const current = neighborhoodCounts.get(normalized);
    neighborhoodCounts.set(normalized, { name: current?.name ?? name, count: (current?.count ?? 0) + 1 });
  });

  return {
    responses,
    total: responses.length,
    today: dailyMap.get(todayKey) ?? 0,
    topCompanies: rankings(allCompanies).slice(0, 10),
    neighborhoods: [...neighborhoodCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map(({ name, count }) => ({ name, responses: count })),
    daily: [...dailyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, count]) => ({ date: date.slice(5).split("-").reverse().join("/"), responses: count })),
    segmentLeaders: Object.fromEntries(
      Object.entries(segmentValues).map(([segment, values]) => [segment, rankings(values).slice(0, 5)]),
    ),
  };
}
