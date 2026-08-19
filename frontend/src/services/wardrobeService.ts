import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Peca, NovaPeca, OutfitSugerido } from '../types/wardrobe.types';
import { INITIAL_MOCK_PECAS } from './mockWardrobeData';

const LOCAL_STORAGE_KEY = 'guarda_roupa_pecas_v1';
const LOCAL_LOOKS_KEY = 'guarda_roupa_looks_v1';

export const wardrobeService = {
  async listarPecas(usuarioId: string = 'local-user'): Promise<Peca[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('pecas')
          .select('*')
          .eq('usuario_id', usuarioId)
          .order('criado_em', { ascending: false });

        if (error) {
          console.error('Erro Supabase, carregando local:', error);
        } else if (data && data.length > 0) {
          return data as unknown as Peca[];
        }
      } catch (e) {
        console.error('Falha de conexão com Supabase:', e);
      }
    }

    // Fallback LocalStorage / Mock
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Erro ao ler localStorage', e);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PECAS));
    return INITIAL_MOCK_PECAS;
  },

  async cadastrarPeca(novaPeca: NovaPeca): Promise<Peca> {
    const pecaCompleta: Peca = {
      ...novaPeca,
      id: Date.now(),
      vezes_usada: novaPeca.vezes_usada || 0,
      criado_em: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const response: any = await (supabase.from('pecas') as any)
          .insert([novaPeca])
          .select()
          .single();

        if (!response.error && response.data) {
          return response.data as Peca;
        }
      } catch (e) {
        console.error('Falha ao salvar no Supabase:', e);
      }
    }

    // Salva no LocalStorage
    const pecas = await this.listarPecas(novaPeca.usuario_id);
    const atualizadas = [pecaCompleta, ...pecas];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atualizadas));
    return pecaCompleta;
  },

  async incrementarUsoPeca(pecaId: number): Promise<void> {
    const pecas = await this.listarPecas();
    const atualizadas = pecas.map(p => {
      if (p.id === pecaId) {
        return {
          ...p,
          vezes_usada: (p.vezes_usada || 0) + 1,
          ultimo_uso: new Date().toISOString()
        };
      }
      return p;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atualizadas));
  },

  async listarLooksSalvos(): Promise<OutfitSugerido[]> {
    const stored = localStorage.getItem(LOCAL_LOOKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async salvarLook(look: OutfitSugerido): Promise<void> {
    const looks = await this.listarLooksSalvos();
    const novoLook = {
      ...look,
      id: look.id || Date.now(),
      favorita: true,
      criado_em: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_LOOKS_KEY, JSON.stringify([novoLook, ...looks]));
  }
};
