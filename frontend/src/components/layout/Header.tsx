import React from 'react';
import { Leaf } from 'lucide-react';

interface HeaderProps {
  totalPecas: number;
  taxaReuso: number;
}

export const Header: React.FC<HeaderProps> = ({ totalPecas, taxaReuso }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0B0F17]/85 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
            🌿
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Guarda-Roupa Consciente
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ODS 12
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {totalPecas} {totalPecas === 1 ? 'peça catalogada' : 'peças catalogadas'}
            </p>
          </div>
        </div>

        {/* Sustentabilidade / Reuso Badge */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-inner">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400">{taxaReuso}%</span>
            <span className="text-[10px] text-slate-400 ml-1 hidden sm:inline">reuso ativo</span>
          </div>
        </div>
      </div>
    </header>
  );
};
