"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ViaCepResult {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface Coords {
  latitude: string;
  longitude: string;
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function buildAddress(result: ViaCepResult, complemento: string) {
  const parts = [result.logradouro, complemento].filter(Boolean).join(", ");
  return `${parts} - ${result.bairro}, ${result.localidade}/${result.uf}`;
}

async function geocodeAddress(result: ViaCepResult): Promise<Coords | null> {
  const query = [result.logradouro, result.bairro, result.localidade, result.uf, "Brazil"]
    .filter(Boolean)
    .join(", ");

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(
      query
    )}`
  );
  const data: Array<{ lat: string; lon: string }> = await res.json();
  if (data.length === 0) return null;
  return { latitude: data[0].lat, longitude: data[0].lon };
}

export function CepFields() {
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");
  const [result, setResult] = useState<ViaCepResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [coordStatus, setCoordStatus] = useState<"idle" | "loading" | "error">("idle");

  async function lookupCep(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setStatus("loading");
    setResult(null);
    setCoords(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: ViaCepResult = await res.json();
      if (data.erro) {
        setStatus("error");
        return;
      }
      setResult(data);
      setStatus("idle");

      setCoordStatus("loading");
      try {
        const found = await geocodeAddress(data);
        setCoords(found);
        setCoordStatus(found ? "idle" : "error");
      } catch {
        setCoordStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const address = result ? buildAddress(result, complemento) : "";

  return (
    <div className="space-y-4">
      <input type="hidden" name="address" value={address} />
      <input type="hidden" name="latitude" value={coords?.latitude ?? ""} />
      <input type="hidden" name="longitude" value={coords?.longitude ?? ""} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cep">CEP *</Label>
          <div className="relative">
            <Input
              id="cep"
              value={cep}
              placeholder="00000-000"
              onChange={(e) => setCep(formatCep(e.target.value))}
              onBlur={(e) => lookupCep(e.target.value)}
              required
            />
            {status === "loading" && (
              <Loader2 className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
          {status === "error" && (
            <p className="text-xs text-destructive">
              CEP não encontrado. Confira e tente novamente.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            value={complemento}
            placeholder="Número, sala, bloco..."
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>
      </div>

      {result && (
        <div className="space-y-1.5 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            {address}
          </p>
          <p className="flex items-center gap-1.5 pl-5.5 text-xs">
            {coordStatus === "loading" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Localizando coordenadas...
              </>
            )}
            {coordStatus === "idle" && coords && (
              <>Coordenadas: {coords.latitude}, {coords.longitude}</>
            )}
            {coordStatus === "error" && (
              <span className="text-destructive">
                Não foi possível localizar as coordenadas automaticamente para este endereço.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
