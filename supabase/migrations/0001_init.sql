-- Guardião Cultural — schema inicial
-- Rode este arquivo no SQL Editor do painel do Supabase (ou via `supabase db push`).

-- ============ profiles ============

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'tecnico' check (role in ('admin', 'gestor', 'tecnico', 'visualizador')),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Cria profile automaticamente no signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============ cultural_assets ============

create sequence if not exists public.rgc_seq start 1;

create table if not exists public.cultural_assets (
  id uuid primary key default gen_random_uuid(),
  rgc_code text unique not null default (
    'RGC-MG-' || lpad(nextval('public.rgc_seq')::text, 6, '0')
  ),
  name text not null,
  category text not null,
  conservation_status text not null check (conservation_status in ('bom', 'regular', 'ruim', 'em_risco')),
  technical_description text,
  address text,
  latitude double precision not null,
  longitude double precision not null,
  status text not null default 'seguro' check (status in ('seguro', 'alerta')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cultural_assets enable row level security;

create policy "assets_select_authenticated" on public.cultural_assets
  for select using (auth.role() = 'authenticated');

create policy "assets_insert_gestor_admin" on public.cultural_assets
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('gestor', 'admin')
    )
  );

create policy "assets_update_gestor_admin" on public.cultural_assets
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('gestor', 'admin')
    )
  );

create policy "assets_delete_admin" on public.cultural_assets
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists assets_set_updated_at on public.cultural_assets;
create trigger assets_set_updated_at
  before update on public.cultural_assets
  for each row execute procedure public.set_updated_at();

-- ============ asset_photos ============

create table if not exists public.asset_photos (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.cultural_assets (id) on delete cascade,
  storage_path text not null,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.asset_photos enable row level security;

create policy "photos_select_authenticated" on public.asset_photos
  for select using (auth.role() = 'authenticated');

create policy "photos_insert_gestor_admin" on public.asset_photos
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('gestor', 'admin')
    )
  );

create policy "photos_delete_gestor_admin" on public.asset_photos
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('gestor', 'admin')
    )
  );

-- ============ alerts ============

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.cultural_assets (id) on delete set null,
  title text not null,
  message text,
  priority text not null check (priority in ('baixa', 'media', 'alta', 'critica')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;

create policy "alerts_select_authenticated" on public.alerts
  for select using (auth.role() = 'authenticated');

-- ============ storage ============

insert into storage.buckets (id, name, public)
values ('asset-photos', 'asset-photos', true)
on conflict (id) do nothing;

create policy "asset_photos_public_read" on storage.objects
  for select using (bucket_id = 'asset-photos');

create policy "asset_photos_insert_gestor_admin" on storage.objects
  for insert with check (
    bucket_id = 'asset-photos'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('gestor', 'admin')
    )
  );

create policy "asset_photos_delete_gestor_admin" on storage.objects
  for delete using (
    bucket_id = 'asset-photos'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('gestor', 'admin')
    )
  );
