import { createBrowserClient } from "@supabase/ssr";

// Sem o genérico `Database`: os tipos manuais em src/types/database.types.ts
// não seguem o shape exato exigido pelo supabase-js. Substituir por
// `supabase gen types typescript` quando o projeto remoto existir (ver PLANO.md).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
