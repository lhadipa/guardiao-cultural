import { cn } from "@/lib/utils";

export function RgcBadge({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-secondary-foreground",
        className
      )}
    >
      {code}
    </span>
  );
}
