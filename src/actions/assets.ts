"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assetSchema } from "@/lib/validations/asset";

export interface AssetActionState {
  error?: string;
}

function parseAssetForm(formData: FormData) {
  return assetSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    conservationStatus: formData.get("conservationStatus"),
    technicalDescription: formData.get("technicalDescription") || undefined,
    address: formData.get("address") || undefined,
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });
}

export async function createAsset(
  _prevState: AssetActionState,
  formData: FormData
): Promise<AssetActionState> {
  const parsed = parseAssetForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const photoPaths = formData.getAll("photoPaths") as string[];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: asset, error } = await supabase
    .from("cultural_assets")
    .insert({
      name: parsed.data.name,
      category: parsed.data.category,
      conservation_status: parsed.data.conservationStatus,
      technical_description: parsed.data.technicalDescription ?? null,
      address: parsed.data.address ?? null,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !asset) {
    return { error: error?.message ?? "Não foi possível salvar o bem" };
  }

  if (photoPaths.length > 0) {
    const { error: photosError } = await supabase.from("asset_photos").insert(
      photoPaths.map((path, index) => ({
        asset_id: asset.id,
        storage_path: path,
        is_cover: index === 0,
      }))
    );

    if (photosError) {
      // O bem já foi criado; fotos podem ser adicionadas depois na edição.
      console.error("Erro ao salvar fotos:", photosError.message);
    }
  }

  revalidatePath("/bens");
  revalidatePath("/dashboard");
  redirect(`/bens/${asset.id}`);
}

export async function updateAsset(
  assetId: string,
  _prevState: AssetActionState,
  formData: FormData
): Promise<AssetActionState> {
  const parsed = parseAssetForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const photoPaths = formData.getAll("photoPaths") as string[];
  const removedPhotoIds = formData.getAll("removedPhotoIds") as string[];

  const supabase = await createClient();

  const { error } = await supabase
    .from("cultural_assets")
    .update({
      name: parsed.data.name,
      category: parsed.data.category,
      conservation_status: parsed.data.conservationStatus,
      technical_description: parsed.data.technicalDescription ?? null,
      address: parsed.data.address ?? null,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
    })
    .eq("id", assetId);

  if (error) {
    return { error: error.message };
  }

  if (removedPhotoIds.length > 0) {
    const { data: toRemove } = await supabase
      .from("asset_photos")
      .select("id, storage_path")
      .in("id", removedPhotoIds);

    if (toRemove && toRemove.length > 0) {
      await supabase.storage
        .from("asset-photos")
        .remove(toRemove.map((p) => p.storage_path));
      await supabase
        .from("asset_photos")
        .delete()
        .in(
          "id",
          toRemove.map((p) => p.id)
        );
    }
  }

  if (photoPaths.length > 0) {
    const { data: remaining } = await supabase
      .from("asset_photos")
      .select("is_cover")
      .eq("asset_id", assetId);

    const hasCover = (remaining ?? []).some((p) => p.is_cover);

    const { error: photosError } = await supabase.from("asset_photos").insert(
      photoPaths.map((path, index) => ({
        asset_id: assetId,
        storage_path: path,
        is_cover: !hasCover && index === 0,
      }))
    );

    if (photosError) {
      console.error("Erro ao salvar novas fotos:", photosError.message);
    }
  }

  revalidatePath("/bens");
  revalidatePath("/dashboard");
  revalidatePath(`/bens/${assetId}`);
  redirect(`/bens/${assetId}`);
}
