// Matriz de Harmonia de Cores para o Guarda-Roupa Consciente (ODS 12)

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
