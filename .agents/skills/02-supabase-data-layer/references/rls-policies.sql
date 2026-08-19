-- ==============================================================================
-- POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS) & STORAGE POLICIES
-- ==============================================================================

-- 1. HABILITAR RLS NAS TABELAS
alter table public.pecas enable row level security;
alter table public.combinacoes enable row level security;
alter table public.combinacoes_pecas enable row level security;

-- 2. POLÍTICAS PARA A TABELA: pecas
create policy "Usuário visualiza apenas suas próprias peças"
    on public.pecas for select
    using (auth.uid() = usuario_id);

create policy "Usuário insere apenas suas próprias peças"
    on public.pecas for insert
    with check (auth.uid() = usuario_id);

create policy "Usuário atualiza apenas suas próprias peças"
    on public.pecas for update
    using (auth.uid() = usuario_id)
    with check (auth.uid() = usuario_id);

create policy "Usuário deleta apenas suas próprias peças"
    on public.pecas for delete
    using (auth.uid() = usuario_id);

-- 3. POLÍTICAS PARA A TABELA: combinacoes
create policy "Usuário visualiza apenas suas combinações"
    on public.combinacoes for select
    using (auth.uid() = usuario_id);

create policy "Usuário cria apenas suas combinações"
    on public.combinacoes for insert
    with check (auth.uid() = usuario_id);

create policy "Usuário atualiza suas próprias combinações"
    on public.combinacoes for update
    using (auth.uid() = usuario_id)
    with check (auth.uid() = usuario_id);

create policy "Usuário deleta suas próprias combinações"
    on public.combinacoes for delete
    using (auth.uid() = usuario_id);

-- 4. POLÍTICAS PARA A TABELA: combinacoes_pecas
create policy "Usuário visualiza itens de suas próprias combinações"
    on public.combinacoes_pecas for select
    using (
        exists (
            select 1 from public.combinacoes c
            where c.id = combinacoes_pecas.combinacao_id
            and c.usuario_id = auth.uid()
        )
    );

create policy "Usuário adiciona itens em suas próprias combinações"
    on public.combinacoes_pecas for insert
    with check (
        exists (
            select 1 from public.combinacoes c
            where c.id = combinacoes_pecas.combinacao_id
            and c.usuario_id = auth.uid()
        )
    );

create policy "Usuário remove itens de suas próprias combinações"
    on public.combinacoes_pecas for delete
    using (
        exists (
            select 1 from public.combinacoes c
            where c.id = combinacoes_pecas.combinacao_id
            and c.usuario_id = auth.uid()
        )
    );

-- ==============================================================================
-- 5. STORAGE POLICIES (BUCKET: guarda-roupa)
-- ==============================================================================

-- Criação do Bucket (se não existir via SQL)
insert into storage.buckets (id, name, public)
values ('guarda-roupa', 'guarda-roupa', false)
on conflict (id) do nothing;

-- Política de leitura: Somente o dono do arquivo ou com prefixo do usuário
create policy "Usuário visualiza suas próprias fotos no bucket"
    on storage.objects for select
    using (bucket_id = 'guarda-roupa' and auth.uid()::text = (storage.foldername(name))[1]);

-- Política de upload: O usuário só pode fazer upload na sua pasta (auth.uid()/...)
create policy "Usuário insere fotos em sua própria pasta"
    on storage.objects for insert
    with check (bucket_id = 'guarda-roupa' and auth.uid()::text = (storage.foldername(name))[1]);

-- Política de exclusão de fotos
create policy "Usuário remove suas próprias fotos"
    on storage.objects for delete
    using (bucket_id = 'guarda-roupa' and auth.uid()::text = (storage.foldername(name))[1]);
