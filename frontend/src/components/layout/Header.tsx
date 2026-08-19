import React from 'react';
import { Leaf, User, LogOut } from 'lucide-react';

interface HeaderProps {
  totalPecas: number;
  taxaReuso: number;
  userEmail: string | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalPecas,
  taxaReuso,
  userEmail,
  onOpenAuth,
  onSignOut
}) => {
  return (
    <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3" data-testid="header-component">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base">
            🌿
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5" data-testid="header-title">
              Guarda-Roupa Consciente
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                ODS 12
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400" data-testid="header-pieces-count">
              {totalPecas} {totalPecas === 1 ? 'peça catalogada' : 'peças catalogadas'}
            </p>
          </div>
        </div>

        {/* Badges e Perfil */}
        <div className="flex items-center gap-2">
          {/* Sustentabilidade / Reuso Badge */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full" data-testid="header-reuse-badge">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">{taxaReuso}%</span>
              <span className="text-[10px] text-neutral-400 ml-1 hidden sm:inline">reuso</span>
            </div>
          </div>

          {/* Botão de Usuário / Login */}
          {userEmail ? (
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 pl-2.5 pr-1.5 py-1 rounded-full">
              <span className="text-[11px] font-medium text-neutral-300 max-w-[90px] sm:max-w-[140px] truncate" title={userEmail}>
                {userEmail.split('@')[0]}
              </span>
              <button
                onClick={onSignOut}
                title="Sair da Conta"
                className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-500 hover:text-rose-400 transition-colors"
                data-testid="header-logout-button"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95"
              data-testid="header-login-button"
            >
              <User className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
