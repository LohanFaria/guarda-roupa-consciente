-- ==============================================================================
-- SCHEMA & POLÍTICAS: GUARDA-ROUPA CONSCIENTE (MVP v1 - ODS 12)
-- ==============================================================================

-- 1. EXTENSÕES
create extension if not exists "uuid-ossp";

-- 2. TABELA: pecas
create table if not exists public.pecas (
    id bigint primary key generated always as identity,
    usuario_id uuid not null references auth.users(id) on delete cascade,
    nome text,
    categoria text not null,
    subcategoria text,
    cor_primaria text not null,
    cores_secundarias text[] default '{}',
    estacao text default 'todas',
    ocasiao text default 'casual',
    estilo text default 'casual',
    padrao_estampa text default 'lisa',
    url_imagem_original text not null,
    url_imagem_sem_fundo text not null,
    status_processamento text default 'concluido',
    vezes_usada int default 0,
    ultimo_uso timestamp with time zone,
    criado_em timestamp with time zone default current_timestamp,
    atualizado_em timestamp with time zone default current_timestamp
);

-- 3. TABELA: combinacoes
create table if not exists public.combinacoes (
    id bigint primary key generated always as identity,
    usuario_id uuid not null references auth.users(id) on delete cascade,
    nome text default 'Look Consciente',
    ocasiao text default 'casual',
    estacao text default 'todas',
    favorita boolean default false,
    vezes_usada int default 0,
    ultimo_uso timestamp with time zone,
    criado_em timestamp with time zone default current_timestamp,
    atualizado_em timestamp with time zone default current_timestamp
);

-- 4. TABELA: combinacoes_pecas
create table if not exists public.combinacoes_pecas (
    combinacao_id bigint not null references public.combinacoes(id) on delete cascade,
    peca_id bigint not null references public.pecas(id) on delete cascade,
    posicao_layer text default 'padrao',
    primary key (combinacao_id, peca_id)
);

-- 5. ÍNDICES
create index if not exists idx_pecas_usuario on public.pecas(usuario_id);
create index if not exists idx_pecas_categoria on public.pecas(categoria);
create index if not exists idx_pecas_estacao on public.pecas(estacao);
create index if not exists idx_combinacoes_usuario on public.combinacoes(usuario_id);

-- 6. RLS POLICIES
alter table public.pecas enable row level security;
alter table public.combinacoes enable row level security;
alter table public.combinacoes_pecas enable row level security;

create policy "Usuários acessam apenas suas próprias peças"
    on public.pecas for all
    using (auth.uid() = usuario_id)
    with check (auth.uid() = usuario_id);

create policy "Usuários acessam apenas suas próprias combinações"
    on public.combinacoes for all
    using (auth.uid() = usuario_id)
    with check (auth.uid() = usuario_id);

create policy "Usuários acessam apenas itens de suas combinações"
    on public.combinacoes_pecas for all
    using (
        exists (
            select 1 from public.combinacoes c
            where c.id = combinacoes_pecas.combinacao_id
            and c.usuario_id = auth.uid()
        )
    );

-- 7. STORAGE BUCKET
insert into storage.buckets (id, name, public)
values ('guarda-roupa', 'guarda-roupa', false)
on conflict (id) do nothing;

create policy "Usuário gerencia fotos em sua pasta privada no storage"
    on storage.objects for all
    using (bucket_id = 'guarda-roupa' and auth.uid()::text = (storage.foldername(name))[1])
    with check (bucket_id = 'guarda-roupa' and auth.uid()::text = (storage.foldername(name))[1]);
