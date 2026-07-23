-- Guardião Cultural — multi-tenant por museu + usuário Master
-- Substitui o modelo de 4 níveis de acesso (admin/gestor/tecnico/visualizador)
-- compartilhando um único acervo por um modelo de 2 papéis (master/user) onde
-- cada usuário comum pertence a exatamente um museu, com isolamento completo.

-- ============ museums ============

create table if not exists public.museums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  color_hex text not null default '#92400e',
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.museums enable row level security;

drop trigger if exists museums_set_updated_at on public.museums;
create trigger museums_set_updated_at
  before update on public.museums
  for each row execute procedure public.set_updated_at();

-- ============ profiles: novos campos + remodelagem de role ============

alter table public.profiles add column if not exists museum_id uuid references public.museums (id);
alter table public.profiles add column if not exists must_change_password boolean not null default false;
alter table public.profiles add column if not exists status text not null default 'ativo' check (status in ('ativo', 'inativo'));
alter table public.profiles add column if not exists last_password_change_at timestamptz;

-- Derruba o check constraint antigo antes de remapear, senão o UPDATE abaixo
-- é rejeitado pelo próprio constraint que ainda só aceita os papéis antigos.
alter table public.profiles drop constraint if exists profiles_role_check;

-- Remapeia os papéis antigos para o novo modelo de 2 papéis.
update public.profiles set role = 'user' where role not in ('master', 'user');

alter table public.profiles add constraint profiles_role_check check (role in ('master', 'user'));
alter table public.profiles alter column role set default 'user';

-- handle_new_user agora também recebe museum_id e must_change_password via metadata
-- (enviados pela Server Action que cria o usuário através da Admin API).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, museum_id, must_change_password)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    nullif(new.raw_user_meta_data ->> 'museum_id', '')::uuid,
    coalesce((new.raw_user_meta_data ->> 'must_change_password')::boolean, false)
  );
  return new;
end;
$$;

-- Só master pode editar o registro de outra pessoa (ex: ativar/inativar, vincular museu).
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_master" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'master'
    )
  );

-- ============ museums: policies ============

create policy "museums_select_scoped" on public.museums
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.role = 'master' or p.museum_id = museums.id)
    )
  );

create policy "museums_all_master" on public.museums
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'master')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'master')
  );

-- ============ cultural_assets: museum_id + trigger + RLS por museu ============

alter table public.cultural_assets add column if not exists museum_id uuid references public.museums (id);

create or replace function public.set_asset_museum()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.museum_id := (select museum_id from public.profiles where id = auth.uid());
  return new;
end;
$$;

drop trigger if exists set_asset_museum_trigger on public.cultural_assets;
create trigger set_asset_museum_trigger
  before insert on public.cultural_assets
  for each row execute procedure public.set_asset_museum();

drop policy if exists "assets_select_authenticated" on public.cultural_assets;
drop policy if exists "assets_insert_gestor_admin" on public.cultural_assets;
drop policy if exists "assets_update_gestor_admin" on public.cultural_assets;
drop policy if exists "assets_delete_admin" on public.cultural_assets;

create policy "assets_select_scoped" on public.cultural_assets
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.role = 'master' or p.museum_id = cultural_assets.museum_id)
    )
  );

create policy "assets_insert_scoped" on public.cultural_assets
  for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'user' and p.museum_id is not null
    )
  );

create policy "assets_update_scoped" on public.cultural_assets
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (
          p.role = 'master'
          or (p.role = 'user' and p.museum_id = cultural_assets.museum_id)
        )
    )
  );

create policy "assets_delete_scoped" on public.cultural_assets
  for delete using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (
          p.role = 'master'
          or (p.role = 'user' and p.museum_id = cultural_assets.museum_id)
        )
    )
  );

-- ============ asset_photos: RLS por museu (via asset) ============

drop policy if exists "photos_select_authenticated" on public.asset_photos;
drop policy if exists "photos_insert_gestor_admin" on public.asset_photos;
drop policy if exists "photos_delete_gestor_admin" on public.asset_photos;

create policy "photos_select_scoped" on public.asset_photos
  for select using (
    exists (
      select 1 from public.cultural_assets ca
      join public.profiles p on p.id = auth.uid()
      where ca.id = asset_photos.asset_id
        and (p.role = 'master' or p.museum_id = ca.museum_id)
    )
  );

create policy "photos_insert_scoped" on public.asset_photos
  for insert with check (
    exists (
      select 1 from public.cultural_assets ca
      join public.profiles p on p.id = auth.uid()
      where ca.id = asset_photos.asset_id
        and p.role = 'user' and p.museum_id = ca.museum_id
    )
  );

create policy "photos_delete_scoped" on public.asset_photos
  for delete using (
    exists (
      select 1 from public.cultural_assets ca
      join public.profiles p on p.id = auth.uid()
      where ca.id = asset_photos.asset_id
        and (p.role = 'master' or p.museum_id = ca.museum_id)
    )
  );

-- ============ alerts: RLS por museu (via asset) ============

drop policy if exists "alerts_select_authenticated" on public.alerts;

create policy "alerts_select_scoped" on public.alerts
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (
          p.role = 'master'
          or exists (
            select 1 from public.cultural_assets ca
            where ca.id = alerts.asset_id and ca.museum_id = p.museum_id
          )
        )
    )
  );

-- ============ storage (bucket asset-photos): simplifica para role='user' ============

drop policy if exists "asset_photos_insert_gestor_admin" on storage.objects;
drop policy if exists "asset_photos_delete_gestor_admin" on storage.objects;

create policy "asset_photos_insert_user" on storage.objects
  for insert with check (
    bucket_id = 'asset-photos'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'user' and museum_id is not null
    )
  );

create policy "asset_photos_delete_user" on storage.objects
  for delete using (
    bucket_id = 'asset-photos'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'user' and museum_id is not null
    )
  );

-- ============ limpeza: função pública de estatística agregada não é mais usada ============
-- A landing page não expõe mais nenhum dado agregado entre museus (isolamento completo).

drop function if exists public.public_stats();
