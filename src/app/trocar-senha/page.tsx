"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import {
  changePassword,
  type ChangePasswordActionState,
} from "@/actions/change-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const initialState: ChangePasswordActionState = {};

export default function TrocarSenhaPage() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
            Defina uma nova senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Este é o seu primeiro acesso. Por segurança, defina uma senha
            definitiva antes de continuar.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova senha</CardTitle>
            <CardDescription>
              Mínimo de 8 caracteres. Você não vai conseguir acessar o
              sistema até trocar a senha temporária.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              {state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
