"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "./admin-nav-items";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <nav className="flex-1 space-y-1 p-3">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Painel Master
        </div>
      </div>
    </aside>
  );
}
