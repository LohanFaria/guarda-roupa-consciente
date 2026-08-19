import React, { useState, useEffect } from 'react';
import type { Peca, OutfitSugerido, Ocasiao, Estacao } from '../../types/wardrobe.types';
import { verificarHarmoniaCores } from '../../utils/colorHarmonies';
import { Sparkles, RefreshCw, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutfitCanvasProps {
  pecas: Peca[];
  onSalvarLook: (look: OutfitSugerido) => void;
  onRegistrarUsoLook: (look: OutfitSugerido) => void;
}

export const OutfitCanvas: React.FC<OutfitCanvasProps> = ({
  pecas,
  onSalvarLook,
  onRegistrarUsoLook
}) => {
  const [ocasiaoFiltro, setOcasiaoFiltro] = useState<Ocasiao | 'todas'>('todas');
  const [estacaoFiltro, setEstacaoFiltro] = useState<Estacao | 'todas'>('todas');
  const [lookAtual, setLookAtual] = useState<OutfitSugerido | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [salvo, setSalvo] = useState<boolean>(false);
  const [usadoHoje, setUsadoHoje] = useState<boolean>(false);

  // Algoritmo de Geração de Outfit Consciente (Priorizando Menor Uso)
  const gerarLook = () => {
    setIsGenerating(true);
    setSalvo(false);
    setUsadoHoje(false);

    setTimeout(() => {
      // 1. Filtrar peças disponíveis
      const disponiveis = pecas.filter(p => {
        const atendeOcasiao = ocasiaoFiltro === 'todas' || p.ocasiao === ocasiaoFiltro;
        const atendeEstacao = estacaoFiltro === 'todas' || p.estacao === 'todas' || p.estacao === estacaoFiltro;
        return atendeOcasiao && atendeEstacao;
      });

      const superiores = disponiveis.filter(p => p.categoria === 'superior');
      const inferiores = disponiveis.filter(p => p.categoria === 'inferior');
      const calcados = disponiveis.filter(p => p.categoria === 'calcado');
      const sobreposicoes = disponiveis.filter(p => p.categoria === 'sobreposicao');
      const corpoInteiro = disponiveis.filter(p => p.categoria === 'corpo_inteiro');

      // Priorização de peças esquecidas (ODS 12: menos usadas primeiro)
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

        // Embaralha um pouco os candidatos de topo menos usados para dar variedade
        const top = tops[Math.floor(Math.random() * Math.min(tops.length, 3))] || tops[0];
        if (top) {
          // Achar peça inferior harmoniosa
          const bottom = bottoms.find(b => verificarHarmoniaCores(b.cor_primaria, top.cor_primaria)) || bottoms[0];
          const shoe = shoes.find(s => 
            verificarHarmoniaCores(s.cor_primaria, top.cor_primaria) || 
            (bottom && verificarHarmoniaCores(s.cor_primaria, bottom.cor_primaria))
          ) || shoes[0];

          // Opcional: sobreposição se fizer frio ou meia estação
          let layer = undefined;
          if (estacaoFiltro === 'inverno' || estacaoFiltro === 'meia_estacao' || Math.random() > 0.5) {
            layer = sobreposicoes.find(l => verificarHarmoniaCores(l.cor_primaria, top.cor_primaria));
          }

          selecionadas = [layer, top, bottom, shoe].filter((p): p is Peca => Boolean(p));
          explicacao = bottom 
            ? `Combinação consciente harmonizando ${top.nome} (${top.cor_primaria}) com ${bottom.nome} (${bottom.cor_primaria}).`
            : `Combinação com as peças disponíveis no seu guarda-roupa.`;
        }
      }

      if (selecionadas.length > 0) {
        setLookAtual({
          id: Date.now(),
          nome: `Look ${ocasiaoFiltro !== 'todas' ? ocasiaoFiltro : 'Harmonioso'}`,
          pecas: selecionadas,
          explicacao,
          score_harmonia: 94
        });
      } else {
        setLookAtual(null);
      }

      setIsGenerating(false);
    }, 400);
  };

  useEffect(() => {
    if (pecas.length > 0 && !lookAtual) {
      gerarLook();
    }
  }, [pecas]);

  const handleFavoritar = () => {
    if (!lookAtual) return;
    onSalvarLook(lookAtual);
    setSalvo(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10B981', '#34D399', '#6366F1']
    });
  };

  const handleUsarHoje = () => {
    if (!lookAtual) return;
    onRegistrarUsoLook(lookAtual);
    setUsadoHoje(true);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#3B82F6']
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-24 max-w-lg mx-auto">
      {/* Controles de Filtro para a Combinação */}
      <div className="glass-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Gerador Inteligente</h2>
          </div>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Foco Reuso ODS 12
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Ocasião</label>
            <select
              value={ocasiaoFiltro}
              onChange={(e) => setOcasiaoFiltro(e.target.value as Ocasiao | 'todas')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-white capitalize focus:outline-none focus:border-emerald-500/50"
            >
              <option value="todas">Qualquer Ocasião</option>
              <option value="casual">Casual / Dia a dia</option>
              <option value="trabalho">Trabalho / Social</option>
              <option value="festa">Festa / Noite</option>
              <option value="esporte">Esporte / Treino</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Clima / Estação</label>
            <select
              value={estacaoFiltro}
              onChange={(e) => setEstacaoFiltro(e.target.value as Estacao | 'todas')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-white capitalize focus:outline-none focus:border-emerald-500/50"
            >
              <option value="todas">Qualquer Clima</option>
              <option value="verao">Verão (Calor)</option>
              <option value="inverno">Inverno (Frio)</option>
              <option value="meia_estacao">Meia Estação</option>
            </select>
          </div>
        </div>

        <button
          onClick={gerarLook}
          disabled={isGenerating}
          className="btn-primary w-full py-2.5 text-xs font-bold mt-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Combinando Peças...' : 'Gerar Nova Combinação'}</span>
        </button>
      </div>

      {/* Canvas do Outfit Sugerido */}
      {!lookAtual ? (
        <div className="glass-card p-8 text-center flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Peças insuficientes para combinar</h3>
          <p className="text-xs text-slate-400">
            Cadastre pelo menos 1 peça superior, 1 inferior e 1 calçado para gerar looks completos.
          </p>
        </div>
      ) : (
        <div className="glass-card p-5 flex flex-col gap-4 animate-fade-in">
          {/* Header do Look */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Sugestão de Estilo</span>
              <h3 className="text-base font-bold text-white">{lookAtual.nome}</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lookAtual.score_harmonia}% Harmonia</span>
            </div>
          </div>

          {/* Peças no Canvas Vertical */}
          <div className="flex flex-col gap-3 py-2">
            {lookAtual.pecas.map((peca) => (
              <div 
                key={peca.id} 
                className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-white/[0.03] p-1.5 flex items-center justify-center flex-shrink-0">
                  <img
                    src={peca.url_imagem_sem_fundo || peca.url_imagem_original}
                    alt={peca.nome}
                    className="max-h-full max-w-full object-contain filter drop-shadow"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="badge badge-emerald text-[9px]">{peca.categoria}</span>
                    {peca.vezes_usada <= 2 && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-medium">
                        Pouco Usada
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-0.5">{peca.nome}</h4>
                  <p className="text-[11px] text-slate-400 capitalize">{peca.cor_primaria} • {peca.estilo || 'casual'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Explicação da Harmonia */}
          <p className="text-xs text-slate-400 bg-black/30 p-3 rounded-xl border border-white/5 italic">
            "{lookAtual.explicacao}"
          </p>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleFavoritar}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                salvo
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${salvo ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{salvo ? 'Salvo nos Favoritos' : 'Salvar Look'}</span>
            </button>

            <button
              onClick={handleUsarHoje}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                usadoHoje
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{usadoHoje ? 'Look Registrado!' : 'Vou Usar Hoje'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
