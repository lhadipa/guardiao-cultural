"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, KeyRound } from "lucide-react";
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
import { MuseumForm, type MuseumFormValues } from "./museum-form";

export interface MuseumUser {
  id: string;
  fullName: string | null;
  email: string;
  status: "ativo" | "inativo";
}

export interface MuseumRow extends MuseumFormValues {
  users: MuseumUser[];
}

export function MuseumList({ museums }: { museums: MuseumRow[] }) {
  const [editing, setEditing] = useState<MuseumFormValues | null>(null);
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
            <TableHead>Museu</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usuário responsável</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {museums.map((museum) => (
            <TableRow key={museum.id}>
              <TableCell>
                <p className="font-medium">{museum.name}</p>
                <p className="text-xs text-muted-foreground">
                  {museum.address || "Sem endereço"}
                </p>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: museum.colorHex }}
                  />
                  {museum.colorHex}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={museum.status === "ativo" ? "default" : "secondary"}>
                  {museum.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  {museum.users.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      Nenhum usuário
                    </span>
                  )}
                  {museum.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {user.fullName ?? "Sem nome"}
                        </p>
                        <p className="text-xs leading-tight text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={user.status === "ativo" ? "default" : "secondary"}
                      >
                        {user.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
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
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing(museum)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {museums.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum museu cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar museu</DialogTitle>
          </DialogHeader>
          {editing && (
            <MuseumForm museum={editing} onSaved={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>

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
