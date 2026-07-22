import { createClient } from "@/lib/supabase/server";
import { GeofenceMap } from "@/components/map/geofence-map";

export default async function MapaPage() {
  const supabase = await createClient();

  const { data: assets } = await supabase
    .from("cultural_assets")
    .select("id, name, rgc_code, status, latitude, longitude");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Mapa & Geofencing
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitoramento geográfico em tempo real dos bens culturais
        </p>
      </div>
      <GeofenceMap
        assets={(assets ?? []).map((a) => ({
          id: a.id,
          name: a.name,
          rgcCode: a.rgc_code,
          status: a.status,
          latitude: a.latitude,
          longitude: a.longitude,
        }))}
      />
    </div>
  );
}
