import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssetStatus } from "@/types/database.types";

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const isSafe = status === "seguro";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isSafe
          ? "bg-emerald-100 text-emerald-800"
          : "bg-red-100 text-red-800"
      )}
    >
      {isSafe ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      {isSafe ? "Seguro" : "Alerta ativo"}
    </span>
  );
}
