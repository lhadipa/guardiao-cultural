import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MuseumForm } from "@/components/admin/museum-form";
import { MuseumList, type MuseumRow } from "@/components/admin/museum-list";

export default async function AdminMuseusPage() {
  const supabase = await createClient();

  const { data: museums } = await supabase
    .from("museums")
    .select("id, name, address, color_hex, status")
    .order("created_at", { ascending: true });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, status, museum_id")
    .eq("role", "user")
    .order("created_at", { ascending: true });

  let emailById = new Map<string, string>();
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    emailById = new Map(data.users.map((u) => [u.id, u.email ?? ""]));
  } catch {
    // Sem a service role key configurada, seguimos sem e-mail (a lista ainda
    // funciona; só a criação/reset é que depende dela).
  }

  const rows: MuseumRow[] = (museums ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    address: m.address,
    colorHex: m.color_hex,
    status: m.status,
    users: (profiles ?? [])
      .filter((p) => p.museum_id === m.id)
      .map((p) => ({
        id: p.id,
        fullName: p.full_name,
        email: emailById.get(p.id) ?? "—",
        status: p.status,
      })),
  }));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Museus
        </h1>
        <p className="text-sm text-muted-foreground">
          Cadastre museus e o usuário responsável por cada um
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo museu</CardTitle>
          <CardDescription>
            Cada museu tem seu próprio acervo isolado, sua cor de identidade
            visual e um usuário responsável, criado junto com uma senha
            temporária.
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
