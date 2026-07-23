import { ShieldCheck } from "lucide-react";
import { AdminMobileNav } from "./admin-mobile-nav";
import { UserMenu } from "./user-menu";

export function AdminTopHeader({
  fullName,
  email,
}: {
  fullName: string | null;
  email: string | null;
}) {
  return (
    <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#6b2410] to-[#b8541f] px-4 py-3 text-white sm:px-6">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <AdminMobileNav />
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="hidden sm:block">
          <p className="font-heading text-base font-semibold leading-tight">
            Guardião Cultural
          </p>
          <p className="text-xs text-white/80 leading-tight">
            Painel do Administrador Master
          </p>
        </div>
      </div>

      <UserMenu fullName={fullName} email={email} role="master" variant="dark" />
    </header>
  );
}
