"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Preference {
  key: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

const PREFERENCES: Preference[] = [
  {
    key: "email-alerts",
    label: "Notificações por e-mail",
    description: "Receber alertas de segurança por e-mail",
    defaultChecked: true,
  },
  {
    key: "geofence-strict",
    label: "Geofencing rigoroso",
    description: "Reduzir o raio da zona de segurança padrão",
    defaultChecked: false,
  },
  {
    key: "weekly-report",
    label: "Relatório semanal automático",
    description: "Enviar resumo do acervo toda semana",
    defaultChecked: true,
  },
];

export function PreferencesToggles() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFERENCES.map((p) => [p.key, p.defaultChecked]))
  );

  return (
    <div className="divide-y rounded-lg border bg-card">
      {PREFERENCES.map((pref) => (
        <div
          key={pref.key}
          className="flex items-center justify-between gap-4 p-4"
        >
          <div>
            <p className="text-sm font-medium">{pref.label}</p>
            <p className="text-xs text-muted-foreground">
              {pref.description}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state[pref.key]}
            onClick={() =>
              setState((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))
            }
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              state[pref.key] ? "bg-primary" : "bg-muted-foreground/30"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                state[pref.key] ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      ))}
      <p className="p-3 text-xs text-muted-foreground">
        Preferências não persistidas — apenas demonstrativas nesta versão.
      </p>
    </div>
  );
}
