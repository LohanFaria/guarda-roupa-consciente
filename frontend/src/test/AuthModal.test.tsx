import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthModal } from '../components/auth/AuthModal';

describe('Agente de Automação de UI: Modal de Autenticação Supabase', () => {
  it('deve alternar entre modo Login e modo Cadastro', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} onAuthSuccess={() => {}} />);

    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    expect(screen.getByText('Entrar na sua Conta')).toBeInTheDocument();

    const cadastrarBtn = screen.getByText('Cadastrar');
    fireEvent.click(cadastrarBtn);

    expect(screen.getByText('Criar Conta Consciente')).toBeInTheDocument();
  });

  it('deve permitir acesso em modo Convidado / Demonstração', () => {
    const handleAuthSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <AuthModal
        isOpen={true}
        onClose={handleClose}
        onAuthSuccess={handleAuthSuccess}
      />
    );

    const guestBtn = screen.getByTestId('auth-guest-button');
    fireEvent.click(guestBtn);

    expect(handleAuthSuccess).toHaveBeenCalledWith('convidado@guardaroupa.app');
    expect(handleClose).toHaveBeenCalled();
  });
});
