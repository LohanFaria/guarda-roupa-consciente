import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WardrobeItemCard } from '../components/wardrobe/WardrobeItemCard';
import type { Peca } from '../types/wardrobe.types';

const mockPeca: Peca = {
  id: 101,
  nome: 'Camiseta Básica Minimalista',
  categoria: 'superior',
  subcategoria: 'camiseta',
  cor_primaria: 'preto',
  cores_secundarias: [],
  estacao: 'verão',
  ocasiao: 'casual',
  estilo: 'básico',
  padrao_estampa: 'lisa',
  url_imagem_original: 'https://example.com/original.jpg',
  url_imagem_sem_fundo: 'https://example.com/nobg.png',
  status_processamento: 'concluido',
  vezes_usada: 3,
  usuario_id: 'user-test-1'
};

describe('Agente de Automação de UI: Componente WardrobeItemCard (Padrão GOAT)', () => {
  it('deve renderizar o Card semântico e todos os seletores requeridos', () => {
    render(<WardrobeItemCard peca={mockPeca} />);

    // 1. Container do Card
    const card = screen.getByTestId('wardrobe-card');
    expect(card).toBeInTheDocument();

    // 2. Título principal em negrito e maiúsculo
    const title = screen.getByTestId('card-title');
    expect(title).toHaveTextContent('Camiseta Básica Minimalista');

    // 3. Subtítulo com Cor e Estação
    const subtitle = screen.getByTestId('card-subtitle');
    expect(subtitle).toHaveTextContent('preto • verão');

    // 4. Imagem renderizada no container uniforme
    const image = screen.getByTestId('card-image');
    expect(image).toHaveAttribute('src', 'https://example.com/nobg.png');

    // 5. Badge de reuso / rotação
    const badge = screen.getByTestId('card-usage-badge');
    expect(badge).toHaveTextContent('3x');
  });

  it('não deve exibir botões de ação imediata na vitrine inicial mantendo o minimalismo', () => {
    render(<WardrobeItemCard peca={mockPeca} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
