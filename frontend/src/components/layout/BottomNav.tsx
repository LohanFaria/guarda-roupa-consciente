import React from 'react';
import { LayoutGrid, Sparkles, Plus, Heart, BarChart3 } from 'lucide-react';

export type TabType = 'wardrobe' | 'generator' | 'saved' | 'impact';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenUpload: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onOpenUpload }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/90 backdrop-blur-xl border-t border-white/10 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Aba 1: Guarda-Roupa */}
        <button
          onClick={() => onTabChange('wardrobe')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'wardrobe' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[11px]">Roupas</span>
        </button>

        {/* Aba 2: Gerador de Looks */}
        <button
          onClick={() => onTabChange('generator')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'generator' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px]">Gerador</span>
        </button>

        {/* Botão Central: Adicionar Peça (< 30s) */}
        <div className="-mt-6 flex flex-col items-center">
          <button
            onClick={onOpenUpload}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Adicionar nova peça de roupa"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-medium text-emerald-400 mt-1">Adicionar</span>
        </div>

        {/* Aba 3: Salvos / Favoritos */}
        <button
          onClick={() => onTabChange('saved')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'saved' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[11px]">Salvos</span>
        </button>

        {/* Aba 4: ODS 12 / Impacto */}
        <button
          onClick={() => onTabChange('impact')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'impact' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[11px]">ODS 12</span>
        </button>
      </div>
    </nav>
  );
};
