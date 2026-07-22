"use client";

import { useState } from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MOCK_NOTIFICATIONS,
  type NotificationPriority,
} from "@/lib/mock-data/notifications";

const PRIORITY_CONFIG: Record<
  NotificationPriority,
  { label: string; icon: typeof AlertTriangle; className: string }
> = {
  alerta: {
    label: "Alerta",
    icon: AlertTriangle,
    className: "bg-red-100 text-red-800",
  },
  aviso: {
    label: "Aviso",
    icon: AlertCircle,
    className: "bg-amber-100 text-amber-800",
  },
  info: {
    label: "Info",
    icon: Info,
    className: "bg-secondary text-secondary-foreground",
  },
};

export function NotificationsList() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationPriority | "todas">(
    "todas"
  );

  const filtered = notifications.filter(
    (n) => filter === "todas" || n.priority === filter
  );

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["todas", "alerta", "aviso", "info"] as const).map((option) => (
            <Button
              key={option}
              size="sm"
              variant={filter === option ? "default" : "outline"}
              onClick={() => setFilter(option)}
              className="capitalize"
            >
              {option}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={markAllAsRead}>
          Marcar todas como lidas
        </Button>
      </div>

      <ul className="divide-y rounded-lg border bg-card">
        {filtered.map((notification) => {
          const config = PRIORITY_CONFIG[notification.priority];
          const Icon = config.icon;
          return (
            <li
              key={notification.id}
              className={cn(
                "flex items-start gap-3 p-4",
                !notification.isRead && "bg-muted/40"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  config.className
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.assetName} ·{" "}
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              {!notification.isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => markAsRead(notification.id)}
                >
                  Marcar como lida
                </Button>
              )}
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma notificação nessa categoria.
          </li>
        )}
      </ul>
    </div>
  );
}
