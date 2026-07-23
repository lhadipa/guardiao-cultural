"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { changePasswordSchema } from "@/lib/validations/auth";

export interface ChangePasswordActionState {
  error?: string;
}

export async function changePassword(
  _prevState: ChangePasswordActionState,
  formData: FormData
): Promise<ChangePasswordActionState> {
  const parsed = changePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase
    .from("profiles")
    .update({
      must_change_password: false,
      last_password_change_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(profile?.role === "master" ? "/admin" : "/dashboard");
}
