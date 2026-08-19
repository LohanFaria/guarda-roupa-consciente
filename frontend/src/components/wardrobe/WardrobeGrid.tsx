import React, { useState, useMemo } from 'react';
import type { Peca } from '../../types/wardrobe.types';
import { WardrobeItemCard } from './WardrobeItemCard';
import { FilterBar } from './FilterBar';
import { PlusCircle, Shirt } from 'lucide-react';

interface WardrobeGridProps {
  pecas: Peca[];
  onSelectItem?: (peca: Peca) => void;
  onUseHoje?: (pecaId: number) => void;
  onOpenUpload: () => void;
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  pecas,
  onSelectItem,
  onUseHoje,
  onOpenUpload
}) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [busca, setBusca] = useState<string>('');

  // Contadores por categoria
  const contadores = useMemo(() => {
    const counts: Record<string, number> = { todas: pecas.length };
    pecas.forEach(p => {
      counts[p.categoria] = (counts[p.categoria] || 0) + 1;
    });
    return counts;
  }, [pecas]);

  // Filtro dinâmico
  const pecasFiltradas = useMemo(() => {
    return pecas.filter(peca => {
      const atendeCategoria = categoriaAtiva === 'todas' || peca.categoria === categoriaAtiva;
      const b = busca.toLowerCase();
      const atendeBusca =
        !busca ||
        peca.nome?.toLowerCase().includes(b) ||
        peca.cor_primaria?.toLowerCase().includes(b) ||
        peca.estilo?.toLowerCase().includes(b) ||
        peca.subcategoria?.toLowerCase().includes(b);

      return atendeCategoria && atendeBusca;
    });
  }, [pecas, categoriaAtiva, busca]);

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Filtros */}
      <FilterBar
        categoriaAtiva={categoriaAtiva}
        onSelectCategoria={setCategoriaAtiva}
        busca={busca}
        onSearchChange={setBusca}
        totalPecasPorCategoria={contadores}
      />

      {/* Grade de Peças */}
      {pecasFiltradas.length === 0 ? (
        <div className="glass-card text-center py-16 px-4 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shirt className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white">Nenhuma peça encontrada</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            {busca ? 'Tente ajustar os termos da busca ou a categoria selecionada.' : 'Cadastre sua primeira peça fotografando suas roupas.'}
          </p>
          <button
            onClick={onOpenUpload}
            className="btn-primary mt-2 text-xs py-2 px-4"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Peça (&lt; 30s)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {pecasFiltradas.map(peca => (
            <WardrobeItemCard
              key={peca.id}
              peca={peca}
              onClick={() => onSelectItem?.(peca)}
              onUseHoje={onUseHoje ? () => onUseHoje(peca.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};
