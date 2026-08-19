---
name: 04-outfit-engine
description: >-
  Use esta skill quando o usuário solicitar a criação, refinamento ou teste da lógica de recomendação de combinações de roupas (outfit generator, regras de harmonia de cores, complementariedade de peças, estações e guardrails).
---

# 04. Outfit Recommendation Engine

Esta skill detalha a implementação do motor de combinação de looks baseado em regras de estilo e harmonia visual, garantindo que o usuário receba sugestões coerentes usando **exclusivamente o que já existe no seu guarda-roupa** (ODS 12).

---

## 1. Regras Fundamentais de Composição

Um look completo gerado pelo motor deve respeitar uma das estruturas válidas:

1. **Estrutura Padrão (2 a 4 peças):**
   - 1x Peça Superior (`superior`)
   - 1x Peça Inferior (`inferior`)
   - 1x Calçado (`calcado`)
   - *(Opcional)* 1x Sobreposição (`sobreposicao`) ou Acessório (`acessorio`)

2. **Estrutura Única / Peça Inteira:**
   - 1x Peça de Corpo Inteiro (`corpo_inteiro`: vestido ou macacão)
   - 1x Calçado (`calcado`)
   - *(Opcional)* 1x Sobreposição / Acessório

Consulte a matriz detalhada em [matching-rules.md](./references/matching-rules.md).

---

## 2. Algoritmo de Combinação

### Algoritmo em TypeScript (`src/utils/outfitMatcher.ts`):

```typescript
import type { Peca, OutfitSugerido } from '../types/wardrobe.types';
import { verificarHarmoniaCores } from './colorHarmonies';

export function gerarSugestaoLook(
  pecasDisponiveis: Peca[],
  filtros?: { ocasiao?: string; estacao?: string }
): OutfitSugerido | null {
  // 1. Filtrar peças por estação/ocasião se especificado
  const pecasFiltradas = pecasDisponiveis.filter(p => {
    const atendeEstacao = !filtros?.estacao || p.estacao === 'todas' || p.estacao === filtros.estacao;
    const atendeOcasiao = !filtros?.ocasiao || p.ocasiao === filtros.ocasiao;
    return atendeEstacao && atendeOcasiao;
  });

  const superiores = pecasFiltradas.filter(p => p.categoria === 'superior');
  const inferiores = pecasFiltradas.filter(p => p.categoria === 'inferior');
  const calcados = pecasFiltradas.filter(p => p.categoria === 'calcado');
  const sobreposicoes = pecasFiltradas.filter(p => p.categoria === 'sobreposicao');
  const pecasUnicas = pecasFiltradas.filter(p => p.categoria === 'corpo_inteiro');

  // Priorização de peças menos usadas (Foco ODS 12: rotatividade)
  const ordenarPorMenosUsadas = (arr: Peca[]) =>
    [...arr].sort((a, b) => (a.vezes_usada || 0) - (b.vezes_usada || 0));

  // Tentar combinação de Peça Superior + Inferior + Calçado
  const tops = ordenarPorMenosUsadas(superiores);
  const bottoms = ordenarPorMenosUsadas(inferiores);
  const shoes = ordenarPorMenosUsadas(calcados);

  for (const top of tops) {
    for (const bottom of bottoms) {
      if (verificarHarmoniaCores(top.cor_primaria, bottom.cor_primaria)) {
        const shoe = shoes.find(s => 
          verificarHarmoniaCores(s.cor_primaria, top.cor_primaria) || 
          verificarHarmoniaCores(s.cor_primaria, bottom.cor_primaria)
        ) || shoes[0];

        return {
          pecas: [top, bottom, shoe].filter(Boolean),
          explicacao: `Combinação equilibrada unindo ${top.nome} (${top.cor_primaria}) com ${bottom.nome} (${bottom.cor_primaria}).`,
          score_harmonia: 95
        };
      }
    }
  }

  // Fallback: se não houver pares perfeitos, retorna a melhor combinação disponível
  if (tops.length > 0 && bottoms.length > 0) {
    return {
      pecas: [tops[0], bottoms[0], shoes[0]].filter(Boolean),
      explicacao: 'Sugestão básica com base nas peças disponíveis.',
      score_harmonia: 75
    };
  }

  return null;
}
```

---

## 3. Camada de Guardrail com Google Gemini (Opcional & Gratuito)

Para validar a harmonia de um outfit antes de exibir ao usuário, pode-se realizar uma checagem rápida utilizando a cota gratuita do **Gemini 1.5 Flash** enviando os nomes e cores das peças combinadas:

```python
# Chamada opcional de validação no backend FastAPI
def validar_look_com_gemini(top_nome: str, bottom_nome: str, shoe_nome: str, ocasiao: str):
    prompt = (
        f"As peças: [Superior: {top_nome}, Inferior: {bottom_nome}, Calçado: {shoe_nome}] "
        f"formam uma combinação harmoniosa para a ocasião '{ocasiao}'? "
        "Responda no formato JSON: {\"aprovado\": true/false, \"feedback\": \"motivo resumido\"}"
    )
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    return response.text
```


---

## 4. Checklist de Verificação

- [ ] Prioriza peças com menor contagem de uso (`vezes_usada`) para incentivar o reuso real (ODS 12).
- [ ] Valida compatibilidade de estampas (evita combinar duas peças muito estampadas simultaneamente).
- [ ] Fornece botão de "Reembaralhar / Próxima Sugestão" na interface caso o usuário queira outra opção.
- [ ] Permite travar uma peça específica (ex: "quero usar esta calça hoje") e gerar o restante do look em torno dela.
