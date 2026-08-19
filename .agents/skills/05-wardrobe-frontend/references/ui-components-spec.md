# Especificação de Componentes de Interface (UI Specs)

Este documento especifica a hierarquia visual, estados e propriedades de cada componente chave do Guarda-Roupa Consciente.

---

## 1. Componente: `CameraCaptureModal.tsx` / `UploadModal.tsx`

Responsável pelo cadastro rápido (meta < 30 segundos).

- **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onUploadComplete: (peca: Peca) => void`
- **Estados Internos:**
  - `idle`: Botões para abrir Câmera Nativa ou Escolher da Galeria.
  - `processing_bg`: Spinner com texto "Removendo fundo da imagem...".
  - `processing_ai`: Spinner com texto "Categorizando peça e cores...".
  - `confirmation`: Exibe a imagem sem fundo + formulário pré-preenchido com badges editáveis:
    - [ Camiseta ] (dropdown categoria)
    - [ Preto ] (seletor cor)
    - [ Verão ] (seletor estação)
  - `success`: Animação de check verde e fechamento automático.

---

## 2. Componente: `WardrobeItemCard.tsx`

Card individual de peça na grade do guarda-roupa.

- **Props:**
  - `peca: Peca`
  - `onClick?: () => void`
  - `onDelete?: (id: number) => void`
- **Visual:**
  - Proporção 4:5 com cantos arredondados (`rounded-2xl`).
  - Imagem PNG sem fundo centralizada com leve efeito de sombra flutuante (`drop-shadow-lg`).
  - Badge de cor e categoria no topo ou rodapé sutil.
  - Indicador de vezes usada (ex: `🔥 4x` ou `💤 Nunca usada`).

---

## 3. Componente: `OutfitCanvas.tsx`

Canvas interativo vertical para exibição e montagem do outfit.

- **Props:**
  - `outfit: OutfitSugerido | null`
  - `onRegenerate: () => void`
  - `onSaveFavorite: (outfit: OutfitSugerido) => void`
  - `onLogWear: (outfit: OutfitSugerido) => void`
  - `onChangeItem: (categoria: string) => void`
- **Layout:**
  - Slot Topo: Peça Superior ou Corpo Inteiro.
  - Slot Meio: Peça Inferior (se não for corpo inteiro).
  - Slot Base: Calçado.
  - Slot Lateral / Acessório: Jaqueta, bolsa ou óculos.
  - Barra de ações inferiores com botões de destaque:
    - `🎲 Novo Look`
    - `❤️ Favoritar`
    - `✨ Vou usar hoje`

---

## 4. Componente: `BottomNav.tsx`

Navegação fixa inferior para smartphones.

- **Abas:**
  1. `👔 Guarda-Roupa` (Ícone de cabide / grade)
  2. `✨ Gerador` (Ícone de varinha mágica / spark)
  3. `➕ Adicionar` (Botão circular central em destaque)
  4. `❤️ Salvos` (Ícone de coração / favoritos)
  5. `📊 Impacto ODS` (Indicador de sustentabilidade e reuso)
