import { createClient } from "@/lib/supabase/server";
import { ReportsPanel } from "@/components/reports/reports-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RelatoriosPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from("cultural_assets")
    .select("status");

  const total = assets?.length ?? 0;
  const seguros = assets?.filter((a) => a.status === "seguro").length ?? 0;
  const emAlerta = assets?.filter((a) => a.status === "alerta").length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Resumo do acervo e exportação de relatórios
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo Consolidado</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">{total}</p>
            <p className="text-xs text-muted-foreground">Total de bens</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-700">
              {seguros}
            </p>
            <p className="text-xs text-muted-foreground">Seguros</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-red-700">{emAlerta}</p>
            <p className="text-xs text-muted-foreground">Em alerta</p>
          </div>
        </CardContent>
      </Card>

      <ReportsPanel />
    </div>
  );
}
