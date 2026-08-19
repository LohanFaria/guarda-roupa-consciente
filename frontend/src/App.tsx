import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav, type TabType } from './components/layout/BottomNav';
import { WardrobeGrid } from './components/wardrobe/WardrobeGrid';
import { OutfitCanvas } from './components/outfit/OutfitCanvas';
import { SavedLooksList } from './components/outfit/SavedLooksList';
import { ImpactView } from './components/impact/ImpactView';
import { CameraCaptureModal } from './components/upload/CameraCaptureModal';
import { AuthModal } from './components/auth/AuthModal';
import { wardrobeService } from './services/wardrobeService';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import type { Peca, NovaPeca, OutfitSugerido } from './types/wardrobe.types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wardrobe');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [looksSalvos, setLooksSalvos] = useState<OutfitSugerido[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifica sessão ativa do Supabase
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user?.email) {
          setUserEmail(data.user.email);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email || null);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Carrega dados iniciais
  const carregarDados = async () => {
    try {
      setIsLoading(true);
      const [pecasList, looksList] = await Promise.all([
        wardrobeService.listarPecas(),
        wardrobeService.listarLooksSalvos()
      ]);
      setPecas(pecasList);
      setLooksSalvos(looksList);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [userEmail]);

  // Cadastrar nova peça
  const handlePecaSalva = async (novaPeca: NovaPeca) => {
    const salva = await wardrobeService.cadastrarPeca(novaPeca);
    setPecas(prev => [salva, ...prev]);
    setActiveTab('wardrobe');
  };

  // Registrar uso de uma peça avulsa
  const handleUseHoje = async (pecaId: number) => {
    await wardrobeService.incrementarUsoPeca(pecaId);
    setPecas(prev =>
      prev.map(p => (p.id === pecaId ? { ...p, vezes_usada: (p.vezes_usada || 0) + 1 } : p))
    );
  };

  // Excluir peça
  const handleDeletePeca = async (pecaId: number) => {
    await wardrobeService.excluirPeca(pecaId);
    setPecas(prev => prev.filter(p => p.id !== pecaId));
  };

  // Salvar look nos favoritos
  const handleSalvarLook = async (look: OutfitSugerido) => {
    await wardrobeService.salvarLook(look);
    const atualizados = await wardrobeService.listarLooksSalvos();
    setLooksSalvos(atualizados);
  };

  // Registrar uso do look completo
  const handleUsarLook = async (look: OutfitSugerido) => {
    for (const p of look.pecas) {
      await wardrobeService.incrementarUsoPeca(p.id);
    }
    const pecasAtualizadas = await wardrobeService.listarPecas();
    setPecas(pecasAtualizadas);
  };

  // Sair da conta
  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUserEmail(null);
  };

  // Cálculo da taxa de reuso para o Header
  const totalPecas = pecas.length;
  const pecasUsadas = pecas.filter(p => p.vezes_usada > 0).length;
  const taxaReuso = totalPecas > 0 ? Math.round((pecasUsadas / totalPecas) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-white">
      {/* Header Fixo */}
      <Header
        totalPecas={totalPecas}
        taxaReuso={taxaReuso}
        userEmail={userEmail}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Conteúdo Principal por Aba */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 pt-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400">
            <div className="w-9 h-9 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
            <p className="text-xs">Carregando seu guarda-roupa consciente...</p>
          </div>
        ) : (
          <>
            {activeTab === 'wardrobe' && (
              <WardrobeGrid
                pecas={pecas}
                onUseHoje={handleUseHoje}
                onDeletePeca={handleDeletePeca}
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            )}

            {activeTab === 'generator' && (
              <OutfitCanvas
                pecas={pecas}
                onSalvarLook={handleSalvarLook}
                onRegistrarUsoLook={handleUsarLook}
              />
            )}

            {activeTab === 'saved' && (
              <SavedLooksList
                looks={looksSalvos}
                onUsarLook={handleUsarLook}
              />
            )}

            {activeTab === 'impact' && (
              <ImpactView pecas={pecas} />
            )}
          </>
        )}
      </main>

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(email) => setUserEmail(email)}
      />

      {/* Modal de Cadastro Rápido (< 30s) */}
      <CameraCaptureModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onPecaSalva={handlePecaSalva}
      />

      {/* Barra de Navegação Inferior (Mobile-first) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
      />
    </div>
  );
};

export default App;
