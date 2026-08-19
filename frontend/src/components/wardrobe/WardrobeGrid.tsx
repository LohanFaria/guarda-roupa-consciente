import React, { useState, useMemo } from 'react';
import type { Peca } from '../../types/wardrobe.types';
import { WardrobeItemCard } from './WardrobeItemCard';
import { FilterBar } from './FilterBar';
import { ItemDetailModal } from './ItemDetailModal';
import { PlusCircle, Shirt } from 'lucide-react';

interface WardrobeGridProps {
  pecas: Peca[];
  onSelectItem?: (peca: Peca) => void;
  onUseHoje?: (pecaId: number) => void;
  onDeletePeca?: (pecaId: number) => void;
  onOpenUpload: () => void;
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  pecas,
  onSelectItem,
  onUseHoje,
  onDeletePeca,
  onOpenUpload
}) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [busca, setBusca] = useState<string>('');
  const [selectedPecaForModal, setSelectedPecaForModal] = useState<Peca | null>(null);

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

  const handleCardClick = (peca: Peca) => {
    setSelectedPecaForModal(peca);
    if (onSelectItem) {
      onSelectItem(peca);
    }
  };

  return (
    <section className="flex flex-col gap-5 pb-24" data-testid="wardrobe-section">
      {/* Barra de Filtros Minimalista */}
      <FilterBar
        categoriaAtiva={categoriaAtiva}
        onSelectCategoria={setCategoriaAtiva}
        busca={busca}
        onSearchChange={setBusca}
        totalPecasPorCategoria={contadores}
      />

      {/* Grade de Peças Estilo GOAT (2 colunas mobile, 3-4 desktop) */}
      {pecasFiltradas.length === 0 ? (
        <div 
          className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 text-center py-16 px-4 flex flex-col items-center justify-center gap-3"
          data-testid="wardrobe-grid-empty"
        >
          <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-400">
            <Shirt className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wide">Nenhuma peça encontrada</h3>
          <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
            {busca ? 'Tente ajustar os termos da busca ou selecione outra categoria.' : 'Seu guarda-roupa está vazio. Cadastre sua primeira peça fotografando.'}
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-2 text-xs py-2.5 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold tracking-wide transition-all flex items-center gap-2"
            data-testid="empty-upload-button"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Peça (&lt; 30s)</span>
          </button>
        </div>
      ) : (
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          data-testid="wardrobe-grid"
        >
          {pecasFiltradas.map(peca => (
            <WardrobeItemCard
              key={peca.id}
              peca={peca}
              onClick={() => handleCardClick(peca)}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalhes da Peça */}
      <ItemDetailModal
        peca={selectedPecaForModal}
        isOpen={!!selectedPecaForModal}
        onClose={() => setSelectedPecaForModal(null)}
        onUseHoje={(id) => onUseHoje?.(id)}
        onDelete={(id) => onDeletePeca?.(id)}
      />
    </section>
  );
};
