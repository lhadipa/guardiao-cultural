"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { resetUserPassword, toggleUserStatus } from "@/actions/admin";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface UserRow {
  id: string;
  fullName: string | null;
  email: string;
  museumName: string | null;
  status: "ativo" | "inativo";
}

export function UserList({ users }: { users: UserRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);

  function handleReset(userId: string) {
    startTransition(async () => {
      const result = await resetUserPassword(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.success ?? "Senha redefinida");
      if (result.temporaryPassword) {
        setRevealedPassword(result.temporaryPassword);
      }
    });
  }

  function handleToggleStatus(userId: string, status: "ativo" | "inativo") {
    startTransition(async () => {
      const result = await toggleUserStatus(
        userId,
        status === "ativo" ? "inativo" : "ativo"
      );
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.success ?? "Status atualizado");
    });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Museu</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.fullName ?? "Sem nome"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>{user.museumName ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={user.status === "ativo" ? "default" : "secondary"}>
                  {user.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleReset(user.id)}
                >
                  <KeyRound className="h-3.5 w-3.5" /> Resetar senha
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleToggleStatus(user.id, user.status)}
                >
                  {user.status === "ativo" ? "Inativar" : "Ativar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum usuário cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!revealedPassword}
        onOpenChange={(open) => !open && setRevealedPassword(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova senha temporária</DialogTitle>
            <DialogDescription>
              Copie e entregue essa senha ao usuário — ela não será exibida
              novamente. Ele precisará trocá-la no próximo login.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
            <code className="flex-1 text-sm font-medium">
              {revealedPassword}
            </code>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                if (revealedPassword) {
                  navigator.clipboard.writeText(revealedPassword);
                  toast.success("Senha copiada");
                }
              }}
            >
              Copiar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
