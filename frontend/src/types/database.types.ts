export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pecas: {
        Row: {
          id: number
          usuario_id: string
          nome: string | null
          categoria: string
          subcategoria: string | null
          cor_primaria: string
          cores_secundarias: string[] | null
          estacao: string | null
          ocasiao: string | null
          url_imagem_original: string
          url_imagem_sem_fundo: string
          status_processamento: string | null
          vezes_usada: number
          ultimo_uso: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: number
          usuario_id: string
          nome?: string | null
          categoria: string
          subcategoria?: string | null
          cor_primaria: string
          cores_secundarias?: string[] | null
          estacao?: string | null
          ocasiao?: string | null
          url_imagem_original: string
          url_imagem_sem_fundo: string
          status_processamento?: string | null
          vezes_usada?: number
          ultimo_uso?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: number
          usuario_id?: string
          nome?: string | null
          categoria?: string
          subcategoria?: string | null
          cor_primaria?: string
          cores_secundarias?: string[] | null
          estacao?: string | null
          ocasiao?: string | null
          url_imagem_original?: string
          url_imagem_sem_fundo?: string
          status_processamento?: string | null
          vezes_usada?: number
          ultimo_uso?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      combinacoes: {
        Row: {
          id: number
          usuario_id: string
          nome: string | null
          ocasiao: string | null
          estacao: string | null
          favorita: boolean
          vezes_usada: number
          ultimo_uso: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: number
          usuario_id: string
          nome?: string | null
          ocasiao?: string | null
          estacao?: string | null
          favorita?: boolean
          vezes_usada?: number
          ultimo_uso?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: number
          usuario_id?: string
          nome?: string | null
          ocasiao?: string | null
          estacao?: string | null
          favorita?: boolean
          vezes_usada?: number
          ultimo_uso?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      combinacoes_pecas: {
        Row: {
          combinacao_id: number
          peca_id: number
          posicao_layer: string | null
        }
        Insert: {
          combinacao_id: number
          peca_id: number
          posicao_layer?: string | null
        }
        Update: {
          combinacao_id?: number
          peca_id?: number
          posicao_layer?: string | null
        }
      }
    }
  }
}
