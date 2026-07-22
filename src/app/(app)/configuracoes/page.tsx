import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserRoleTable } from "@/components/settings/user-role-table";
import { PreferencesToggles } from "@/components/settings/preferences-toggles";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .order("created_at", { ascending: true });

  const isAdmin = currentProfile?.role === "admin";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Níveis de acesso e preferências do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Níveis de Acesso</CardTitle>
          <CardDescription>
            {isAdmin
              ? "Como administrador, você pode alterar o papel de cada usuário."
              : "Apenas administradores podem alterar níveis de acesso."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserRoleTable
            profiles={(profiles ?? []).map((p) => ({
              id: p.id,
              fullName: p.full_name,
              role: p.role,
            }))}
            canEdit={isAdmin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferências</CardTitle>
        </CardHeader>
        <CardContent>
          <PreferencesToggles />
        </CardContent>
      </Card>
    </div>
  );
}
