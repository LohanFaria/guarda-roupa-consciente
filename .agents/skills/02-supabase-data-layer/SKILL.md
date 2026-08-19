---
name: 02-supabase-data-layer
description: >-
  Use esta skill quando o usuário solicitar a modelagem de banco de dados, migrações SQL, configuração de Row Level Security (RLS), armazenamento no Supabase Storage ou queries/serviços de dados para o Guarda-Roupa Consciente.
---

# 02. Supabase Backend & Data Layer

Esta skill orienta a implementação e manutenção do banco de dados relacional PostgreSQL, das políticas de segurança em nível de linha (RLS) e do Supabase Storage para armazenamento das fotos das peças.

---

## 1. Arquitetura de Dados

O banco de dados armazena os metadados de vestuário, o histórico de uso e as combinações favoritas, enquanto as fotos (originais e recortadas sem fundo) são armazenadas no bucket dedicado `guarda-roupa`.

### Tabelas Principais:
1. **`pecas`**: Guarda informações de cada peça (categoria, cor, estação, links das imagens, status).
2. **`combinacoes`**: Registra outfits criados, favoritos e data de último uso (ODS 12).
3. **`combinacoes_pecas`**: Tabela associativa n:n entre combinações e peças.

---

## 2. Executando as Migrações SQL

Execute os scripts SQL no Supabase Dashboard (SQL Editor) ou através da Supabase CLI:

1. **Schema e Tabelas:**
   Aplique o script completo em [schema.sql](./references/schema.sql).

2. **Políticas RLS & Storage:**
   Aplique as políticas de segurança em [rls-policies.sql](./references/rls-policies.sql).

```bash
# Se estiver usando Supabase CLI localmente:
supabase db push
# ou execute os arquivos SQL no SQL Editor do dashboard.
```

---

## 3. Padrão de Serviço de Dados (`src/services/wardrobeService.ts`)

Ao criar serviços para interagir com o Supabase, siga o padrão de tipagem forte e tratamento de erros:

```typescript
import { supabase } from '../lib/supabaseClient';
import type { Peca, NovaPeca } from '../types/wardrobe.types';

export const wardrobeService = {
  async listarPecas(usuarioId: string, filtroCategoria?: string): Promise<Peca[]> {
    let query = supabase
      .from('pecas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('criado_em', { ascending: false });

    if (filtroCategoria && filtroCategoria !== 'todas') {
      query = query.eq('categoria', filtroCategoria);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Peca[];
  },

  async cadastrarPeca(peca: NovaPeca): Promise<Peca> {
    const { data, error } = await supabase
      .from('pecas')
      .insert([peca])
      .select()
      .single();

    if (error) throw error;
    return data as Peca;
  },

  async deletarPeca(id: number): Promise<void> {
    const { error } = await supabase
      .from('pecas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
```

---

## 4. Checklist de Segurança e Validação

- [ ] Todas as tabelas têm `alter table <nome> enable row level security;`.
- [ ] O bucket `guarda-roupa` está configurado como `private` (não público) com políticas de RLS ativas para `select`, `insert`, `update` e `delete`.
- [ ] Nenhum endpoint ou query ignora o filtro `auth.uid() = usuario_id`.
- [ ] Índices criados em `usuario_id`, `categoria` e `estacao` para consultas instantâneas.
