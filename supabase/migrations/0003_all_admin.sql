-- Todo mundo com o mesmo nível de acesso (Administrador), agora e para contas futuras.

-- 1. Contas novas já nascem como Administrador.
alter table public.profiles
  alter column role set default 'admin';

-- 2. Promove todas as contas existentes para Administrador.
update public.profiles set role = 'admin';

-- 3. Corrige a falta de política: hoje só existe "profiles_update_own" (cada um só
-- edita o próprio registro). Sem isso, um Administrador não consegue de fato mudar
-- o nível de outra conta pela tela de Configurações — a escrita é bloqueada em
-- silêncio pelo RLS. Esta política permite que administradores editem qualquer perfil.
create policy "profiles_update_admin" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
