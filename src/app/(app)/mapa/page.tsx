import { createClient } from "@/lib/supabase/server";
import { MapView } from "@/components/map/map-view";

export default async function MapaPage() {
  const supabase = await createClient();

  const { data: assets } = await supabase
    .from("cultural_assets")
    .select("id, name, rgc_code, status, latitude, longitude");

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Mapa & Geofencing
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitoramento geográfico dos bens cadastrados. O círculo ao redor de
          cada bem representa a zona de segurança (ilustrativa).
        </p>
      </div>
      <div className="h-[560px] overflow-hidden rounded-lg border">
        <MapView
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
    </div>
  );
}
