# Guardião Cultural — Plano de Implementação

## Contexto

O usuário mostrou um protótipo feito no Figma Make (link: figma.com/make/.../Cultural-Guardian-App) chamado **Guardião Cultural** — um sistema de proteção preventiva ao patrimônio cultural (foco em Minas Gerais/Brasil). O protótipo é só um mockup visual com dados fake, sem backend real. O objetivo agora é construir a versão real como **web app**, usando **Supabase** para banco/auth/storage, priorizando ter um fluxo ponta a ponta demonstrável o quanto antes.

Diretório do projeto está vazio (`/Users/lucaspadilha/www/pessoal/guardiao-cultural`), sem git ainda. Node v20.19.5 disponível.

Decisões de escopo já validadas com o usuário:
- **Web app apenas** (Next.js), sem mobile.
- **Supabase**: Postgres + Auth + Storage.
- **Login/cadastro real** de usuários (Supabase Auth, confirmação de e-mail **desabilitada** por enquanto).
- **Upload de fotos real** via Supabase Storage, bucket **público**.
- **Relatórios (PDF/Excel)**: mockado — botão simula exportação, sem geração real de arquivo.
- **Mapa & Geofencing**: mapa **real** (Leaflet/OpenStreetMap) com pins nas coordenadas reais dos bens; a "zona de segurança" é só um círculo visual, sem lógica de alerta real.
- **Notificações**: mockadas (dados fake em memória, sem tabela dedicada).
- **Acervo compartilhado** entre todos os usuários autenticados, com controle de permissão por `role` (admin/gestor/tecnico/visualizador) — não é um acervo privado por usuário.
- **Design**: o visual da aplicação deve seguir fielmente o protótipo do Figma Make (figma.com/make/.../Cultural-Guardian-App) — layout das telas, paleta de cores (verde-esmeralda + âmbar/dourado), sidebar, cards, badges de status (seguro/alerta), estilo dos gráficos e disposição geral de cada tela devem espelhar o que foi mockado lá, não uma reinterpretação livre.

## Stack

- **Scaffold**: `create-next-app` (App Router, TypeScript, Tailwind, ESLint, `src/`, alias `@/*`)
- **UI**: shadcn/ui (`npx shadcn@latest init`) — tema customizado verde-esmeralda (primary) + âmbar/dourado (accent), batendo com o protótipo. Ícones via `lucide-react`.
- **Formulários**: `react-hook-form` + `zod` + `@hookform/resolvers`
- **Gráficos**: `recharts` (pizza, barras, linha no dashboard)
- **Mapa**: `react-leaflet` + `leaflet`, client-only (`'use client'`, sem SSR), marker customizado (evitar bug de path de ícone padrão do Leaflet), `Circle` para zona de segurança mockada
- **Backend/dados**: `@supabase/supabase-js` + `@supabase/ssr` (clientes de browser e servidor)
- **Utilidades**: `date-fns`, `clsx`/`tailwind-merge` (via `cn()` do shadcn)
- **Não usar**: state manager global, libs de exportação real de PDF/Excel (`jspdf`, `exceljs`) — reforça que Relatórios é mock

## Modelagem do banco (Supabase)

```sql
profiles
- id uuid PK references auth.users(id) on delete cascade
- full_name text
- role text check (role in ('admin','gestor','tecnico','visualizador')) default 'tecnico'
- avatar_url text
- created_at timestamptz default now()

cultural_assets
- id uuid PK default gen_random_uuid()
- rgc_code text unique not null            -- gerado via trigger: 'RGC-MG-' || lpad(nextval(...), 6, '0')
- name text not null
- category text not null
- conservation_status text not null
- technical_description text
- address text
- latitude double precision not null
- longitude double precision not null
- status text not null default 'seguro'    -- 'seguro' | 'alerta'
- created_by uuid references profiles(id)
- created_at timestamptz default now()
- updated_at timestamptz default now()

asset_photos
- id uuid PK default gen_random_uuid()
- asset_id uuid references cultural_assets(id) on delete cascade
- storage_path text not null
- is_cover boolean default false
- created_at timestamptz default now()

alerts                                      -- alimenta dashboard + notificações reais mínimas
- id uuid PK default gen_random_uuid()
- asset_id uuid references cultural_assets(id) on delete set null
- title text not null
- message text
- priority text check (priority in ('baixa','media','alta','critica'))
- is_read boolean default false
- created_at timestamptz default now()
```

