# Matriz de Harmonia de Cores e Regras de Estilo

Este documento serve como especificação para o algoritmo de regras determinísticas do motor de sugestão.

---

## 1. Grupos de Cores & Compatibilidade

### Cores Neutras Universais (Combinam com quase todas as cores):
- **Neutros Claros:** Branco, Off-white, Bege, Areia, Cinza Claro.
- **Neutros Escuros:** Preto, Cinza Chumbo, Azul Marinho, Marrom Café.

### Regras de Harmonia Cromática:

1. **Neutro + Qualquer Cor:**
   - Ex: Camiseta Branca + Calça Verde Militar (Harmonia Alta: 100%)
   - Ex: Calça Preta + Camisa Azul Claro (Harmonia Alta: 100%)

2. **Look Monocromático / Tom sobre Tom:**
   - Mesma família de cor com variações de saturação/brilho (ex: Azul Marinho + Azul Celeste).

3. **Cores Análogas:**
   - Cores vizinhas no círculo cromático (ex: Azul + Verde, Terracota + Amarelo Mostarda).

4. **Cores Complementares Clássicas:**
   - Azul + Laranja/Terracota
   - Verde + Vinho/Bordô
   - Amarelo Ocre + Roxo/Lavanda

---

## 2. Tabela de Compatibilidade Direta (Lookup Matrix)

| Cor Principal | Cores de Alta Harmonia | Cores a Evitar |
|---|---|---|
| **Preto** | Branco, Cinza, Bege, Vermelho, Azul, Verde, Rosa | (Combina universalmente) |
| **Branco / Off-white** | Preto, Azul Marinho, Verde, Bege, Terracota, Jeans | (Combina universalmente) |
| **Azul Marinho** | Branco, Bege, Cinza, Marrom, Terracota, Mostarda | Preto muito fechado (pouco contraste) |
| **Bege / Areia** | Azul Marinho, Branco, Preto, Verde Oliva, Marrom | Amarelo claro sem contraste |
| **Verde Militar / Oliva**| Preto, Branco, Bege, Cinza, Laranja queimado | Roxo vibrante |
| **Cinza** | Preto, Branco, Azul, Rosa, Vinho, Amarelo | (Neutro universal) |
| **Vinho / Bordô** | Cinza, Preto, Branco, Azul Marinho, Bege | Vermelho vivo |

---

## 3. Regras de Estampa e Proporção

1. **Regra da Estampa Única:** Se a peça superior tiver estampa (`padrao_estampa != 'lisa'`), a peça inferior deve preferencialmente ser lisa e neutra.
2. **Equilíbrio de Silhueta:** Peça superior oversized/larga combina naturalmente com peça inferior reta ou slim, e vice-versa.
3. **Filtro de Clima/Estação:**
   - **Verão:** Priorizar tecidos leves, peças curtas (bermudas/saias) ou regatas/camisetas e calçados abertos/leves.
   - **Inverno:** Exigir inclusão obrigatória de `sobreposicao` (casaco, jaqueta) ou peça de manga longa e calçado fechado.
