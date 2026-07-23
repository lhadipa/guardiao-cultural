import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#2f0f07] via-[#5a1d0d] to-[#8a3010] px-5 text-[#f6ede0]">
      <div
        className="pointer-events-none absolute -top-1/3 right-0 h-[140%] w-[70%] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,154,62,0.25), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="animate-in fade-in zoom-in-95 fill-mode-both flex h-16 w-16 items-center justify-center rounded-full border border-[#c99a3e]/40 bg-white/5 duration-700">
          <ShieldCheck className="h-8 w-8 text-[#e3b957]" />
        </div>

        <h1
          className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both font-heading mt-6 text-3xl font-semibold tracking-tight duration-700 sm:text-4xl"
          style={{ animationDelay: "80ms" }}
        >
          Guardião Cultural
        </h1>
        <p
          className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-2 text-sm text-[#f6ede0]/70 duration-700"
          style={{ animationDelay: "140ms" }}
        >
          Sistema de Proteção Preventiva ao Patrimônio Cultural
        </p>

        <div
          className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-10 flex flex-col items-center gap-3 duration-700 sm:flex-row"
          style={{ animationDelay: "220ms" }}
        >
          <Link
            href="/login"
            className="w-56 rounded-full bg-[#e3b957] px-7 py-3.5 text-center text-sm font-semibold text-[#2f0f07] shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] hover:bg-[#eec872] active:scale-[0.99]"
          >
            Login
          </Link>
          <Link
            href="/admin-login"
            className="w-56 rounded-full border border-[#f6ede0]/30 px-7 py-3.5 text-center text-sm font-semibold text-[#f6ede0] transition-colors hover:bg-white/10"
          >
            Login Administrador
          </Link>
        </div>
      </div>
    </div>
  );
}
