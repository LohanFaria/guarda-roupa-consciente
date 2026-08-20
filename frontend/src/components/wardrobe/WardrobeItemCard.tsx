import React from 'react';
import type { Peca } from '../../types/wardrobe.types';
import { Flame } from 'lucide-react';

interface WardrobeItemCardProps {
  peca: Peca;
  onClick?: () => void;
}

export const WardrobeItemCard: React.FC<WardrobeItemCardProps> = ({ peca, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Ver detalhes de ${peca.nome}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
      data-testid="wardrobe-card"
      data-peca-id={peca.id}
    >
      {/* Badge de Reuso Discreto */}
      <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
        {peca.vezes_usada > 0 ? (
          <div 
            className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/5"
            data-testid="card-usage-badge"
          >
            <Flame className="w-2.5 h-2.5 text-amber-400" />
            <span>{peca.vezes_usada}x</span>
          </div>
        ) : (
          <div 
            className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/20 px-2 py-0.5 rounded-full backdrop-blur-md"
            data-testid="card-usage-badge"
          >
            Nova
          </div>
        )}
      </div>

      {/* Container da Imagem com Fundo Sólido e Whitespace Generoso (Estilo GOAT) */}
      <div className="relative w-full aspect-square bg-neutral-950 flex items-center justify-center p-5 overflow-hidden">
        <img
          src={peca.url_imagem_sem_fundo || peca.url_imagem_original}
          alt={`${peca.nome} (${peca.cor_primaria})`}
          className="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          data-testid="card-image"
        />
      </div>

      {/* Tipografia Semântica GOAT */}
      <div className="p-3 flex flex-col gap-0.5">
        <h3 
          className="text-xs sm:text-sm font-bold text-neutral-100 uppercase tracking-tight truncate"
          title={peca.nome}
          data-testid="card-title"
        >
          {peca.nome}
        </h3>
        
        <p 
          className="text-[11px] text-neutral-400 capitalize font-medium truncate"
          data-testid="card-subtitle"
        >
          {peca.cor_primaria} • {peca.estacao === 'todas' ? 'Todas as estações' : peca.estacao}
        </p>
      </div>
    </article>
  );
};
