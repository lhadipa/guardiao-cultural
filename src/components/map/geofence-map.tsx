"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Navigation,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GeofenceAsset {
  id: string;
  name: string;
  rgcCode: string;
  status: "seguro" | "alerta";
  latitude: number;
  longitude: number;
}

export function GeofenceMap({ assets }: { assets: GeofenceAsset[] }) {
  const [showFences, setShowFences] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = assets.find((a) => a.id === selectedId) ?? null;
  const totalSeguros = assets.filter((a) => a.status === "seguro").length;
  const alertas = assets.filter((a) => a.status === "alerta");

  const bounds = useMemo(() => {
    if (assets.length === 0) {
      return { minLat: -1, maxLat: 1, minLon: -1, maxLon: 1 };
    }
    const lats = assets.map((a) => a.latitude);
    const lons = assets.map((a) => a.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    // evita divisão por zero quando só há 1 bem ou todos na mesma coordenada
    return {
      minLat: minLat === maxLat ? minLat - 0.01 : minLat,
      maxLat: minLat === maxLat ? maxLat + 0.01 : maxLat,
      minLon: minLon === maxLon ? minLon - 0.01 : minLon,
      maxLon: minLon === maxLon ? maxLon + 0.01 : maxLon,
    };
  }, [assets]);

  const centroid = useMemo(() => {
    if (assets.length === 0) return { lat: 0, lon: 0 };
    const lat =
      assets.reduce((sum, a) => sum + a.latitude, 0) / assets.length;
    const lon =
      assets.reduce((sum, a) => sum + a.longitude, 0) / assets.length;
    return { lat, lon };
  }, [assets]);

  function position(asset: GeofenceAsset) {
    const xRatio =
      bounds.maxLon > bounds.minLon
        ? (asset.longitude - bounds.minLon) / (bounds.maxLon - bounds.minLon)
        : 0.5;
    const yRatio =
      bounds.maxLat > bounds.minLat
        ? (asset.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)
        : 0.5;
    return {
      left: `${12 + xRatio * 76}%`,
      top: `${12 + (1 - yRatio) * 76}%`,
    };
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showFences}
            onChange={(e) => setShowFences(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Exibir cercas de segurança
        </label>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-3 w-3 rounded-full border-2 border-muted-foreground/50" />
          Círculo = raio de segurança configurado
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="relative h-[480px] overflow-hidden rounded-lg border bg-gradient-to-br from-lime-50 to-emerald-50 shadow-sm">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(120,113,108,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,113,108,0.15) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="absolute left-3 top-3 rounded-md bg-card px-3 py-1.5 text-xs font-medium shadow-sm">
            {centroid.lat.toFixed(4)}, {centroid.lon.toFixed(4)}
          </div>

          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-card shadow-sm hover:bg-muted"
              aria-label="Centralizar"
            >
              <Navigation className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-card shadow-sm hover:bg-muted"
              aria-label="Expandir"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>

          {assets.map((asset) => {
            const pos = position(asset);
            const isSafe = asset.status === "seguro";
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedId(asset.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={pos}
                title={asset.name}
              >
                {showFences && (
                  <span
                    className={cn(
                      "absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
                      isSafe
                        ? "border-emerald-400/60 bg-emerald-400/10"
                        : "border-red-400/60 bg-red-400/10"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition-transform hover:scale-110",
                    isSafe ? "bg-emerald-500" : "bg-red-500",
                    selectedId === asset.id && "scale-110 ring-4"
                  )}
                >
                  {isSafe ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </span>
              </button>
            );
          })}

          <div className="absolute bottom-3 left-3 space-y-1.5 rounded-md bg-card p-3 text-xs shadow-sm">
            <p className="mb-1 font-medium">Legenda</p>
            <p className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Bem
              seguro
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Bem em
              alerta
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-muted-foreground/50" />
              Cerca de segurança
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="font-heading mb-3 font-medium">Monitoramento</p>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total de bens</dt>
                <dd className="font-semibold">{assets.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Bens seguros</dt>
                <dd className="font-semibold text-emerald-600">
                  {totalSeguros}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Alertas ativos</dt>
                <dd className="font-semibold text-red-600">
                  {alertas.length}
                </dd>
              </div>
            </dl>
          </div>

          {selected ? (
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <p className="font-heading font-medium">{selected.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {selected.rgcCode}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  selected.status === "seguro"
                    ? "text-emerald-600"
                    : "text-red-600"
                )}
              >
                {selected.status === "seguro" ? "Seguro" : "Em alerta"}
              </p>
              <Link
                href={`/bens/${selected.id}`}
                className="mt-2 inline-block text-sm text-primary underline"
              >
                Ver detalhes
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-8 text-center shadow-sm">
              <MapPin className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Selecione um bem no mapa para ver os detalhes
              </p>
            </div>
          )}

          {alertas.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
              <p className="mb-2 flex items-center gap-1.5 font-medium text-red-800">
                <AlertTriangle className="h-4 w-4" /> Alertas Ativos
              </p>
              <ul className="space-y-2">
                {alertas.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-md bg-card p-2 text-sm shadow-sm"
                  >
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Movimentação detectada fora da zona
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="mb-1 flex items-center gap-1.5 font-heading font-medium text-amber-800">
          <span className="h-2 w-2 rounded-full border-2 border-amber-600" />
          Como funciona o Geofencing
        </p>
        <p className="text-sm text-amber-900">
          Cada bem cultural possui uma &quot;cerca geográfica digital&quot;
          definida por um raio de segurança ao redor de sua localização
          oficial.
        </p>
        <p className="mt-2 text-sm text-amber-900">
          Quando o sistema detecta movimentação fora deste perímetro, alertas
          automáticos são acionados imediatamente, permitindo intervenção
          preventiva antes de possível furto ou deslocamento irregular.
        </p>
      </div>
    </div>
  );
}
