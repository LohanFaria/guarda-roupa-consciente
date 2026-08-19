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
  { id: 'superior', label: 'Parte Superior' },
  { id: 'inferior', label: 'Parte Inferior' },
  { id: 'calcado', label: 'Calçados' },
  { id: 'sobreposicao', label: 'Casacos & Jaquetas' },
  { id: 'corpo_inteiro', label: 'Vestidos / Macacões' }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  categoriaAtiva,
  onSelectCategoria,
  busca,
  onSearchChange,
  totalPecasPorCategoria
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Campo de Busca */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          value={busca}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome, cor (ex: azul, bege) ou estilo..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {/* Abas de Categorias com Contadores */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIAS.map(cat => {
          const count = totalPecasPorCategoria[cat.id] || 0;
          const isSelected = categoriaAtiva === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategoria(cat.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'
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
