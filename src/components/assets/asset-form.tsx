"use client";

import { useActionState } from "react";
import { createAsset, type AssetActionState } from "@/actions/assets";
import { ASSET_CATEGORIES, CONSERVATION_STATUSES } from "@/lib/validations/asset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUploader } from "./photo-uploader";

const initialState: AssetActionState = {};

export function AssetForm() {
  const [state, formAction, isPending] = useActionState(
    createAsset,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Bem *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Imagem de São Francisco"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>
              Selecione
            </option>
            {ASSET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="conservationStatus">Conservação *</Label>
          <select
            id="conservationStatus"
            name="conservationStatus"
            required
            defaultValue=""
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>
              Selecione
            </option>
            {CONSERVATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technicalDescription">Descrição técnica</Label>
        <Textarea
          id="technicalDescription"
          name="technicalDescription"
          placeholder="Descrição técnica do bem..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Upload de Imagens</Label>
        <PhotoUploader />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço completo</Label>
        <Input id="address" name="address" placeholder="Endereço completo" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            placeholder="-20.3855"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            placeholder="-43.5035"
            required
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar Bem"}
        </Button>
      </div>
    </form>
  );
}
