import { AssetForm } from "@/components/assets/asset-form";

export default function NovoBemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Cadastro de Bem
        </h1>
        <p className="text-sm text-muted-foreground">
          Documente um novo bem cultural e gere seu RG Cultural
        </p>
      </div>
      <AssetForm />
    </div>
  );
}
