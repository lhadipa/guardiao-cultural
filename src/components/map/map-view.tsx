"use client";

import dynamic from "next/dynamic";
import type { MapAsset } from "./leaflet-map";

const LeafletMap = dynamic(
  () => import("./leaflet-map").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Carregando mapa...
      </div>
    ),
  }
);

export function MapView({ assets }: { assets: MapAsset[] }) {
  return <LeafletMap assets={assets} />;
}
