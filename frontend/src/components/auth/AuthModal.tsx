import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { X, Mail, Lock, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      // Modo Demo
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(email || 'demo@guardaroupa.app');
        onClose();
      }, 500);
      return;
    }

    try {
      if (isLoginMode) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user?.email) {
          onAuthSuccess(data.user.email);
          onClose();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          setSuccessMessage('Conta criada com sucesso! Você já pode entrar.');
          setIsLoginMode(true);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    onAuthSuccess('convidado@guardaroupa.app');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      data-testid="auth-modal"
    >
      <div 
        className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar janela de autenticação"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          data-testid="auth-modal-close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-white tracking-tight">
            {isLoginMode ? 'Entrar na sua Conta' : 'Criar Conta Consciente'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isLoginMode ? 'Sincronize seu guarda-roupa na nuvem' : 'Comece a rotacionar suas roupas hoje'}
          </p>
        </div>

        {/* Alternador Login / Cadastro */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800/80 mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
              isLoginMode ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
              !isLoginMode ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Mensagens de Alerta */}
        {errorMessage ? (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        ) : null}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="auth-email" className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                data-testid="auth-email-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                data-testid="auth-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            data-testid="auth-submit-button"
          >
            {isLoading ? 'Conectando...' : isLoginMode ? 'Acessar Conta' : 'Criar Minha Conta'}
          </button>
        </form>

        {/* Opção Visitante */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
            data-testid="auth-guest-button"
          >
            Continuar em modo Demonstração / Convidado →
          </button>
        </div>
      </div>
    </div>
  );
};
