import { isAdmin } from "@/lib/auth";
import { buildDashboardData } from "@/lib/analytics";
import { getPixelId, isDatabaseConfigured, listResponses, listSurveyEvents } from "@/lib/db";
import { activeSurveySlug, campaigns, resolveSurveySlug } from "@/lib/campaigns";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel da pesquisa | Conecta Cidades" };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ survey?: string }> }) {
  if (!(await isAdmin())) return <AdminLogin />;
  const requestedSurvey = (await searchParams).survey;
  const selectedSlug = requestedSurvey ? (resolveSurveySlug(requestedSurvey) ?? activeSurveySlug) : activeSurveySlug;
  const selectedCampaign = campaigns[selectedSlug];
  const databaseConfigured = isDatabaseConfigured();
  const [responses, events, pixelId] = databaseConfigured
    ? await Promise.all([listResponses(selectedSlug), listSurveyEvents(selectedSlug), getPixelId()])
    : [[], [], ""];
  return (
    <AdminDashboard
      data={buildDashboardData(responses, events)}
      pixelId={pixelId}
      databaseConfigured={databaseConfigured}
      selectedCampaign={selectedCampaign}
    />
  );
}
