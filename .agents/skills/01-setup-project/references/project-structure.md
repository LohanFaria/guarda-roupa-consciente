# Arquitetura e Estrutura de Pastas — Guarda-Roupa Consciente (Stack Gratuita)

Este documento detalha o padrão de organização do monorepo / repositório com Frontend Web (React + Vite) e Backend Python (FastAPI + Rembg + Google Gemini).

## Estrutura de Diretórios

```text
guarda-roupa-virtual/
├── .agents/
│   └── skills/                  # Suíte de skills Antigravity
├── backend/                     # Orquestrador de IA & Imagem (Custo Zero)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Endpoints FastAPI (/process-clothing, /health)
│   │   ├── config.py            # Carregamento de variáveis de ambiente (.env)
│   │   ├── schemas.py           # Modelos Pydantic para validação de entrada e saída
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── bg_remover.py    # Sessão rembg com modelo u2net_cloth_seg
│   │       └── gemini_vision.py # Integração com Google Gemini 1.5 Flash (Structured JSON)
│   ├── requirements.txt         # fastapi, uvicorn, rembg, pillow, google-genai, etc.
│   └── .env
├── frontend/                    # Aplicação Web PWA (Vercel / Netlify)
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── icons/
│   │   └── manifest.json        # PWA Manifest
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/            # LoginForm, AuthGuard
│   │   │   ├── common/          # Button, Modal, Badge, Toast
│   │   │   ├── layout/          # Header, BottomNav
│   │   │   ├── outfit/          # OutfitCanvas, OutfitCard, SavedLooksList
│   │   │   ├── upload/          # CameraCapture, ProcessingOverlay, TagConfirmationForm
│   │   │   └── wardrobe/        # WardrobeGrid, WardrobeItemCard, FilterBar
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── WardrobeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useWardrobe.ts
│   │   │   ├── useOutfitEngine.ts
│   │   │   └── useClothingPipeline.ts
│   │   ├── lib/
│   │   │   └── supabaseClient.ts
│   │   ├── services/
│   │   │   ├── wardrobeService.ts
│   │   │   └── clothingPipelineService.ts
│   │   ├── types/
│   │   │   ├── database.types.ts
│   │   │   └── wardrobe.types.ts
│   │   ├── utils/
│   │   │   ├── colorHarmonies.ts
│   │   │   └── imageCompressor.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── supabase/                    # Scripts SQL & RLS
│   └── migrations/
│       └── 20260818000000_init_schema.sql
└── README.md
```
