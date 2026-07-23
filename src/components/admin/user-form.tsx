"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createUser, type AdminActionState } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const initialState: AdminActionState = {};

export function UserForm({
  museums,
}: {
  museums: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    createUser,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      formRef.current?.reset();
      if (state.temporaryPassword) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reveals a one-time secret returned by the action, not derivable from render
        setRevealedPassword(state.temporaryPassword);
      }
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo *</Label>
          <Input id="fullName" name="fullName" placeholder="Nome do usuário" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="usuario@museu.org"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="museumId">Museu *</Label>
            <select
              id="museumId"
              name="museumId"
              required
              defaultValue=""
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>
                Selecione
              </option>
              {museums.map((museum) => (
                <option key={museum.id} value={museum.id}>
                  {museum.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              name="status"
              defaultValue="ativo"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Uma senha temporária forte é gerada automaticamente. O usuário
          precisará trocá-la no primeiro acesso.
        </p>

        <Button type="submit" disabled={isPending || museums.length === 0}>
          {isPending ? "Criando..." : "Criar usuário"}
        </Button>
        {museums.length === 0 && (
          <p className="text-xs text-destructive">
            Cadastre um museu antes de criar usuários.
          </p>
        )}
      </form>

      <Dialog
        open={!!revealedPassword}
        onOpenChange={(open) => !open && setRevealedPassword(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Senha temporária gerada</DialogTitle>
            <DialogDescription>
              Copie e entregue essa senha ao usuário — ela não será exibida
              novamente. Ele precisará trocá-la no primeiro login.
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
