import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MuseumForm } from "@/components/admin/museum-form";
import { MuseumList } from "@/components/admin/museum-list";

export default async function AdminMuseusPage() {
  const supabase = await createClient();
  const { data: museums } = await supabase
    .from("museums")
    .select("id, name, address, color_hex, status")
    .order("created_at", { ascending: true });

  const rows = (museums ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    address: m.address,
    colorHex: m.color_hex,
    status: m.status,
  }));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Museus
        </h1>
        <p className="text-sm text-muted-foreground">
          Cadastre e gerencie os museus atendidos pelo sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo museu</CardTitle>
          <CardDescription>
            Cada museu tem seu próprio acervo isolado e sua cor de identidade
            visual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MuseumForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Museus cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <MuseumList museums={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
