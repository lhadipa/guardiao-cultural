import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  tecnico: "Técnico",
  visualizador: "Visualizador",
};

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user?.id ?? "")
    .single();

  const displayName = profile?.full_name || user?.email || "Usuário";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Minha Conta
        </h1>
        <p className="text-sm text-muted-foreground">
          Suas informações de acesso ao sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{displayName}</CardTitle>
              <CardDescription>
                {ROLE_LABELS[profile?.role ?? "tecnico"] ?? profile?.role}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Nome completo</p>
            <p className="text-sm font-medium">
              {profile?.full_name || "Não informado"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nível de acesso</p>
            <p className="text-sm font-medium">
              {ROLE_LABELS[profile?.role ?? "tecnico"] ?? profile?.role}
            </p>
          </div>
          {profile?.created_at && (
            <div>
              <p className="text-xs text-muted-foreground">Conta criada em</p>
              <p className="text-sm font-medium">
                {new Date(profile.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
