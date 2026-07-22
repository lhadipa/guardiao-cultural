import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";

export function TopHeader({
  fullName,
  email,
  role,
}: {
  fullName: string | null;
  email: string | null;
  role: string;
}) {
  return (
    <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#6b2410] to-[#b8541f] px-4 py-3 text-white sm:px-6">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="hidden sm:block">
          <p className="font-heading text-base font-semibold leading-tight">
            Guardião Cultural
          </p>
          <p className="text-xs text-white/80 leading-tight">
            Sistema de Proteção Preventiva ao Patrimônio
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          nativeButton={false}
          className="bg-white text-[#6b2410] hover:bg-white/90"
          render={<Link href="/bens/novo" />}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Bem Cultural</span>
          <span className="sm:hidden">Novo</span>
        </Button>
        <UserMenu
          fullName={fullName}
          email={email}
          role={role}
          variant="dark"
        />
      </div>
    </header>
  );
}
