"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "./admin-nav-items";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" />}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetHeader className="flex-row items-center gap-2 space-y-0 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <SheetTitle className="font-heading text-lg leading-tight">
              Painel
            </SheetTitle>
            <p className="text-xs text-sidebar-foreground/70 leading-tight">
              Master
            </p>
          </div>
        </SheetHeader>

        <nav className="space-y-1 px-3">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
}
