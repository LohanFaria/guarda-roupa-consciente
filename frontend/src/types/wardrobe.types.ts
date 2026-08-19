export type CategoriaPeca = 
  | 'superior' 
  | 'inferior' 
  | 'corpo_inteiro' 
  | 'sobreposicao' 
  | 'calcado' 
  | 'acessorio';

export type Estacao = 'verao' | 'inverno' | 'meia_estacao' | 'todas';

export type Ocasiao = 'casual' | 'trabalho' | 'festa' | 'esporte';

export type PadraoEstampa = 'lisa' | 'listrada' | 'xadrez' | 'floral' | 'estampada' | 'grafica';

export interface Peca {
  id: number;
  usuario_id: string;
  nome: string;
  categoria: CategoriaPeca;
  subcategoria?: string;
  cor_primaria: string;
  cores_secundarias?: string[];
  estacao: Estacao;
  ocasiao: Ocasiao;
  estilo?: string;
  padrao_estampa?: PadraoEstampa;
  url_imagem_original: string;
  url_imagem_sem_fundo: string;
  status_processamento?: 'pendente' | 'processando' | 'concluido' | 'falha';
  vezes_usada: number;
  ultimo_uso?: string | null;
  criado_em: string;
  atualizado_em?: string;
}

export type NovaPeca = Omit<Peca, 'id' | 'criado_em' | 'atualizado_em' | 'vezes_usada'> & {
  vezes_usada?: number;
};

export interface OutfitSugerido {
  id?: number;
  nome?: string;
  pecas: Peca[];
  explicacao: string;
  score_harmonia: number;
  ocasiao?: Ocasiao;
  estacao?: Estacao;
  favorita?: boolean;
  vezes_usada?: number;
  ultimo_uso?: string | null;
}
