"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  createMuseum,
  updateMuseum,
  type AdminActionState,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      if (!museum) formRef.current?.reset();
      onSaved?.();
    }
    if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
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

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={museum?.address ?? ""}
          placeholder="Rua, número, cidade/UF"
        />
      </div>

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
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : museum ? "Salvar alterações" : "Criar museu"}
      </Button>
    </form>
  );
}
