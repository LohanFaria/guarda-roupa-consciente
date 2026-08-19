import React from 'react';
import type { Peca } from '../../types/wardrobe.types';
import { X, CheckCircle, Trash2, Calendar, Palette, Sun, Compass } from 'lucide-react';

interface ItemDetailModalProps {
  peca: Peca | null;
  isOpen: boolean;
  onClose: () => void;
  onUseHoje: (pecaId: number) => void;
  onDelete?: (pecaId: number) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  peca,
  isOpen,
  onClose,
  onUseHoje,
  onDelete,
}) => {
  if (!isOpen || !peca) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      data-testid="item-detail-modal"
    >
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-neutral-400 hover:text-white border border-white/10 transition-colors"
          data-testid="modal-close-button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagem com Fundo Sólido Estilo GOAT */}
        <div className="relative w-full aspect-[4/3] bg-neutral-950 flex items-center justify-center p-8 border-b border-neutral-800/80">
          <img
            src={peca.url_imagem_sem_fundo || peca.url_imagem_original}
            alt={peca.nome}
            className="max-h-full max-w-full object-contain filter drop-shadow-xl"
            data-testid="modal-image"
          />
          <div className="absolute bottom-3 left-4">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-white/10 text-neutral-300 backdrop-blur-md">
              {peca.categoria}
            </span>
          </div>
        </div>

        {/* Informações da Peça */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight" data-testid="modal-title">
              {peca.nome}
            </h2>
            <p className="text-sm text-neutral-400 mt-0.5 capitalize">
              {peca.subcategoria || peca.categoria} • {peca.estilo || 'Casual'}
            </p>
          </div>

          {/* Grid de Atributos Minimalistas */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800 flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Cor Principal</span>
                <span className="font-semibold text-neutral-200 capitalize">{peca.cor_primaria}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800 flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Estação</span>
                <span className="font-semibold text-neutral-200 capitalize">{peca.estacao}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800 flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Ocasião</span>
                <span className="font-semibold text-neutral-200 capitalize">{peca.ocasiao || 'Qualquer'}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Vezes Usada</span>
                <span className="font-semibold text-neutral-200">{peca.vezes_usada || 0} vezes</span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onUseHoje(peca.id);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              data-testid="modal-use-today-button"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Vestir Hoje / Registrar Uso</span>
            </button>

            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(`Deseja remover "${peca.nome}" do seu guarda-roupa?`)) {
                    onDelete(peca.id);
                    onClose();
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl bg-neutral-800/60 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                data-testid="modal-delete-button"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Peça</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
