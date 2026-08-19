-- ==============================================================================
-- SCHEMA INICIAL: GUARDA-ROUPA CONSCIENTE (MVP v1 - ODS 12)
-- ==============================================================================

-- Habilita extensão para geração de UUID caso não esteja habilitada
create extension if not exists "uuid-ossp";

-- 1. ENUMS
do $$ begin
    create type categoria_peca as enum (
      'superior',     -- camisetas, camisas, blusas, regatas, croppeds
      'inferior',     -- calças, bermudas, shorts, saias
      'corpo_inteiro',-- vestidos, macacões
      'sobreposicao', -- casacos, jaquetas, blazers, cardigans
      'calcado',      -- tênis, sapatos, sandálias, botas
      'acessorio'     -- bolsas, cintos, bonés, cachecóis
    );
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type estacao_ano as enum (
      'verao',
      'inverno',
      'meia_estacao',
      'todas'
    );
exception
    when duplicate_object then null;
end $$;

-- 2. TABELA: pecas
create table if not exists public.pecas (
    id bigint primary key generated always as identity,
    usuario_id uuid not null references auth.users(id) on delete cascade,
    nome text,
    categoria text not null, -- categoria principal (ou categoria_peca)
    subcategoria text,       -- ex: camisa social, calça jeans, tênis casual
    cor_primaria text not null,
    cores_secundarias text[] default '{}',
    estacao text default 'todas',
    ocasiao text default 'casual', -- casual, trabalho, festa, esporte
    url_imagem_original text not null,
    url_imagem_sem_fundo text not null,
    status_processamento text default 'concluido', -- 'pendente', 'processando', 'concluido', 'falha'
    vezes_usada int default 0,
    ultimo_uso timestamp with time zone,
    criado_em timestamp with time zone default current_timestamp,
    atualizado_em timestamp with time zone default current_timestamp
);

-- 3. TABELA: combinacoes (Outfits)
create table if not exists public.combinacoes (
    id bigint primary key generated always as identity,
    usuario_id uuid not null references auth.users(id) on delete cascade,
    nome text default 'Nova Combinação',
    ocasiao text default 'casual',
    estacao text default 'todas',
    favorita boolean default false,
    vezes_usada int default 0,
    ultimo_uso timestamp with time zone,
    criado_em timestamp with time zone default current_timestamp,
    atualizado_em timestamp with time zone default current_timestamp
);

-- 4. TABELA: combinacoes_pecas (Relacionamento N:N)
create table if not exists public.combinacoes_pecas (
    combinacao_id bigint not null references public.combinacoes(id) on delete cascade,
    peca_id bigint not null references public.pecas(id) on delete cascade,
    posicao_layer text default 'padrao', -- 'topo', 'base', 'sobreposicao', 'calcado'
    primary key (combinacao_id, peca_id)
);

-- 5. ÍNDICES DE PERFORMANCE
create index if not exists idx_pecas_usuario_id on public.pecas(usuario_id);
create index if not exists idx_pecas_categoria on public.pecas(categoria);
create index if not exists idx_pecas_estacao on public.pecas(estacao);
create index if not exists idx_combinacoes_usuario on public.combinacoes(usuario_id);
create index if not exists idx_combinacoes_favorita on public.combinacoes(usuario_id, favorita);

-- 6. FUNÇÃO E TRIGGER PARA AUTO-UPDATE DE atualizado_em
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.atualizado_em = current_timestamp;
    return new;
end;
$$ language plpgsql;

create or replace trigger tr_pecas_updated_at
    before update on public.pecas
    for each row execute function public.handle_updated_at();

create or replace trigger tr_combinacoes_updated_at
    before update on public.combinacoes
    for each row execute function public.handle_updated_at();
