"use client";

import { useTransition } from "react";
import { updateProfileRole } from "@/actions/profiles";
import type { Role } from "@/types/database.types";

const ROLES: Role[] = ["admin", "gestor", "tecnico", "visualizador"];

export interface ProfileRow {
  id: string;
  fullName: string | null;
  role: Role;
}

export function UserRoleTable({
  profiles,
  canEdit,
}: {
  profiles: ProfileRow[];
  canEdit: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-2 font-medium">Usuário</th>
          <th className="py-2 font-medium">Nível de acesso</th>
        </tr>
      </thead>
      <tbody>
        {profiles.map((profile) => (
          <tr key={profile.id} className="border-b last:border-0">
            <td className="py-2">{profile.fullName ?? "Sem nome"}</td>
            <td className="py-2">
              <select
                defaultValue={profile.role}
                disabled={!canEdit || isPending}
                onChange={(e) =>
                  startTransition(() =>
                    updateProfileRole(profile.id, e.target.value as Role)
                  )
                }
                className="h-8 rounded-md border border-input bg-transparent px-2 text-sm disabled:opacity-60"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
