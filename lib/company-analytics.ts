function companyKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

export type CompanyMentionSummary = {
  name: string;
  mentions: number;
  respondents: number;
};

export function summarizeCompanyMentions(respondentMentions: string[][]): CompanyMentionSummary[] {
  const counts = new Map<string, CompanyMentionSummary>();

  for (const mentions of respondentMentions) {
    const seenByRespondent = new Set<string>();
    for (const rawName of mentions) {
      const normalized = companyKey(rawName);
      if (!normalized) continue;
      const current = counts.get(normalized) ?? { name: rawName.trim(), mentions: 0, respondents: 0 };
      current.mentions += 1;
      if (!seenByRespondent.has(normalized)) current.respondents += 1;
      counts.set(normalized, current);
      seenByRespondent.add(normalized);
    }
  }

  return [...counts.values()].sort(
    (a, b) => b.mentions - a.mentions || b.respondents - a.respondents || a.name.localeCompare(b.name, "pt-BR"),
  );
}
