---
name: 01-setup-project
description: >-
  Use esta skill quando o usuário solicitar a inicialização, configuração do ambiente ou estruturação da arquitetura base do projeto Guarda-Roupa Consciente (frontend, TypeScript, backend FastAPI Python, Supabase client, PWA e variáveis de ambiente).
---

# 01. Setup & Estruturação do Projeto (Stack Gratuita)

Esta skill orienta a criação do projeto a partir do zero, estabelecendo uma base sólida, moderna e 100% gratuita (sem necessidade de cartão de crédito) para o MVP.

---

## 1. Stack Tecnológica

- **Frontend (Web / PWA):** React 18+ com Vite + TypeScript + CSS Moderno / TailwindCSS.
- **Backend de IA & Imagem:** FastAPI (Python 3.10+) com `rembg` local e SDK oficial do **Google Gemini** (`google-genai` / `google-generativeai`).
- **Banco de Dados, Auth & Storage:** Supabase Free Tier (`@supabase/supabase-js`).
- **Icons & UI:** Lucide React (`lucide-react`), Canvas & compressão de imagem no browser.

---

## 2. Passo a Passo de Inicialização

### Passo 1: Inicializar o Frontend (React + TypeScript)
```bash
# Na raiz do projeto ou diretório frontend
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install @supabase/supabase-js lucide-react clsx tailwind-merge
npm install -D @types/node
```

### Passo 2: Inicializar o Backend Python (FastAPI + Rembg + Gemini)
```bash
# Criar ambiente virtual e instalar dependências
python3 -m venv venv
source venv/bin/activate # ou venv\Scripts\activate no Windows
pip install fastapi uvicorn rembg onnxruntime pillow google-genai python-dotenv python-multipart
pip freeze > requirements.txt
```

### Passo 3: Configurar Variáveis de Ambiente

Crie o arquivo `.env.example` e `.env` com as chaves gratuitas:

```env
# Supabase Configuration (Free Tier)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-if-needed

# Google AI Studio (Free Tier API Key - Sem cartão)
GEMINI_API_KEY=your-google-ai-studio-gemini-key

# Backend Local URL
VITE_API_URL=http://localhost:8000
```

> [!TIP]
> A chave do **Google Gemini** é obtida gratuitamente em [aistudio.google.com](https://aistudio.google.com/) e possui cota gratuita para desenvolvedores com suporte multimodal e JSON estruturado.

---

## 3. Estrutura de Diretórios Padronizada

Consulte a referência detalhada em [project-structure.md](./references/project-structure.md):

```text
guarda-roupa-virtual/
├── backend/                 # API FastAPI (Processamento Rembg + Gemini Vision)
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   ├── bg_remover.py
│   │   │   └── gemini_classifier.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── .env
├── frontend/                # Aplicação Web React + Vite (PWA)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── supabase/                # Migrações SQL e políticas RLS
│   └── migrations/
├── .agents/skills/          # Skills Antigravity
└── .env.example
```

---

## 4. Configuração do Cliente Supabase (`frontend/src/lib/supabaseClient.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

---

## 5. Checklist de Verificação

- [ ] Frontend React + TypeScript inicializado (`npm run dev`).
- [ ] Backend FastAPI rodando em `http://localhost:8000` (`uvicorn app.main:app --reload`).
- [ ] Obtenção da `GEMINI_API_KEY` gratuita via Google AI Studio e inserção no `.env`.
- [ ] Conexão com o Supabase Free Tier testada com sucesso.
