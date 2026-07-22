import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
            Guardião Cultural
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de Proteção Preventiva ao Patrimônio Cultural
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
