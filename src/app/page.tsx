import Link from "next/link";
import {
  ShieldCheck,
  Landmark,
  Map,
  Bell,
  FileText,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    icon: Landmark,
    title: "RG Cultural único",
    description:
      "Cada bem cadastrado recebe um identificador único, com fotos, descrição técnica e localização.",
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
    <div className="bg-background">
      {/* Hero — fullscreen */}
      <section className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-br from-[#2f0f07] via-[#5a1d0d] to-[#8a3010] text-[#f6ede0]">
        <div
          className="pointer-events-none absolute -top-1/3 right-0 h-[140%] w-[70%] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(201,154,62,0.25), transparent 70%)",
          }}
        />

        <nav className="relative z-10 flex items-center justify-between gap-3 px-5 py-6 sm:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c99a3e]/40 bg-white/5">
              <ShieldCheck className="h-4 w-4 text-[#e3b957]" />
            </div>
            <span className="font-heading text-sm font-medium tracking-wide whitespace-nowrap">
              Guardião Cultural
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm sm:gap-2">
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-[#f6ede0]/80 transition-colors hover:bg-white/10 hover:text-[#f6ede0] sm:px-4"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-full border border-[#c99a3e]/50 px-3 py-2 font-medium text-[#e3b957] transition-colors hover:bg-[#c99a3e]/10 sm:px-4"
            >
              Criar conta
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-12 px-5 py-10 sm:px-10 lg:flex-row lg:items-center lg:gap-8">
          <div className="max-w-xl">
            <p
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-xs font-medium tracking-[0.25em] text-[#e3b957] uppercase duration-700"
              style={{ animationDelay: "0ms" }}
            >
              Patrimônio Cultural · Minas Gerais
            </p>
            <h1
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both font-heading mt-5 text-[2.75rem] leading-[0.98] font-semibold tracking-tight text-balance duration-700 sm:text-6xl lg:text-[4.25rem]"
              style={{ animationDelay: "80ms" }}
            >
              Do esquecimento
              <br />
              ao registro.
            </h1>
            <p
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-6 max-w-md text-base text-[#f6ede0]/75 duration-700 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              O Guardião Cultural documenta, monitora e protege bens
              históricos, artísticos e arquitetônicos antes que o
              desaparecimento silencioso aconteça.
            </p>

            <div
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-8 flex flex-wrap items-center gap-4 duration-700"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/cadastro"
                className="rounded-full bg-[#e3b957] px-7 py-3.5 text-sm font-semibold text-[#2f0f07] shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] hover:bg-[#eec872] active:scale-[0.99]"
              >
                Começar agora
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[#f6ede0]/30 px-7 py-3.5 text-sm font-semibold text-[#f6ede0] transition-colors hover:bg-white/10"
              >
                Já tenho conta
              </Link>
            </div>

            <p
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-8 inline-flex items-center gap-2 text-sm text-[#f6ede0]/60 duration-700"
              style={{ animationDelay: "320ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#e3b957]" />
              {totalBens} {totalBens === 1 ? "bem protegido" : "bens protegidos"}{" "}
              no sistema
            </p>
          </div>

          {/* Signature element — RG Cultural seal card */}
          <div
            className="animate-in fade-in zoom-in-95 fill-mode-both mx-auto w-full max-w-[19rem] shrink-0 duration-1000 lg:mx-0 lg:rotate-[-3deg]"
            style={{ animationDelay: "260ms" }}
          >
            <div className="rounded-2xl border-2 border-dashed border-[#c99a3e]/50 bg-[#f6ede0] p-1.5 shadow-2xl shadow-black/40">
              <div className="rounded-xl border border-[#2b2118]/10 bg-[#faf6ef] px-6 py-8 text-center text-[#2b2118]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#c99a3e] bg-[#f1e2b8]">
                  <ShieldCheck className="h-6 w-6 text-[#8a3010]" />
                </div>
                <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.3em] text-[#8a3010] uppercase">
                  RG Cultural
                </p>
                <p className="font-heading mt-2 font-mono text-lg font-semibold tracking-wide">
                  RGC-MG-000001
                </p>
                <div className="mx-auto my-4 h-px w-16 bg-[#2b2118]/15" />
                <p className="text-sm font-medium">Registrado e protegido</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs text-[#2b2118]/60">
                  <MapPin className="h-3 w-3" />
                  Minas Gerais, Brasil
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center pb-6">
          <ChevronDown className="h-5 w-5 text-[#f6ede0]/40 motion-safe:animate-bounce" />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-10 sm:py-28">
        <p className="text-xs font-medium tracking-[0.25em] text-primary uppercase">
          Como funciona
        </p>
        <h2 className="font-heading mt-3 max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Proteção preventiva, não reação tardia.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-card p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </span>
              <p className="font-heading mt-4 text-lg font-medium">
                {feature.title}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t px-5 py-10 text-center sm:px-10">
        <p className="text-xs text-muted-foreground">
          Guardião Cultural · Minas Gerais · Brasil
        </p>
      </footer>
    </div>
  );
}
