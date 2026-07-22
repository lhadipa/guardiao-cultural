import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetCard } from "@/components/assets/asset-card";

export default async function BensPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("cultural_assets")
    .select("id, name, category, address, rgc_code, status, asset_photos(storage_path, is_cover)")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const { data: assets } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
            Bens Culturais
          </h1>
          <p className="text-sm text-muted-foreground">
            Acervo cadastrado no sistema
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          className="border-primary text-primary hover:bg-primary/10"
          render={<Link href="/bens/novo" />}
        >
          <Plus className="h-4 w-4" /> Novo Bem
        </Button>
      </div>

      <form className="max-w-sm">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome..."
          className="bg-background"
        />
      </form>

      {assets && assets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => {
            const photos = asset.asset_photos as unknown as {
              storage_path: string;
              is_cover: boolean;
            }[];
            const cover = photos?.find((p) => p.is_cover) ?? photos?.[0];

            return (
              <AssetCard
                key={asset.id}
                id={asset.id}
                name={asset.name}
                category={asset.category}
                address={asset.address}
                rgcCode={asset.rgc_code}
                status={asset.status}
                coverPhotoPath={cover?.storage_path ?? null}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Nenhum bem cultural cadastrado ainda.{" "}
          <Link href="/bens/novo" className="text-primary underline">
            Cadastre o primeiro
          </Link>
          .
        </div>
      )}
    </div>
  );
}
