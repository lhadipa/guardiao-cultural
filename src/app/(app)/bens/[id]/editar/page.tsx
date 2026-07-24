import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "@/components/assets/asset-form";

export default async function EditarBemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: asset } = await supabase
    .from("cultural_assets")
    .select("*, asset_photos(id, storage_path)")
    .eq("id", id)
    .single();

  if (!asset) {
    notFound();
  }

  const photos = (asset.asset_photos ?? []) as unknown as {
    id: string;
    storage_path: string;
  }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Editar Bem
        </h1>
        <p className="text-sm text-muted-foreground">
          Atualize as informações de {asset.name}
        </p>
      </div>

      <AssetForm
        asset={{
          id: asset.id,
          name: asset.name,
          category: asset.category,
          conservationStatus: asset.conservation_status,
          technicalDescription: asset.technical_description,
          address: asset.address,
          latitude: asset.latitude,
          longitude: asset.longitude,
          photos: photos.map((p) => ({ id: p.id, storagePath: p.storage_path })),
        }}
      />
    </div>
  );
}
