// Matriz de Harmonia de Cores para o Guarda-Roupa Consciente (ODS 12)
import type { Peca, OutfitSugerido, Ocasiao, Estacao } from '../types/wardrobe.types';

const CORES_NEUTRAS = new Set([
  'preto',
  'branco',
  'off-white',
  'cinza',
  'bege',
  'areia',
  'marrom',
  'azul marinho',
  'jeans'
]);

const MAPA_HARMONIA: Record<string, string[]> = {
  preto: ['branco', 'cinza', 'bege', 'vermelho', 'azul', 'verde', 'rosa', 'amarelo', 'vinho'],
  branco: ['preto', 'azul marinho', 'verde', 'bege', 'terracota', 'jeans', 'cinza', 'marrom', 'rosa'],
  'off-white': ['preto', 'azul marinho', 'verde', 'bege', 'terracota', 'jeans', 'cinza', 'marrom'],
  'azul marinho': ['branco', 'off-white', 'bege', 'cinza', 'marrom', 'terracota', 'mostarda', 'rosa'],
  bege: ['azul marinho', 'branco', 'preto', 'verde oliva', 'marrom', 'terracota', 'vinho'],
  areia: ['azul marinho', 'branco', 'preto', 'verde oliva', 'marrom', 'terracota'],
  'verde militar': ['preto', 'branco', 'bege', 'cinza', 'laranja queimado', 'mostarda', 'jeans'],
  'verde oliva': ['preto', 'branco', 'bege', 'cinza', 'terracota', 'marrom', 'jeans'],
  verde: ['branco', 'preto', 'bege', 'azul marinho', 'cinza', 'jeans'],
  cinza: ['preto', 'branco', 'azul', 'rosa', 'vinho', 'amarelo', 'verde', 'vermelho'],
  'vinho / bordô': ['cinza', 'preto', 'branco', 'azul marinho', 'bege', 'rosa claro'],
  vinho: ['cinza', 'preto', 'branco', 'azul marinho', 'bege', 'rosa claro'],
  terracota: ['bege', 'branco', 'azul marinho', 'verde militar', 'preto', 'areia'],
  azul: ['branco', 'cinza', 'preto', 'bege', 'marrom', 'laranja'],
  amarelo: ['cinza', 'azul marinho', 'preto', 'branco', 'jeans'],
  mostarda: ['azul marinho', 'preto', 'cinza', 'branco', 'verde militar'],
  rosa: ['cinza', 'azul marinho', 'branco', 'preto', 'bege'],
  vermelho: ['preto', 'branco', 'cinza', 'azul marinho', 'jeans']
};

export function normalizarCor(cor: string): string {
  return cor.trim().toLowerCase();
}

export function verificarHarmoniaCores(cor1?: string, cor2?: string): boolean {
  if (!cor1 || !cor2) return true;
  
  const c1 = normalizarCor(cor1);
  const c2 = normalizarCor(cor2);

  // 1. Mesma cor (look monocromático)
  if (c1 === c2) return true;

  // 2. Se qualquer uma for neutra universal
  if (CORES_NEUTRAS.has(c1) || CORES_NEUTRAS.has(c2)) return true;

  // 3. Checagem direta na tabela de compatibilidade
  if (MAPA_HARMONIA[c1]?.some(corCompativel => c2.includes(corCompativel))) return true;
  if (MAPA_HARMONIA[c2]?.some(corCompativel => c1.includes(corCompativel))) return true;

  return false;
}

// Alias em português
export const saoCoresHarmonicas = verificarHarmoniaCores;

export interface OpcoesGeracao {
  ocasiao?: Ocasiao | 'todas';
  estacao?: Estacao | 'todas';
}

export function gerarCombinacaoInteligente(
  pecas: Peca[],
  opcoes: OpcoesGeracao = { ocasiao: 'todas', estacao: 'todas' }
): OutfitSugerido | null {
  const { ocasiao = 'todas', estacao = 'todas' } = opcoes;

  // 1. Filtrar peças disponíveis
  const disponiveis = pecas.filter(p => {
    const atendeOcasiao = ocasiao === 'todas' || p.ocasiao === ocasiao;
    const atendeEstacao = estacao === 'todas' || p.estacao === 'todas' || p.estacao === estacao;
    return atendeOcasiao && atendeEstacao;
  });

  const superiores = disponiveis.filter(p => p.categoria === 'superior');
  const inferiores = disponiveis.filter(p => p.categoria === 'inferior');
  const calcados = disponiveis.filter(p => p.categoria === 'calcado');
  const sobreposicoes = disponiveis.filter(p => p.categoria === 'sobreposicao');
  const corpoInteiro = disponiveis.filter(p => p.categoria === 'corpo_inteiro');

  // Ordenação por menor uso (ODS 12 - rotação de armário)
  const ordenarPorMenorUso = (arr: Peca[]) =>
    [...arr].sort((a, b) => (a.vezes_usada || 0) - (b.vezes_usada || 0));

  let selecionadas: Peca[] = [];
  let explicacao = '';

  if (corpoInteiro.length > 0 && Math.random() > 0.6) {
    const unico = ordenarPorMenorUso(corpoInteiro)[0];
    const shoe = calcados.find(c => verificarHarmoniaCores(c.cor_primaria, unico.cor_primaria)) || calcados[0];
    selecionadas = [unico, shoe].filter(Boolean);
    explicacao = `Look prático combinando ${unico.nome} com ${shoe?.nome || 'calçado neutro'}.`;
  } else {
    const tops = ordenarPorMenorUso(superiores);
    const bottoms = ordenarPorMenorUso(inferiores);
    const shoes = ordenarPorMenorUso(calcados);

    const top = tops[0];
    if (top) {
      const bottom = bottoms.find(b => verificarHarmoniaCores(b.cor_primaria, top.cor_primaria)) || bottoms[0];
      const shoe = shoes.find(s => 
        verificarHarmoniaCores(s.cor_primaria, top.cor_primaria) || 
        (bottom && verificarHarmoniaCores(s.cor_primaria, bottom.cor_primaria))
      ) || shoes[0];

      let layer = undefined;
      if (estacao === 'inverno' || estacao === 'meia_estacao') {
        layer = sobreposicoes.find(l => verificarHarmoniaCores(l.cor_primaria, top.cor_primaria));
      }

      selecionadas = [layer, top, bottom, shoe].filter((p): p is Peca => Boolean(p));
      explicacao = bottom 
        ? `Combinação harmonizando ${top.nome} (${top.cor_primaria}) com ${bottom.nome} (${bottom.cor_primaria}).`
        : `Combinação com as peças disponíveis no seu guarda-roupa.`;
    }
  }

  if (selecionadas.length === 0) return null;

  return {
    id: Date.now(),
    nome: `Look ${ocasiao !== 'todas' ? ocasiao : 'Consciente'}`,
    pecas: selecionadas,
    explicacao,
    score_harmonia: 95
  };
}
