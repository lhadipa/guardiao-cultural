"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileDown, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ASSET_CATEGORIES } from "@/lib/validations/asset";

export function ReportsPanel() {
  const [category, setCategory] = useState("todas");
  const [period, setPeriod] = useState("30d");
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

  async function handleExport(format: "pdf" | "excel") {
    setExporting(format);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setExporting(null);
    toast.success(
      `Relatório em ${format.toUpperCase()} gerado (simulação de exportação)`
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gerar Relatório</CardTitle>
        <CardDescription>
          Exportação simulada — nenhum arquivo é gerado de verdade nesta
          versão.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-9 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="todas">Todas as categorias</option>
              {ASSET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="flex h-9 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="all">Todo o período</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
          >
            {exporting === "pdf" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("excel")}
            disabled={exporting !== null}
          >
            {exporting === "excel" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            Exportar Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
