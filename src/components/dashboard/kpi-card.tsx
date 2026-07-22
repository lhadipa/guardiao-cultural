import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm ring-1 ring-foreground/5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            tone === "success" && "bg-emerald-100 text-emerald-700",
            tone === "warning" && "bg-red-100 text-red-700",
            tone === "default" && "bg-amber-100 text-amber-700"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-heading mt-2 text-3xl font-semibold tracking-tight">
        {value}
      </p>
      {hint && (
        <p
          className={cn(
            "mt-1 text-xs",
            tone === "warning" ? "text-red-600" : "text-muted-foreground"
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
