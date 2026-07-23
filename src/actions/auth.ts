"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";

export interface AuthActionState {
  error?: string;
}

async function authenticate(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    } as const;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: "E-mail ou senha incorretos" } as const;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status, must_change_password")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return { error: "Perfil não encontrado. Contate o administrador." } as const;
  }

  if (profile.status === "inativo") {
    await supabase.auth.signOut();
    return { error: "Conta inativa. Contate o administrador." } as const;
  }

  return { supabase, profile } as const;
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await authenticate(formData);
  if ("error" in result) return { error: result.error };

  const { supabase, profile } = result;

  if (profile.role === "master") {
    await supabase.auth.signOut();
    return {
      error: "Esta conta é de Administrador. Use o Login Administrador.",
    };
  }

  if (profile.must_change_password) {
    redirect("/trocar-senha");
  }

  redirect("/dashboard");
}

export async function adminSignIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await authenticate(formData);
  if ("error" in result) return { error: result.error };

  const { supabase, profile } = result;

  if (profile.role !== "master") {
    await supabase.auth.signOut();
    return { error: "Esta conta não é de Administrador." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
