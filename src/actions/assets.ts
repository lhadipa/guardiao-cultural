"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assetSchema } from "@/lib/validations/asset";

export interface AssetActionState {
  error?: string;
}

export async function createAsset(
  _prevState: AssetActionState,
  formData: FormData
): Promise<AssetActionState> {
  const parsed = assetSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    conservationStatus: formData.get("conservationStatus"),
    technicalDescription: formData.get("technicalDescription") || undefined,
    address: formData.get("address") || undefined,
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });

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
