import { isAdmin } from "@/lib/auth";
import { buildDashboardData } from "@/lib/analytics";
import { getPixelId, isDatabaseConfigured, listResponses } from "@/lib/db";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel da pesquisa | Conecta Cidades" };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  const [responses, pixelId] = await Promise.all([listResponses(), getPixelId()]);
  return <AdminDashboard data={buildDashboardData(responses)} pixelId={pixelId} databaseConfigured={isDatabaseConfigured()} />;
}
