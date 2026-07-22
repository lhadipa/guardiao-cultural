import { Landmark, ShieldCheck, AlertTriangle, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { ConservationBarChart } from "@/components/dashboard/conservation-bar-chart";
import { RegistrationsLineChart } from "@/components/dashboard/registrations-line-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { CONSERVATION_STATUSES } from "@/lib/validations/asset";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: assets } = await supabase
    .from("cultural_assets")
    .select("category, conservation_status, status, created_at");

  const { data: alerts } = await supabase
    .from("alerts")
    .select("id, title, message, priority, created_at, is_read")
    .order("created_at", { ascending: false })
    .limit(5);

  const total = assets?.length ?? 0;
  const seguros = assets?.filter((a) => a.status === "seguro").length ?? 0;
  const emAlerta = assets?.filter((a) => a.status === "alerta").length ?? 0;
  const alertasAtivos = alerts?.filter((a) => !a.is_read).length ?? 0;

  const categoryData = Object.entries(
    (assets ?? []).reduce<Record<string, number>>((acc, asset) => {
      acc[asset.category] = (acc[asset.category] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const conservationData = CONSERVATION_STATUSES.map((status) => ({
    name: status.label,
    total:
      assets?.filter((a) => a.conservation_status === status.value).length ??
      0,
  }));

  const monthlyRegistrations = Object.entries(
    (assets ?? []).reduce<Record<string, number>>((acc, asset) => {
      const month = new Date(asset.created_at).toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      });
      acc[month] = (acc[month] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([month, total]) => ({ month, total }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Painel de Controle — Proteção ao Patrimônio
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total de Bens" value={total} icon={Landmark} />
        <KpiCard
          label="Bens Seguros"
          value={seguros}
          hint={total > 0 ? `${Math.round((seguros / total) * 100)}% do total` : undefined}
          icon={ShieldCheck}
          tone="success"
        />
        <KpiCard
          label="Em Alerta"
          value={emAlerta}
          hint={emAlerta > 0 ? "Requer atenção" : undefined}
          icon={AlertTriangle}
          tone="warning"
        />
        <KpiCard
          label="Alertas Ativos"
          value={alertasAtivos}
          hint="Últimas 24h"
          icon={Bell}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bens por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de Conservação</CardTitle>
          </CardHeader>
          <CardContent>
            <ConservationBarChart data={conservationData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução de Cadastros</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistrationsLineChart data={monthlyRegistrations} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentAlerts
            alerts={(alerts ?? []).map((a) => ({
              id: a.id,
              title: a.title,
              message: a.message,
              priority: a.priority,
              createdAt: a.created_at,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
