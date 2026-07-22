"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export interface MapAsset {
  id: string;
  name: string;
  rgcCode: string;
  status: "seguro" | "alerta";
  latitude: number;
  longitude: number;
}

const SAFETY_RADIUS_METERS = 250;

function buildIcon(status: MapAsset["status"]) {
  const Icon = status === "alerta" ? AlertTriangle : ShieldCheck;
  const color = status === "alerta" ? "#dc2626" : "#065f46";

  const html = renderToStaticMarkup(
    <div
      style={{
        background: color,
        borderRadius: "9999px",
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}
    >
      <Icon color="white" size={16} />
    </div>
  );

  return L.divIcon({
    html,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function LeafletMap({ assets }: { assets: MapAsset[] }) {
  const center = useMemo<[number, number]>(() => {
    if (assets.length === 0) return [-18.5122, -44.555]; // centro aprox. de MG
    return [assets[0].latitude, assets[0].longitude];
  }, [assets]);

  return (
    <MapContainer
      center={center}
      zoom={assets.length > 0 ? 7 : 6}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {assets.map((asset) => (
        <React.Fragment key={asset.id}>
          <Marker
            position={[asset.latitude, asset.longitude]}
            icon={buildIcon(asset.status)}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-medium">{asset.name}</p>
                <p className="text-xs text-muted-foreground">
                  {asset.rgcCode}
                </p>
                <Link
                  href={`/bens/${asset.id}`}
                  className="text-xs text-primary underline"
                >
                  Ver detalhes
                </Link>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[asset.latitude, asset.longitude]}
            radius={SAFETY_RADIUS_METERS}
            pathOptions={{
              color: asset.status === "alerta" ? "#dc2626" : "#d97706",
              fillOpacity: 0.08,
            }}
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
}
