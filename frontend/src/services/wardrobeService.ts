import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Peca, NovaPeca, OutfitSugerido } from '../types/wardrobe.types';
import { INITIAL_MOCK_PECAS } from './mockWardrobeData';

const LOCAL_STORAGE_KEY = 'guarda_roupa_pecas_v1';
const LOCAL_LOOKS_KEY = 'guarda_roupa_looks_v1';

// Verifica se a string é um UUID válido
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export const wardrobeService = {
  async listarPecas(usuarioId?: string): Promise<Peca[]> {
    if (isSupabaseConfigured() && usuarioId && isValidUUID(usuarioId)) {
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
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
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

    if (isSupabaseConfigured() && novaPeca.usuario_id && isValidUUID(novaPeca.usuario_id)) {
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
    const pecas = await this.listarPecas();
    const atualizadas = [pecaCompleta, ...pecas];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atualizadas));
    return pecaCompleta;
  },

  async incrementarUsoPeca(pecaId: number): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        const { data }: any = await (supabase.from('pecas') as any).select('vezes_usada').eq('id', pecaId).single();
        if (data) {
          await (supabase.from('pecas') as any).update({
            vezes_usada: (data.vezes_usada || 0) + 1,
            ultimo_uso: new Date().toISOString()
          }).eq('id', pecaId);
        }
      } catch (e) {
        console.error('Erro ao incrementar no Supabase:', e);
      }
    }

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

  async excluirPeca(pecaId: number): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await (supabase.from('pecas') as any).delete().eq('id', pecaId);
      } catch (e) {
        console.error('Erro ao excluir no Supabase:', e);
      }
    }

    const pecas = await this.listarPecas();
    const filtradas = pecas.filter(p => p.id !== pecaId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtradas));
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
