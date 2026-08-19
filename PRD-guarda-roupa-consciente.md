# PRD — Guarda-Roupa Consciente (nome provisório)

**Autor:** Lohan Faria, engenheiro de software em formação
**Contexto:** Projeto pessoal de aplicação prática, base para a Atividade Extensionista 4 (Gran Faculdade) — ODS 12, Meta 12.2
**Status:** Rascunho v1 — em definição
**Data:** Agosto de 2026

---

## 1. Problema

A maioria das pessoas usa de forma recorrente apenas uma fração pequena do próprio guarda-roupa. O restante fica esquecido, fora de vista, ou simplesmente não é lembrado no momento de se vestir. Isso gera duas consequências diretas: compra de roupa nova por impulso mesmo quando já existe algo equivalente em casa, e desperdício de recursos naturais e financeiros associados à produção têxtil.

O problema não é falta de roupa. É falta de visibilidade sobre o que já existe e falta de facilidade para recombinar essas peças.

## 2. Objetivo

Criar uma ferramenta digital simples que permita à pessoa fotografar e catalogar as peças do próprio guarda-roupa, visualizar tudo em um só lugar, e receber sugestões de combinações usando exclusivamente o que ela já possui — reduzindo, na prática, a necessidade percebida de comprar roupa nova.

Este objetivo se conecta diretamente à Meta 12.2 do ODS 12 (gestão sustentável e uso eficiente dos recursos naturais), já que a indústria têxtil é intensiva em água, energia e matéria-prima, e maximizar o reuso do que já existe reduz essa pressão de consumo.

## 3. Critérios de sucesso

Como este é um projeto individual em fase de MVP, os critérios de sucesso são propositalmente simples e verificáveis dentro do prazo da atividade extensionista:

- O usuário consegue cadastrar uma peça de roupa via foto em menos de 30 segundos.
- O sistema categoriza automaticamente a peça (tipo, cor) sem input manual do usuário.
- O usuário recebe pelo menos uma sugestão de combinação usando peças já cadastradas.
- Em teste qualitativo com um pequeno grupo de usuários reais (por exemplo, familiares, colegas do Terra Fértil, ou colegas da SD), pelo menos parte relata que a ferramenta os fez reconsiderar uma compra de roupa nova.

Esse último critério é o que amarra o projeto ao propósito real do ODS 12 — sem ele, a ferramenta vira só um organizador de fotos, sem efeito de consumo consciente.

## 4. Público-alvo

Pessoa física, sem perfil técnico, que já possui um volume razoável de roupas e sente dificuldade recorrente de "não ter o que vestir" apesar do guarda-roupa cheio. Não é voltado a lojistas, marcas, nem a públicos institucionais — isso descarta de vez qualquer tentativa de amarrar o projeto à Meta 12.7 (compras públicas), que já identificamos anteriormente como não aplicável.

## 5. Escopo do MVP

### Dentro do escopo (v1)

- Cadastro de peça de roupa via foto (câmera ou galeria).
- Remoção automática de fundo da imagem.
- Categorização automática da peça por IA (tipo de peça, cor, estação do ano aproximada).
- Visualização do guarda-roupa completo em grade, com filtro por categoria.
- Geração de sugestão de combinação (outfit) a partir das peças cadastradas.
- Marcação manual de "favorito" ou "usei recentemente" em uma combinação salva.

## 6. Funcionalidades de alto nível

| # | Funcionalidade | Descrição resumida |
|---|---|---|
| F1 | Cadastro de peça | Upload de foto, remoção de fundo, categorização automática |
| F2 | Guarda-roupa digital | Listagem e visualização das peças cadastradas, com filtros |
| F3 | Gerador de combinações | Sugestão de outfit a partir das peças existentes |
| F4 | Combinações salvas | Marcar, salvar e revisitar combinações favoritas |

Cada uma dessas funcionalidades será detalhada em requisitos funcionais e não-funcionais na próxima etapa (levantamento de requisitos em Gherkin).

## 7. Referência técnica e decisões de custo zero

Levantamento realizado em projetos abertos e produtos existentes, ajustado para garantir **custo financeiro zero (sem exigência de cartão de crédito)** durante o desenvolvimento e teste piloto:

- **ai-closet / Libre-Closet** — referências de pipeline e experiência PWA.
- **Estratégia Zero Custo Adotada:**
  - **Categorização Visual:** Substituição de APIs pagas (OpenAI) pela API do **Google Gemini (Gemini 1.5 / 2.0 Flash)** via **Google AI Studio**, que disponibiliza uma cota gratuita generosa para desenvolvedores com suporte nativo a visão multimodal e *Structured JSON Outputs*.
  - **Remoção de Fundo:** Execução local/backend com a biblioteca open source **`rembg`** (modelo `u2net_cloth_seg`), eliminando custos por imagem.
  - **Orquestração:** Backend leve em **FastAPI (Python)** para unificar a remoção de fundo e a chamada ao Gemini.
  - **Infraestrutura BaaS:** **Supabase Free Tier** (PostgreSQL, Autenticação e Storage 1GB).
  - **Hospedagem Frontend:** **Vercel / Netlify Free Tier**.

## 8. Arquitetura técnica (Stack 100% Gratuita)

A arquitetura é organizada em camadas modulares com responsabilidade única e previsibilidade:

**1. Cliente (Aplicação Web PWA)**
Interface responsiva mobile-first construída em React + TypeScript (Vite) e hospedada na **Vercel/Netlify**. Permite captura direta pela câmera, visualização do guarda-roupa em grade filtrável e exibição dinâmica dos looks sugeridos.

**2. Backend de Orquestração (FastAPI / Python)**
Microsserviço leve responsável por:
1. Receber a imagem original enviada pelo cliente.
2. Executar localmente o `rembg` com `u2net_cloth_seg` para isolar a peça de roupa.
3. Chamar a API gratuita do **Google Gemini (Gemini 1.5 Flash)** enviando a imagem e exigindo resposta estritamente estruturada em JSON (categoria, cor, estação, ocasião, estilo).
4. Persistir metadados e arquivos no Supabase e devolver a resposta estruturada para o cliente em tempo recorde.

**3. Banco de Dados e Armazenamento (Supabase Free Tier)**
- **PostgreSQL:** Tabelas `pecas`, `combinacoes` e `combinacoes_pecas` com políticas de isolamento RLS (`auth.uid() = usuario_id`).
- **Storage:** Bucket privado `guarda-roupa` para as imagens sem fundo e originais.
- **Auth:** Gerenciamento seguro de sessões e usuários.

**4. Serviços de IA (Zero Custo)**
- *Remoção de Fundo:* `rembg` (Python, ONNX Runtime).
- *Categorização Visual:* **Google Gemini 1.5 Flash** (`gemini-1.5-flash`) via Google AI Studio com `response_schema` tipado. Custo: **US$ 0,00**.

**5. Motor de Combinação (Outfit Engine)**
Motor determinístico baseado em regras de estilo, complementariedade de categorias (Superior + Inferior + Calçado + Sobreposição) e matriz de harmonia cromática. Prioriza peças menos usadas para estimular a rotação e atender diretamente ao propósito da **Meta 12.2 do ODS 12**. Guardrail opcional de validação estética via chamada adicional ao Gemini Flash.



