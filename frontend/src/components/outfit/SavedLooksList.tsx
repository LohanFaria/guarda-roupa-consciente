import React from 'react';
import type { OutfitSugerido } from '../../types/wardrobe.types';
import { Heart, Sparkles, Check } from 'lucide-react';

interface SavedLooksListProps {
  looks: OutfitSugerido[];
  onUsarLook?: (look: OutfitSugerido) => void;
}

export const SavedLooksList: React.FC<SavedLooksListProps> = ({ looks, onUsarLook }) => {
  if (looks.length === 0) {
    return (
      <div className="glass-card p-12 text-center flex flex-col items-center gap-3 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <Heart className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white">Nenhum look salvo ainda</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Gere combinações na aba "Gerador" e salve seus looks preferidos para encontrá-los facilmente aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>Combinações Favoritas ({looks.length})</span>
        </h2>
      </div>

      <div className="flex flex-col gap-3.5">
        {looks.map((look) => (
          <div key={look.id} className="glass-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{look.nome || 'Look Favorito'}</h3>
                <span className="text-[10px] text-slate-400">
                  {look.pecas.length} peças combinadas
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                <span>{look.score_harmonia}%</span>
              </div>
            </div>

            {/* Grid de Miniaturas das Peças */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
              {look.pecas.map((peca) => (
                <div key={peca.id} className="flex flex-col items-center text-center gap-1">
                  <div className="w-14 h-14 rounded-lg bg-white/[0.04] p-1 flex items-center justify-center">
                    <img
                      src={peca.url_imagem_sem_fundo || peca.url_imagem_original}
                      alt={peca.nome}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 truncate max-w-full">
                    {peca.nome}
                  </span>
                </div>
              ))}
            </div>

            {/* Ação */}
            {onUsarLook && (
              <button
                onClick={() => onUsarLook(look)}
                className="btn-secondary w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Usar este look hoje</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
