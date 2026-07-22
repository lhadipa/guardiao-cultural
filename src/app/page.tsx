import Link from "next/link";
import {
  ShieldCheck,
  Landmark,
  Map,
  Bell,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    icon: Landmark,
    title: "RG Cultural único",
    description:
      "Cada bem cultural cadastrado recebe um identificador único, com fotos, descrição técnica e localização.",
  },
  {
    icon: Map,
    title: "Mapa & Geofencing",
    description:
      "Visualização geográfica com zona de segurança configurável ao redor de cada bem protegido.",
  },
  {
    icon: Bell,
    title: "Notificações inteligentes",
    description:
      "Alertas automáticos em caso de movimentação fora da área de segurança definida.",
  },
  {
    icon: FileText,
    title: "Relatórios",
    description:
      "Resumos consolidados do acervo por categoria, conservação e status de segurança.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("public_stats");
  const totalBens = data?.[0]?.total_bens ?? 0;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#6b2410] to-[#b8541f] px-4 py-4 text-white sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-base font-semibold leading-tight">
              Guardião Cultural
            </p>
            <p className="hidden text-xs text-white/80 leading-tight sm:block">
              Sistema de Proteção Preventiva ao Patrimônio
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            nativeButton={false}
            variant="ghost"
            className="text-white hover:bg-white/15 hover:text-white"
            render={<Link href="/login" />}
          >
            Entrar
          </Button>
          <Button
            nativeButton={false}
            className="bg-white text-[#6b2410] hover:bg-white/90"
            render={<Link href="/cadastro" />}
          >
            <span className="hidden sm:inline">Criar conta</span>
            <span className="sm:hidden">Criar</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Transformando o patrimônio de invisível para documentado, rastreável
          e protegível
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          O Guardião Cultural é um sistema de proteção preventiva ao
          patrimônio cultural — cadastro, monitoramento e alertas para bens
          históricos, artísticos e arquitetônicos.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800">
          <ShieldCheck className="h-4 w-4" />
          {totalBens} {totalBens === 1 ? "bem protegido" : "bens protegidos"}{" "}
          no sistema
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/cadastro" />}
          >
            Começar agora
          </Button>
          <Button
            nativeButton={false}
            size="lg"
            variant="outline"
            render={<Link href="/login" />}
          >
            Já tenho conta
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <feature.icon className="h-4 w-4" />
              </span>
              <p className="font-heading mt-3 font-medium">
                {feature.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-xs text-muted-foreground">
          Guardião Cultural · Minas Gerais · Brasil
        </p>
      </main>
    </div>
  );
}
