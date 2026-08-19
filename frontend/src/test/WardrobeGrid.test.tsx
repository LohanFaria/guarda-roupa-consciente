import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WardrobeGrid } from '../components/wardrobe/WardrobeGrid';
import type { Peca } from '../types/wardrobe.types';

const mockPecas: Peca[] = [
  {
    id: 1,
    nome: 'Camiseta Algodão Egípcio',
    categoria: 'superior',
    subcategoria: 'camiseta',
    cor_primaria: 'branco',
    cores_secundarias: [],
    estacao: 'verao',
    ocasiao: 'casual',
    estilo: 'básico',
    padrao_estampa: 'lisa',
    url_imagem_original: 'https://example.com/tshirt.jpg',
    url_imagem_sem_fundo: 'https://example.com/tshirt-nobg.png',
    status_processamento: 'concluido',
    vezes_usada: 2,
    usuario_id: 'user-test',
    criado_em: '2026-08-19T00:00:00.000Z'
  },
  {
    id: 2,
    nome: 'Calça Alfaiataria Grafite',
    categoria: 'inferior',
    subcategoria: 'calca',
    cor_primaria: 'cinza',
    cores_secundarias: [],
    estacao: 'todas',
    ocasiao: 'trabalho',
    estilo: 'elegante',
    padrao_estampa: 'lisa',
    url_imagem_original: 'https://example.com/pants.jpg',
    url_imagem_sem_fundo: 'https://example.com/pants-nobg.png',
    status_processamento: 'concluido',
    vezes_usada: 0,
    usuario_id: 'user-test',
    criado_em: '2026-08-19T00:00:00.000Z'
  }
];

describe('Agente de Automação de UI: Grade de Roupas (GOAT Grid)', () => {
  it('deve renderizar os itens na grade com seletores semânticos', () => {
    render(<WardrobeGrid pecas={mockPecas} onOpenUpload={() => {}} />);

    const grid = screen.getByTestId('wardrobe-grid');
    expect(grid).toBeInTheDocument();

    const cards = screen.getAllByTestId('wardrobe-card');
    expect(cards).toHaveLength(2);
  });

  it('deve filtrar os itens por categoria ao clicar nas abas', () => {
    render(<WardrobeGrid pecas={mockPecas} onOpenUpload={() => {}} />);

    // Filtra por "Inferior"
    const inferiorTab = screen.getByTestId('filter-tab-inferior');
    fireEvent.click(inferiorTab);

    // Deve exibir apenas a calça
    const cards = screen.getAllByTestId('wardrobe-card');
    expect(cards).toHaveLength(1);
    expect(screen.getByText('Calça Alfaiataria Grafite')).toBeInTheDocument();
    expect(screen.queryByText('Camiseta Algodão Egípcio')).not.toBeInTheDocument();
  });

  it('deve abrir o modal de detalhes ao clicar no card', () => {
    const handleSelect = vi.fn();
    render(<WardrobeGrid pecas={mockPecas} onSelectItem={handleSelect} onOpenUpload={() => {}} />);

    const cards = screen.getAllByTestId('wardrobe-card');
    fireEvent.click(cards[0]);

    expect(handleSelect).toHaveBeenCalledWith(mockPecas[0]);
    expect(screen.getByTestId('item-detail-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Camiseta Algodão Egípcio');
  });
});
