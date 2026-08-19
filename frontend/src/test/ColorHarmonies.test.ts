import { describe, it, expect } from 'vitest';
import { saoCoresHarmonicas, gerarCombinacaoInteligente } from '../utils/colorHarmonies';
import type { Peca } from '../types/wardrobe.types';

const mockWardrobe: Peca[] = [
  {
    id: 1,
    nome: 'Camiseta Branca',
    categoria: 'superior',
    subcategoria: 'camiseta',
    cor_primaria: 'branco',
    cores_secundarias: [],
    estacao: 'todas',
    ocasiao: 'casual',
    estilo: 'básico',
    padrao_estampa: 'lisa',
    url_imagem_original: 'url1',
    url_imagem_sem_fundo: 'url1',
    status_processamento: 'concluido',
    vezes_usada: 5,
    usuario_id: 'u1'
  },
  {
    id: 2,
    nome: 'Camisa Linho Verde Oliva',
    categoria: 'superior',
    subcategoria: 'camisa',
    cor_primaria: 'verde',
    cores_secundarias: [],
    estacao: 'verão',
    ocasiao: 'casual',
    estilo: 'casual',
    padrao_estampa: 'lisa',
    url_imagem_original: 'url2',
    url_imagem_sem_fundo: 'url2',
    status_processamento: 'concluido',
    vezes_usada: 0, // Peça esquecida (ODS 12)
    usuario_id: 'u1'
  },
  {
    id: 3,
    nome: 'Bermuda Sarja Bege',
    categoria: 'inferior',
    subcategoria: 'bermuda',
    cor_primaria: 'bege',
    cores_secundarias: [],
    estacao: 'verão',
    ocasiao: 'casual',
    estilo: 'casual',
    padrao_estampa: 'lisa',
    url_imagem_original: 'url3',
    url_imagem_sem_fundo: 'url3',
    status_processamento: 'concluido',
    vezes_usada: 1,
    usuario_id: 'u1'
  },
  {
    id: 4,
    nome: 'Tênis Branco Couro',
    categoria: 'calcado',
    subcategoria: 'tenis',
    cor_primaria: 'branco',
    cores_secundarias: [],
    estacao: 'todas',
    ocasiao: 'casual',
    estilo: 'casual',
    padrao_estampa: 'lisa',
    url_imagem_original: 'url4',
    url_imagem_sem_fundo: 'url4',
    status_processamento: 'concluido',
    vezes_usada: 4,
    usuario_id: 'u1'
  }
];

describe('Agente de Negócio: Motor de Combinações e Harmonia Cromática (ODS 12)', () => {
  it('deve identificar cores harmônicas corretamente', () => {
    expect(saoCoresHarmonicas('verde', 'bege')).toBe(true);
    expect(saoCoresHarmonicas('preto', 'branco')).toBe(true);
    expect(saoCoresHarmonicas('azul', 'azul')).toBe(true);
  });

  it('deve gerar combinação completa priorizando peças esquecidas', () => {
    const look = gerarCombinacaoInteligente(mockWardrobe, { ocasiao: 'casual', estacao: 'todas' });

    expect(look).not.toBeNull();
    expect(look?.pecas.length).toBeGreaterThanOrEqual(2);

    // Verifica que a peça esquecida (vezes_usada: 0) foi priorizada no look gerado
    const contemPecaEsquecida = look?.pecas.some(p => p.vezes_usada === 0);
    expect(contemPecaEsquecida).toBe(true);
  });
});
