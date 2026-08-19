---
name: 05-wardrobe-frontend
description: >-
  Use esta skill quando o usuário solicitar o desenvolvimento, estilização ou refinamento da interface de usuário (UI/UX) do Guarda-Roupa Consciente: telas F1 (cadastro rápido <30s), F2 (grade do guarda-roupa), F3 (gerador de combinações) e F4 (looks salvos e histórico de uso).
---

# 05. Wardrobe Frontend & User Experience

Esta skill orienta a construção dos componentes de interface e fluxos de navegação mobile-first com design moderno, microinterações fluidas e foco na usabilidade prática descrita no PRD.

---

## 1. Fluxos Principais da Interface (F1 a F4)

### F1: Cadastro de Peça em < 30 Segundos
1. Botão flutuante de ação rápida `[ + ]` ou captura direta pela câmera do celular.
2. Preview instantâneo da foto tirada.
3. Indicador animado de progresso:
   - *"Removendo fundo..."*
   - *"Identificando peça e cores..."*
4. Exibição do card final com tags preenchidas automaticamente (categoria, cor, estação) e botão de confirmação com 1 clique.

### F2: Guarda-Roupa Digital (Grade Filtrável)
- Visualização em grade 2x2 (mobile) ou 4x4 (desktop) com as peças sem fundo flutuando sobre cards sutis.
- Barra de categorias com contadores visuais: *Todas (24), Superior (10), Inferior (6), Calçados (4), Casacos (4)*.
- Filtro rápido por Cor e Estação.

### F3: Gerador de Combinações Interativo
- Canvas vertical simulando a composição real do look:
  - Topo: Camiseta/Camisa
  - Meio: Calça/Shorts
  - Base: Tênis/Sapato
- Botão *"Gerar Novo Look"* com animação de transição suave.
- Ações no look: *Favoritar (Coração)*, *Usei Hoje (Log de Uso)*, *Trocar apenas esta peça*.

### F4: Combinações Salvas & Consciência de Consumo (ODS 12)
- Lista de looks favoritos salvos.
- Indicador de rotatividade: *"Você já usou 78% do seu guarda-roupa este mês!"* ou alerta de peças esquecidas há mais de 30 dias.

---

## 2. Padrões de Design & Tokens CSS

Consulte as especificações detalhadas de componentes em [ui-components-spec.md](./references/ui-components-spec.md).

### Variáveis de Estilo Sugeridas (`src/index.css`):
- **Backgrounds:** `#0B0F17` (Dark Mode Elegante) / `#F8FAFC` (Light Mode)
- **Cards:** Glassmorphism com `backdrop-filter: blur(12px)` e bordas sutis `rgba(255, 255, 255, 0.08)`.
- **Acentos:** `#10B981` (Verde Esmeralda / Sustentabilidade ODS 12) e `#6366F1` (Índigo Moderno).
- **Tipografia:** Inter / Outfit via Google Fonts.

---

## 3. Exemplo de Componente: Grade do Guarda-Roupa (`src/components/wardrobe/WardrobeGrid.tsx`)

```tsx
import React, { useState } from 'react';
import type { Peca } from '../../types/wardrobe.types';
import { WardrobeItemCard } from './WardrobeItemCard';
import { FilterBar } from './FilterBar';

interface WardrobeGridProps {
  pecas: Peca[];
  onSelectItem?: (peca: Peca) => void;
  isLoading?: boolean;
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({ pecas, onSelectItem, isLoading }) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [busca, setBusca] = useState<string>('');

  const pecasFiltradas = pecas.filter(peca => {
    const atendeCategoria = categoriaAtiva === 'todas' || peca.categoria === categoriaAtiva;
    const atendeBusca = !busca || peca.nome?.toLowerCase().includes(busca.toLowerCase()) || peca.cor_primaria.toLowerCase().includes(busca.toLowerCase());
    return atendeCategoria && atendeBusca;
  });

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
      <FilterBar 
        categoriaAtiva={categoriaAtiva} 
        onSelectCategoria={setCategoriaAtiva}
        busca={busca}
        onSearchChange={setBusca}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-800/40 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : pecasFiltradas.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          Nenhuma peça encontrada nessa categoria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {pecasFiltradas.map(peca => (
            <WardrobeItemCard key={peca.id} peca={peca} onClick={() => onSelectItem?.(peca)} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 4. Checklist de Verificação

- [ ] A interface é 100% responsiva em telas mobile (360px a 430px de largura).
- [ ] A navegação inferior (`BottomNav`) permite alternar facilmente entre *Guarda-Roupa*, *Criar Look*, *Favoritos* e *Adicionar Peça*.
- [ ] Animações e transições não causam engasgos (60 FPS).
- [ ] Toasts de feedback para ações de sucesso (peça cadastrada, look salvo).
