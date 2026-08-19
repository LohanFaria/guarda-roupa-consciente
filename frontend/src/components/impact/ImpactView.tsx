import React from 'react';
import type { Peca } from '../../types/wardrobe.types';
import { Leaf, Droplets, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ImpactViewProps {
  pecas: Peca[];
}

export const ImpactView: React.FC<ImpactViewProps> = ({ pecas }) => {
  const totalPecas = pecas.length;
  const pecasUsadas = pecas.filter(p => p.vezes_usada > 0).length;
  const totalUsos = pecas.reduce((acc, p) => acc + (p.vezes_usada || 0), 0);
  const taxaReuso = totalPecas > 0 ? Math.round((pecasUsadas / totalPecas) * 100) : 0;

  // Estimativas de economia com base na redução de novas compras (ODS 12)
  // Fabricação de 1 camiseta de algodão consome ~2.700 litros de água
  const litrosAguaPoupados = Math.round(totalUsos * 350); 

  return (
    <div className="flex flex-col gap-5 pb-24 max-w-lg mx-auto">
      {/* Header ODS 12 */}
      <div className="glass-card p-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div>
              <h2 className="text-base font-bold text-white">Impacto ODS 12 — Meta 12.2</h2>
              <p className="text-[11px] text-emerald-400 font-medium">Consumo e Produção Responsáveis</p>
            </div>
          </div>
          <span className="text-xs font-extrabold bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-full">
            {taxaReuso}% Ativo
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Ao recombinar peças existentes e dar visibilidade ao que você já possui, reduzimos a pressão sobre os recursos hídricos e têxteis do planeta.
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 flex flex-col gap-1 border-white/10">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Leaf className="w-4 h-4" />
            <span className="text-xs font-bold">Taxa de Reuso</span>
          </div>
          <span className="text-2xl font-extrabold text-white">{taxaReuso}%</span>
          <p className="text-[10px] text-slate-400">{pecasUsadas} de {totalPecas} peças ativas</p>
        </div>

        <div className="glass-card p-4 flex flex-col gap-1 border-white/10">
          <div className="flex items-center gap-2 text-sky-400 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-bold">Água Preservada</span>
          </div>
          <span className="text-2xl font-extrabold text-white">~{litrosAguaPoupados}L</span>
          <p className="text-[10px] text-slate-400">Por extensão de vida útil</p>
        </div>
      </div>

      {/* Dicas de Consumo Consciente */}
      <div className="glass-card p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Peças que pedem atenção</span>
        </h3>

        {pecas.filter(p => p.vezes_usada === 0).length === 0 ? (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            Parabéns! Todas as suas peças cadastradas já foram usadas pelo menos uma vez.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">
              Você tem {pecas.filter(p => p.vezes_usada === 0).length} peças que ainda não foram usadas. O gerador vai priorizá-las no próximo look!
            </p>
          </div>
        )}
      </div>

      {/* Espaço de Validação Qualitativa da Atividade Extensionista 4 */}
      <div className="glass-card p-4 flex flex-col gap-2 border-indigo-500/20 bg-indigo-950/20">
        <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-indigo-400" />
          <span>Atividade Extensionista 4 (Gran Faculdade)</span>
        </h3>
        <p className="text-[11px] text-slate-300">
          Projeto prático desenvolvido por Lohan Faria como solução digital para incentivo à economia circular e conscientização de vestuário.
        </p>
      </div>
    </div>
  );
};
