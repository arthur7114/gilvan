import { AdminLogin } from "@/components/admin-login";
import { YahAdminDashboard } from "@/components/yah-admin-dashboard";
import { isAdmin } from "@/lib/auth";
import { isDatabaseConfigured, listYahResponses } from "@/lib/db";
import { buildYahDashboardData } from "@/lib/yah-survey";

export const dynamic = "force-dynamic";
export const metadata = { title: "YAH Aquapark | Painel da pesquisa" };

export default async function YahAdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  const databaseConfigured = isDatabaseConfigured();
  const responses = await listYahResponses();
  return <YahAdminDashboard data={buildYahDashboardData(responses)} databaseConfigured={databaseConfigured} />;
}
