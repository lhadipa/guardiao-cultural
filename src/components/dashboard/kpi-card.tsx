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
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon
          className={cn(
            "h-4 w-4",
            tone === "success" && "text-emerald-600",
            tone === "warning" && "text-red-600",
            tone === "default" && "text-primary"
          )}
        />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
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
