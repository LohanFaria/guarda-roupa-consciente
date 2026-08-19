import React from 'react';
import type { Peca } from '../../types/wardrobe.types';
import { Flame, Clock } from 'lucide-react';

interface WardrobeItemCardProps {
  peca: Peca;
  onClick?: () => void;
  onUseHoje?: (e: React.MouseEvent) => void;
}

export const WardrobeItemCard: React.FC<WardrobeItemCardProps> = ({ peca, onClick, onUseHoje }) => {
  return (
    <div 
      onClick={onClick}
      className="glass-card group relative flex flex-col overflow-hidden p-3 cursor-pointer hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-200"
    >
      {/* Indicador de Uso / Rotatividade */}
      <div className="flex items-center justify-between gap-1 mb-2 z-10">
        <span className="badge badge-emerald text-[10px]">
          {peca.categoria}
        </span>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
          {peca.vezes_usada > 0 ? (
            <>
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{peca.vezes_usada}x</span>
            </>
          ) : (
            <span className="text-emerald-400 text-[10px]">✨ Nova</span>
          )}
        </div>
      </div>

      {/* Imagem Flutuante */}
      <div className="relative w-full aspect-[4/5] flex items-center justify-center rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent p-2">
        <img 
          src={peca.url_imagem_sem_fundo || peca.url_imagem_original} 
          alt={peca.nome} 
          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Detalhes */}
      <div className="mt-2.5 flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-white truncate" title={peca.nome}>
          {peca.nome}
        </h3>
        
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="capitalize">{peca.cor_primaria}</span>
          <span className="capitalize text-slate-500">{peca.estacao}</span>
        </div>
      </div>

      {/* Botão Rápido: Usar Hoje */}
      {onUseHoje && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUseHoje(e);
          }}
          className="mt-2 w-full py-1.5 px-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
        >
          <Clock className="w-3 h-3" />
          <span>Registrar Uso</span>
        </button>
      )}
    </div>
  );
};
