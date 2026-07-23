import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserForm } from "@/components/admin/user-form";
import { UserList, type UserRow } from "@/components/admin/user-list";

export default async function AdminUsuariosPage() {
  const supabase = await createClient();

  const { data: museums } = await supabase
    .from("museums")
    .select("id, name")
    .order("name", { ascending: true });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, status, museums(name)")
    .eq("role", "user")
    .order("created_at", { ascending: true });

  let emailById = new Map<string, string>();
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    emailById = new Map(data.users.map((u) => [u.id, u.email ?? ""]));
  } catch {
    // Sem a service role key configurada, seguimos sem e-mail (a lista de
    // usuários ainda funciona; só a criação/reset é que depende dela).
  }

  const users: UserRow[] = (profiles ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name,
    email: emailById.get(p.id) ?? "—",
    museumName: (p.museums as unknown as { name: string } | null)?.name ?? null,
    status: p.status,
  }));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Usuários
        </h1>
        <p className="text-sm text-muted-foreground">
          Crie e gerencie os usuários de cada museu
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo usuário</CardTitle>
          <CardDescription>
            O usuário nasce com uma senha temporária e precisa trocá-la no
            primeiro acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm museums={museums ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usuários cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
