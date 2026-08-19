# Especificação Complementar: Frontend e Automação de Qualidade (UI)
**Projeto:** Guarda-Roupa Consciente
**Referência de Interface:** GOAT (Minimalismo e Foco no Produto)
**Foco:** Estruturação visual e Agente de Validação de UI

---

## 1. Estrutura do Novo Frontend (Referência Visual: GOAT)

A interface deve adotar um design minimalista, removendo distrações e focando inteiramente nas peças de roupa, reproduzindo a experiência premium de catálogos como o da plataforma GOAT.

### 1.1. Tratamento e Exibição de Imagens
* **Fundo Uniforme:** Todas as imagens devem ter o fundo removido (via `rembg` no backend) e renderizadas sobre um fundo sólido padronizado (branco ou cinza claríssimo) via CSS.
* **Espaçamento Negativo (Whitespace):** Uso extensivo de margens internas (`padding`) invisíveis ao redor da peça, permitindo que o cérebro do usuário processe a grade com rapidez e sem poluição visual.

### 1.2. Arquitetura da Grade (CSS Grid)
A vitrine do guarda-roupa será construída sobre um sistema de CSS Grid rigoroso e responsivo:
* **Mobile:** 2 colunas para maximizar o tamanho da foto na tela do celular.
* **Desktop/Tablet:** 3 a 4 colunas fluidas.
* O layout prescinde de bordas de separação entre os itens, confiando no espaçamento para definir a hierarquia.

### 1.3. O Componente `Card` de Roupa
O HTML será semântico e enxuto, facilitando a manutenção e a criação de seletores resilientes para a automação de testes.
* **Container da Imagem:** Sem sombras fortes (`box-shadow` suave apenas no hover, se houver) ou bordas arredondadas exageradas.
* **Tipografia:** 
  * Título principal em negrito para a Categoria (ex: **Camiseta Básica**).
  * Subtítulo secundário com peso menor para Cor e Estação (ex: *Preto • Verão*).
* **Ausência de Botões de Ação Imediata:** Ações secundárias (como "favoritar" ou "excluir") só devem aparecer ao expandir a peça, mantendo a vitrine inicial limpa.

---

## 2. Estratégia de Qualidade e Agente de Automação de UI

Para assegurar que os critérios de sucesso do PRD sejam atendidos — especialmente o cadastro fluido em menos de 30 segundos — e que a interface minimalista seja renderizada corretamente, a camada de frontend contará com um agente de automação de testes de UI.

### 2.1. Frameworks e Abordagem E2E
A validação funcional e visual será conduzida por uma suíte de testes automatizados ponta a ponta (E2E), estruturada em **Cypress** ou **Playwright**. Esses scripts atuarão como o agente responsável por atestar a saúde da interface antes de qualquer validação manual com o grupo de usuários piloto.

### 2.2. Escopo de Validação do Agente de UI
* **Mapeamento de Fluxos Críticos:** Testes cobrindo a jornada de upload da foto, interceptando as chamadas de rede para simular o retorno assíncrono do processamento de fundo e da categorização via IA.
* **Asserções de DOM e Semântica:** Verificação da presença correta dos seletores CSS do Card (imagem renderizada, textos de categoria e cor corretos com base no mock de dados).
* **Regressão Visual (Opcional para MVP):** Comparação de snapshots da grade de roupas para garantir que atualizações no CSS não quebrem o layout responsivo ou sobreponham os componentes visuais.
* **Validação de Performance no Client-Side:** Cronometragem automatizada do fluxo de resposta da UI para atestar a fluidez da experiência, garantindo que o tempo percebido pelo usuário respeite os limites definidos no PRD.

### 2.3. Separação de Responsabilidades (Agentes)
* **Agente de Negócio (IA via Gemini):** Valida se as peças de roupa sugeridas *combinam entre si*.
* **Agente de Qualidade (Cypress/Playwright):** Valida se a *interface da aplicação* exibe as peças corretamente, sem quebrar o layout, garantindo a integridade da UI baseada no padrão GOAT.
