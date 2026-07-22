-- Function pública (SECURITY DEFINER) que expõe apenas uma contagem agregada
-- de bens cadastrados, sem expor nenhuma linha/coluna individual da tabela.
-- Usada na landing page pública (antes do login) — ver src/app/page.tsx.
-- A tabela cultural_assets permanece protegida por RLS (só authenticated).

create or replace function public.public_stats()
returns table (total_bens bigint)
language sql
security definer
set search_path = public
as $$
  select count(*) from public.cultural_assets;
$$;

grant execute on function public.public_stats() to anon, authenticated;
