import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PreferencesToggles } from "@/components/settings/preferences-toggles";

export default function ConfiguracoesPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Preferências do sistema
        </p>
      </div>

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
