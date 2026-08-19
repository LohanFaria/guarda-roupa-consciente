import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Check, Sparkles, RefreshCw } from 'lucide-react';
import { processarFotoDeRoupa } from '../../services/clothingPipelineService';
import type { CategoriaPeca, Estacao, NovaPeca, Ocasiao, PadraoEstampa } from '../../types/wardrobe.types';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPecaSalva: (peca: NovaPeca) => void;
}

type EtapaUpload = 'selecao' | 'processando' | 'confirmacao' | 'sucesso';

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPecaSalva
}) => {
  const [etapa, setEtapa] = useState<EtapaUpload>('selecao');
  const [loadingMsg, setLoadingMsg] = useState<string>('Processando...');
  const [previewOriginal, setPreviewOriginal] = useState<string>('');
  const [previewSemFundo, setPreviewSemFundo] = useState<string>('');
  
  // Campos do Formulário Pré-Preenchidos pela IA
  const [nome, setNome] = useState<string>('');
  const [categoria, setCategoria] = useState<CategoriaPeca>('superior');
  const [corPrimaria, setCorPrimaria] = useState<string>('');
  const [estacao, setEstacao] = useState<Estacao>('todas');
  const [ocasiao, setOcasiao] = useState<Ocasiao>('casual');
  const [estilo, setEstilo] = useState<string>('');
  const [padraoEstampa, setPadraoEstampa] = useState<PadraoEstampa>('lisa');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelected = async (file: File) => {
    try {
      setEtapa('processando');
      setLoadingMsg('Removendo fundo da imagem com rembg (Custo $0)...');
      
      const originalUrl = URL.createObjectURL(file);
      setPreviewOriginal(originalUrl);

      // Simulação visual de transição para o usuário
      setTimeout(() => {
        setLoadingMsg('Identificando tipo de peça e cores com Gemini 1.5 Flash...');
      }, 1200);

      const resultado = await processarFotoDeRoupa(file);

      // Preenche os campos com a resposta da IA
      setNome(resultado.metadata.nome_sugerido);
      setCategoria(resultado.metadata.categoria);
      setCorPrimaria(resultado.metadata.cor_primaria);
      setEstacao(resultado.metadata.estacao);
      setOcasiao(resultado.metadata.ocasiao_recomendada);
      setEstilo(resultado.metadata.estilo || 'casual');
      setPadraoEstampa(resultado.metadata.padrao_estampa || 'lisa');
      setPreviewSemFundo(resultado.image_nobg_base64 || originalUrl);

      setEtapa('confirmacao');
    } catch (error) {
      console.error('Erro ao processar:', error);
      alert('Falha ao processar a foto. Você pode preencher manualmente.');
      setEtapa('confirmacao');
    }
  };

  const handleSalvar = () => {
    const novaPeca: NovaPeca = {
      usuario_id: 'local-user',
      nome: nome || 'Peça Sem Nome',
      categoria,
      cor_primaria: corPrimaria || 'preto',
      cores_secundarias: [],
      estacao,
      ocasiao,
      estilo,
      padrao_estampa: padraoEstampa,
      url_imagem_original: previewOriginal,
      url_imagem_sem_fundo: previewSemFundo || previewOriginal,
      status_processamento: 'concluido',
      vezes_usada: 0,
      ultimo_uso: null
    };

    onPecaSalva(novaPeca);
    setEtapa('sucesso');
    setTimeout(() => {
      resetModal();
      onClose();
    }, 1000);
  };

  const resetModal = () => {
    setEtapa('selecao');
    setPreviewOriginal('');
    setPreviewSemFundo('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md bg-[#0F172A] border-white/15 p-6 flex flex-col relative max-h-[90vh] overflow-y-auto">
        {/* Botão Fechar */}
        <button
          onClick={() => {
            resetModal();
            onClose();
          }}
          className="absolute right-4 top-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ETAPA 1: Seleção da Foto */}
        {etapa === 'selecao' && (
          <div className="flex flex-col items-center text-center gap-5 py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Camera className="w-8 h-8" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white">Cadastrar Nova Peça</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Tire uma foto ou escolha da galeria. A IA remove o fundo e classifica tudo em menos de 30 segundos!
              </p>
            </div>

            {/* Inputs escondidos */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={cameraInputRef} 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            />
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            />

            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="btn-primary w-full py-3.5"
              >
                <Camera className="w-5 h-5" />
                <span>Tirar Foto com a Câmera</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary w-full py-3.5"
              >
                <Upload className="w-5 h-5" />
                <span>Escolher da Galeria</span>
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: Processando com IA */}
        {etapa === 'processando' && (
          <div className="flex flex-col items-center text-center gap-6 py-12">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <Sparkles className="w-7 h-7 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-bold text-white">Processamento Inteligente</h3>
              <p className="text-xs text-emerald-400 font-medium animate-pulse">{loadingMsg}</p>
            </div>
          </div>
        )}

        {/* ETAPA 3: Confirmação com IA Pré-Preenchida */}
        {etapa === 'confirmacao' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Classificação Automática</h2>
            </div>

            {/* Preview da Peça Recortada */}
            <div className="w-full h-44 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center p-3 overflow-hidden">
              <img 
                src={previewSemFundo || previewOriginal} 
                alt="Preview sem fundo" 
                className="max-h-full max-w-full object-contain filter drop-shadow-xl"
              />
            </div>

            {/* Formulário com Valores Sugeridos */}
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium mb-1 block">Nome da Peça</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 font-medium mb-1 block">Categoria</label>
                  <select 
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaPeca)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:border-emerald-500/50 focus:outline-none"
                  >
                    <option value="superior">Superior (Camisa/Top)</option>
                    <option value="inferior">Inferior (Calça/Saia)</option>
                    <option value="calcado">Calçado</option>
                    <option value="sobreposicao">Casaco / Jaqueta</option>
                    <option value="corpo_inteiro">Corpo Inteiro (Vestido)</option>
                    <option value="acessorio">Acessório</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium mb-1 block">Cor Principal</label>
                  <input 
                    type="text" 
                    value={corPrimaria} 
                    onChange={(e) => setCorPrimaria(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:border-emerald-500/50 focus:outline-none capitalize"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 font-medium mb-1 block">Estação</label>
                  <select 
                    value={estacao}
                    onChange={(e) => setEstacao(e.target.value as Estacao)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:border-emerald-500/50 focus:outline-none capitalize"
                  >
                    <option value="todas">Todas as Estações</option>
                    <option value="verao">Verão</option>
                    <option value="inverno">Inverno</option>
                    <option value="meia_estacao">Meia Estação</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium mb-1 block">Ocasião</label>
                  <select 
                    value={ocasiao}
                    onChange={(e) => setOcasiao(e.target.value as Ocasiao)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:border-emerald-500/50 focus:outline-none capitalize"
                  >
                    <option value="casual">Casual</option>
                    <option value="trabalho">Trabalho</option>
                    <option value="festa">Festa / Evento</option>
                    <option value="esporte">Esporte</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={resetModal}
                className="btn-secondary flex-1 py-2.5 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Nova Foto</span>
              </button>

              <button
                onClick={handleSalvar}
                className="btn-primary flex-1 py-2.5 text-xs font-bold"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar & Salvar</span>
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 4: Sucesso */}
        {etapa === 'sucesso' && (
          <div className="flex flex-col items-center text-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-white">Peça Cadastrada com Sucesso!</h3>
            <p className="text-xs text-slate-400">Pronta para ser combinada no seu guarda-roupa.</p>
          </div>
        )}
      </div>
    </div>
  );
};
