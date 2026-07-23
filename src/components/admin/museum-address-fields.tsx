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

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function buildAddress(result: ViaCepResult, numero: string, complemento: string) {
  const parts = [result.logradouro, numero].filter(Boolean).join(", ");
  const withComplemento = [parts, complemento].filter(Boolean).join(" - ");
  return `${withComplemento} - ${result.bairro}, ${result.localidade}/${result.uf}`;
}

export function MuseumAddressFields({
  defaultAddress,
}: {
  defaultAddress?: string | null;
}) {
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [result, setResult] = useState<ViaCepResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function lookupCep(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: ViaCepResult = await res.json();
      if (data.erro) {
        setStatus("error");
        return;
      }
      setResult(data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const resolvedAddress = result ? buildAddress(result, numero, complemento) : "";
  const address = resolvedAddress || defaultAddress || "";

  return (
    <div className="space-y-3">
      <input type="hidden" name="address" value={address} />

      <div className="space-y-2">
        <Label htmlFor="cep">CEP</Label>
        <div className="relative">
          <Input
            id="cep"
            value={cep}
            placeholder="00000-000"
            onChange={(e) => setCep(formatCep(e.target.value))}
            onBlur={(e) => lookupCep(e.target.value)}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            value={numero}
            placeholder="Nº"
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            value={complemento}
            placeholder="Sala, bloco, andar..."
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressPreview">Endereço</Label>
        <p
          id="addressPreview"
          className="flex items-start gap-1.5 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
        >
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          {address || "Informe o CEP para preencher automaticamente"}
        </p>
      </div>
    </div>
  );
}
