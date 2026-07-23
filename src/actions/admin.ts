"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateTemporaryPassword } from "@/lib/generate-password";

export interface AdminActionState {
  error?: string;
  success?: string;
  temporaryPassword?: string;
}

const museumSchema = z.object({
  name: z.string().min(2, "Informe o nome do museu"),
  address: z.string().optional(),
  colorHex: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida, use o formato #RRGGBB"),
  status: z.enum(["ativo", "inativo"]),
});

async function assertMaster() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "master") {
    throw new Error("Apenas o Administrador Master pode realizar esta ação");
  }

  return supabase;
}

export async function createMuseum(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const supabase = await assertMaster();

  const parsed = museumSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    colorHex: formData.get("colorHex"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { error } = await supabase.from("museums").insert({
    name: parsed.data.name,
    address: parsed.data.address ?? null,
    color_hex: parsed.data.colorHex,
    status: parsed.data.status,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/museus");
  return { success: "Museu criado com sucesso" };
}

export async function updateMuseum(
  museumId: string,
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const supabase = await assertMaster();

  const parsed = museumSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    colorHex: formData.get("colorHex"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { error } = await supabase
    .from("museums")
    .update({
      name: parsed.data.name,
      address: parsed.data.address ?? null,
      color_hex: parsed.data.colorHex,
      status: parsed.data.status,
    })
    .eq("id", museumId);

  if (error) return { error: error.message };

  revalidatePath("/admin/museus");
  return { success: "Museu atualizado com sucesso" };
}

const createUserSchema = z.object({
  fullName: z.string().min(2, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  museumId: z.string().uuid("Selecione um museu"),
  status: z.enum(["ativo", "inativo"]),
});

export async function createUser(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await assertMaster();

  const parsed = createUserSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    museumId: formData.get("museumId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const temporaryPassword = generateTemporaryPassword();

  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro de configuração" };
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      museum_id: parsed.data.museumId,
      must_change_password: true,
    },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Não foi possível criar o usuário" };
  }

  if (parsed.data.status === "inativo") {
    const supabase = await createClient();
    await supabase
      .from("profiles")
      .update({ status: "inativo" })
      .eq("id", data.user.id);
  }

  revalidatePath("/admin/usuarios");
  return {
    success: "Usuário criado com sucesso",
    temporaryPassword,
  };
}

export async function resetUserPassword(
  userId: string
): Promise<AdminActionState> {
  const supabase = await assertMaster();

  const temporaryPassword = generateTemporaryPassword();

  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro de configuração" };
  }

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: temporaryPassword,
  });

  if (error) return { error: error.message };

  await supabase
    .from("profiles")
    .update({ must_change_password: true })
    .eq("id", userId);

  revalidatePath("/admin/usuarios");
  return {
    success: "Senha redefinida com sucesso",
    temporaryPassword,
  };
}

export async function toggleUserStatus(
  userId: string,
  status: "ativo" | "inativo"
) {
  const supabase = await assertMaster();
  await supabase.from("profiles").update({ status }).eq("id", userId);
  revalidatePath("/admin/usuarios");
}
