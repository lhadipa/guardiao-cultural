"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createMuseum,
  updateMuseum,
  type AdminActionState,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MuseumAddressFields } from "./museum-address-fields";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const initialState: AdminActionState = {};

export interface MuseumFormValues {
  id: string;
  name: string;
  address: string | null;
  colorHex: string;
  status: "ativo" | "inativo";
}

export function MuseumForm({
  museum,
  onSaved,
}: {
  museum?: MuseumFormValues;
  onSaved?: () => void;
}) {
  const action = museum ? updateMuseum.bind(null, museum.id) : createMuseum;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      if (!museum) formRef.current?.reset();
      if (state.temporaryPassword) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reveals a one-time secret returned by the action, not derivable from render
        setRevealedPassword(state.temporaryPassword);
      } else {
        onSaved?.();
      }
    }
    if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do museu *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={museum?.name}
            placeholder="Ex: Museu de Arte Sacra"
            required
          />
        </div>

        <MuseumAddressFields defaultAddress={museum?.address} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="colorHex">Cor principal *</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Selecionar cor"
                defaultValue={museum?.colorHex ?? "#92400e"}
                onChange={(e) => {
                  const text = document.getElementById(
                    "colorHex"
                  ) as HTMLInputElement | null;
                  if (text) text.value = e.target.value;
                }}
                className="h-9 w-10 shrink-0 cursor-pointer rounded border border-input bg-transparent p-1"
              />
              <Input
                id="colorHex"
                name="colorHex"
                defaultValue={museum?.colorHex ?? "#92400e"}
                placeholder="#92400e"
                pattern="^#[0-9a-fA-F]{6}$"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              name="status"
              defaultValue={museum?.status ?? "ativo"}
              className="flex h-9 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>

        {!museum && (
          <div className="space-y-4 rounded-md border border-dashed p-4">
            <p className="text-sm font-medium">Usuário responsável</p>
            <p className="-mt-2 text-xs text-muted-foreground">
              Criado junto com o museu, com senha temporária gerada
              automaticamente.
            </p>
            <div className="space-y-2">
              <Label htmlFor="responsibleName">Nome completo *</Label>
              <Input
                id="responsibleName"
                name="responsibleName"
                placeholder="Nome do responsável pelo museu"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsibleEmail">E-mail *</Label>
              <Input
                id="responsibleEmail"
                name="responsibleEmail"
                type="email"
                placeholder="responsavel@museu.org"
                required
              />
            </div>
          </div>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : museum
              ? "Salvar alterações"
              : "Criar museu e usuário"}
        </Button>
      </form>

      <Dialog
        open={!!revealedPassword}
        onOpenChange={(open) => {
          if (!open) {
            setRevealedPassword(null);
            onSaved?.();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Senha temporária gerada</DialogTitle>
            <DialogDescription>
              Copie e entregue essa senha ao responsável pelo museu — ela não
              será exibida novamente. Ele precisará trocá-la no primeiro
              login.
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
