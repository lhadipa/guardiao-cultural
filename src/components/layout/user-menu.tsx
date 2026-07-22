"use client";

import { useTransition } from "react";
import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  tecnico: "Técnico",
  visualizador: "Visualizador",
};

export function UserMenu({
  fullName,
  email,
  role,
  variant = "light",
}: {
  fullName: string | null;
  email: string | null;
  role: string;
  variant?: "light" | "dark";
}) {
  const displayName = fullName || email || "Usuário";
  const initials = displayName.slice(0, 2).toUpperCase();
  const isDark = variant === "dark";
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-2 px-2",
              isDark && "text-white hover:bg-white/15 hover:text-white"
            )}
          />
        }
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback
            className={cn(
              "text-xs",
              isDark
                ? "bg-white/20 text-white"
                : "bg-primary text-primary-foreground"
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight">{displayName}</p>
          <p
            className={cn(
              "text-xs leading-tight",
              isDark ? "text-white/75" : "text-muted-foreground"
            )}
          >
            {ROLE_LABELS[role] ?? role}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/conta" />}>
            <UserIcon className="h-4 w-4" /> Minha conta
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => startTransition(() => signOut())}
          >
            <LogOut className="h-4 w-4" /> {isPending ? "Saindo..." : "Sair"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