- Trigger `handle_new_user()` cria `profiles` automaticamente no signup (padrão Supabase).
- Sequence `rgc_seq` + trigger `BEFORE INSERT` em `cultural_assets` gera o `rgc_code`.
- **RLS**: todos autenticados podem `select` em `cultural_assets`/`asset_photos`/`alerts` (acervo compartilhado); `insert`/`update` restritos a `role in ('gestor','admin')`; `delete` restrito a `admin`. `profiles`: select livre, update só do próprio.
- **Storage**: bucket `asset-photos` público; upload restrito a `gestor`/`admin` via policy de Storage.
- Notificações da tela "Central de Notificações" completa (categorização, badge) ficam **mockadas em memória** (`lib/mock-data/notifications.ts`), não uma tabela — só a tabela `alerts` acima é real, para alimentar o dashboard.

## Estrutura de pastas (Next.js App Router)

```
src/
├── app/
│   ├── (auth)/{login,cadastro}/page.tsx + layout.tsx
│   ├── (app)/layout.tsx                    -- shell autenticado (sidebar/topbar)
│   ├── (app)/dashboard/page.tsx
│   ├── (app)/bens/{page.tsx, novo/page.tsx, [id]/page.tsx}
│   ├── (app)/mapa/page.tsx
│   ├── (app)/notificacoes/page.tsx
│   ├── (app)/relatorios/page.tsx
│   ├── (app)/configuracoes/page.tsx
│   ├── auth/callback/route.ts
│   └── layout.tsx, globals.css
├── components/
│   ├── ui/                                 -- shadcn
│   ├── dashboard/, assets/, map/, notifications/, layout/
├── lib/
│   ├── supabase/{client.ts, server.ts, middleware.ts}
│   ├── mock-data/notifications.ts
│   ├── validations/                        -- zod schemas
│   └── utils.ts
├── actions/{assets.ts, auth.ts, dashboard.ts}   -- Server Actions
├── types/database.types.ts                 -- `supabase gen types typescript`
└── middleware.ts
supabase/migrations/                        -- SQL versionado
```

## Fluxo de autenticação

`middleware.ts` usa `@supabase/ssr`, chama `supabase.auth.getUser()` (revalida JWT), redireciona para `/login` se rota `(app)` sem sessão, e para `/dashboard` se autenticado tentando acessar `/login`/`/cadastro`. Login/cadastro via Server Actions (`signInWithPassword`, `signUp`). Confirmação de e-mail desabilitada nas configs do projeto Supabase. Logout via Server Action + redirect.

## Fluxo de upload de imagens

Upload direto do client para Supabase Storage (evita transitar bytes grandes por Server Actions), path `assets/{asset_id}/{uuid}-{filename}`. Server Action `createAsset` insere o bem primeiro (obtém `id`/`rgc_code`), depois grava as linhas em `asset_photos` com os paths retornados do upload. Exibição via `next/image` com `remotePatterns` para `*.supabase.co`, resolvendo URL pública com `getPublicUrl`.

## Ordem de implementação (fases demonstráveis)

1. **Setup**: scaffold Next.js + Tailwind + shadcn, tema aplicado, projeto Supabase criado, `.env.local`, conexão testada.
2. **Autenticação**: migration `profiles` + trigger, telas login/cadastro, middleware de proteção, shell `(app)` com sidebar/topbar, logout.
3. **Cadastro e acervo de bens** (núcleo do produto): migrations `cultural_assets`/`asset_photos` + trigger RGC + RLS, formulário completo com upload real, tela de acervo (grid/busca/status), tela de detalhe (RG Cultural). **Marco mais importante** — fluxo ponta a ponta com dados reais.
4. **Dashboard**: queries agregadas, KPI cards, gráficos (pizza/barras/linha), lista de alertas recentes.
5. **Mapa & Geofencing**: Leaflet client-only, pins reais, popup com link para detalhe, círculo de zona de segurança mockado.
6. **Notificações (mock)**: dados fake estruturados, central com categorização/prioridade, badge de não lidos (estado local).
7. **Relatórios (mock)**: filtros client-side, botões de exportar com loading simulado + toast, sem geração real de arquivo.
8. **Configurações**: exibição de `role`, listagem de usuários/perfis (edição restrita a admin), preferências estáticas.
9. **Polimento**: loading/skeleton, empty states, responsividade, tratamento de erros, revisão final de RLS.

## Verificação end-to-end

Após cada fase, rodar `npm run dev` e validar manualmente no navegador:
- Fase 2: criar conta → logar → cadastrar um bem com fotos → ver no acervo → abrir detalhe e conferir RG Cultural gerado.
- Fase 4: confirmar que os números do dashboard batem com os bens cadastrados na Fase 2.
- Fase 5: confirmar que os pins do mapa aparecem nas coordenadas corretas dos bens reais.
- Fase 8: logar com um usuário de role diferente (`visualizador`) e confirmar que criar/editar bem é bloqueado pela RLS.
