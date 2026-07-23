import Image from "next/image";
import { MapPin, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RgcBadge } from "@/components/assets/rgc-badge";
import { AssetStatusBadge } from "@/components/assets/asset-status-badge";
import { getAssetPhotoUrl } from "@/lib/storage";
import { MuseumFilter } from "@/components/admin/museum-filter";

export default async function AdminBensPage({
  searchParams,
}: {
  searchParams: Promise<{ museumId?: string }>;
}) {
  const { museumId } = await searchParams;
  const supabase = await createClient();

  const { data: museums } = await supabase
    .from("museums")
    .select("id, name")
    .order("name", { ascending: true });

  let query = supabase
    .from("cultural_assets")
    .select(
      "id, name, category, address, rgc_code, status, museums(name), asset_photos(storage_path, is_cover)"
    )
    .order("created_at", { ascending: false });

  if (museumId) {
    query = query.eq("museum_id", museumId);
  }

  const { data: assets } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Bens Culturais
        </h1>
        <p className="text-sm text-muted-foreground">
          Acervo de todos os museus — filtre por museu específico
        </p>
      </div>

      <MuseumFilter museums={museums ?? []} />

      {assets && assets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => {
            const photos = asset.asset_photos as unknown as {
              storage_path: string;
              is_cover: boolean;
            }[];
            const cover = photos?.find((p) => p.is_cover) ?? photos?.[0];
            const museumName =
              (asset.museums as unknown as { name: string } | null)?.name ??
              "—";

            return (
              <div
                key={asset.id}
                className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
              >
                <div className="relative h-36 w-full bg-gradient-to-br from-amber-200 to-amber-400">
                  {cover ? (
                    <Image
                      src={getAssetPhotoUrl(cover.storage_path)}
                      alt={asset.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShieldCheck className="h-10 w-10 text-amber-700/60" />
                    </div>
                  )}
                  <div className="absolute right-2 top-2">
                    <AssetStatusBadge status={asset.status} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    {museumName}
                  </p>
                  <p className="font-medium leading-tight">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset.category}
                  </p>
                  {asset.address && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {asset.address}
                    </p>
                  )}
                  <RgcBadge code={asset.rgc_code} className="mt-1 w-fit" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Nenhum bem cultural encontrado.
        </div>
      )}
    </div>
  );
}
