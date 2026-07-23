import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client com a Service Role Key — só pode ser usado em Server Actions/rotas
 * de servidor, nunca exposto ao navegador. Necessário para criar usuários com
 * senha definida e resetar senhas via Supabase Auth Admin API.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada. Adicione essa variável de ambiente " +
        "(Project Settings > API > service_role no painel do Supabase) no .env.local " +
        "e no Vercel para habilitar criação e reset de senha de usuários."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
