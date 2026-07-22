import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RgcBadge } from "@/components/assets/rgc-badge";
import { AssetStatusBadge } from "@/components/assets/asset-status-badge";
import { getAssetPhotoUrl } from "@/lib/storage";
import { CONSERVATION_STATUSES } from "@/lib/validations/asset";

export default async function BemDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: asset } = await supabase
    .from("cultural_assets")
    .select("*, asset_photos(storage_path, is_cover)")
    .eq("id", id)
    .single();

  if (!asset) {
    notFound();
  }

  const photos = (asset.asset_photos ?? []) as unknown as {
    storage_path: string;
    is_cover: boolean;
  }[];

  const conservationLabel =
    CONSERVATION_STATUSES.find((s) => s.value === asset.conservation_status)
      ?.label ?? asset.conservation_status;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
              {asset.name}
            </h1>
            <AssetStatusBadge status={asset.status} />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <RgcBadge code={asset.rgc_code} />
            <span className="text-sm text-muted-foreground">
              {asset.category}
            </span>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.storage_path}
              className="relative aspect-square overflow-hidden rounded-md border"
            >
              <Image
                src={getAssetPhotoUrl(photo.storage_path)}
                alt={asset.name}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Estado de conservação</p>
          <p className="font-medium">{conservationLabel}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Cadastrado em</p>
          <p className="font-medium">
            {new Date(asset.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
        {asset.address && (
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Localização</p>
            <p className="flex items-center gap-1 font-medium">
              <MapPin className="h-4 w-4" /> {asset.address}
            </p>
            <p className="text-xs text-muted-foreground">
              {asset.latitude}, {asset.longitude}
            </p>
          </div>
        )}
      </div>

      {asset.technical_description && (
        <div className="rounded-lg border bg-card p-4">
          <p className="mb-1 text-xs text-muted-foreground">
            Descrição técnica
          </p>
          <p className="text-sm">{asset.technical_description}</p>
        </div>
      )}
    </div>
  );
}
