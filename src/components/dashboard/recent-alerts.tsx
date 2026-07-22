import { AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface RecentAlert {
  id: string;
  title: string;
  message: string | null;
  priority: string;
  createdAt: string;
}

export function RecentAlerts({ alerts }: { alerts: RecentAlert[] }) {
  if (alerts.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhum alerta recente.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {alerts.map((alert) => (
        <li key={alert.id} className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-medium leading-tight">{alert.title}</p>
            {alert.message && (
              <p className="text-xs text-muted-foreground">{alert.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(alert.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
