import { NotificationsList } from "@/components/notifications/notifications-list";

export default function NotificacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Notificações
        </h1>
        <p className="text-sm text-muted-foreground">
          Central de alertas em tempo real (dados de demonstração)
        </p>
      </div>
      <NotificationsList />
    </div>
  );
}
