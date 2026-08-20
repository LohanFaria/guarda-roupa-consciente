import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  categoriaAtiva: string;
  onSelectCategoria: (categoria: string) => void;
  busca: string;
  onSearchChange: (busca: string) => void;
  totalPecasPorCategoria: Record<string, number>;
}

const CATEGORIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'superior', label: 'Superior' },
  { id: 'inferior', label: 'Inferior' },
  { id: 'calcado', label: 'Calçados' },
  { id: 'sobreposicao', label: 'Casacos' },
  { id: 'corpo_inteiro', label: 'Peça Única' }
] as const;

export const FilterBar: React.FC<FilterBarProps> = ({
  categoriaAtiva,
  onSelectCategoria,
  busca,
  onSearchChange,
  totalPecasPorCategoria
}) => {
  return (
    <div className="flex flex-col gap-3" data-testid="filter-bar">
      {/* Campo de Busca Minimalista */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        <input 
          type="text"
          value={busca}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por cor, categoria ou estilo..."
          aria-label="Buscar roupas no armário"
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-colors"
          data-testid="search-input"
        />
      </div>

      {/* Abas de Categorias Estilo GOAT Minimalista */}
      <div 
        role="tablist" 
        aria-label="Filtros de categoria do guarda-roupa"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
      >
        {CATEGORIAS.map(cat => {
          const count = totalPecasPorCategoria[cat.id] || 0;
          const isSelected = categoriaAtiva === cat.id;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategoria(cat.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isSelected
                  ? 'bg-neutral-100 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
              data-testid={`filter-tab-${cat.id}`}
            >
              <span className="uppercase tracking-wider text-[11px] font-semibold">{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isSelected ? 'bg-black/15 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
