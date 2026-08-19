# Checklist de Implantação e Homologação (Deploy Checklist - Custo Zero)

Use este checklist antes de disponibilizar o link para o grupo de teste piloto (familiares, colegas do Terra Fértil / SD).

---

## 1. Banco de Dados & Armazenamento (Supabase Free Tier)

- [ ] Tabelas criadas no PostgreSQL: `pecas`, `combinacoes`, `combinacoes_pecas`.
- [ ] Políticas de RLS aplicadas e testadas com dois usuários diferentes.
- [ ] Bucket `guarda-roupa` criado e configurado com permissão de upload restrita por `auth.uid()`.
- [ ] Provedor de autenticação ativo (Email / Senha ou Magic Link sem custo).

---

## 2. Backend FastAPI & Google Gemini 1.5 Flash

- [ ] Obtenção da `GEMINI_API_KEY` gratuita no [Google AI Studio](https://aistudio.google.com/).
- [ ] Modelo `u2net_cloth_seg` do `rembg` baixado e aquecido no startup do FastAPI.
- [ ] Rota `/api/process-clothing` testada com imagem real retornando remoção de fundo e metadados JSON em < 5s.
- [ ] Tratamento de exceções caso a foto seja de resolução excessiva ou inválida.

---

## 3. Frontend Web PWA (Vercel / Netlify)

- [ ] Deploy concluído com HTTPS habilitado.
- [ ] Variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`) preenchidas.
- [ ] Teste em dispositivos iOS (Safari) e Android (Chrome).
- [ ] Instalação PWA ("Adicionar à tela de início") testada.

---

## 4. Teste Qualitativo & Atividade Extensionista 4 (ODS 12)

- [ ] Cadastro completo de 5 a 10 peças realizado por usuário em menos de 30s por peça.
- [ ] Pelo menos 1 combinação válida sugerida pelo motor de regras.
- [ ] Coleta de depoimento simples para documentação da Atividade Extensionista 4:
  - *"A ferramenta deu visibilidade para peças que você não lembrava que tinha?"*
  - *"Fez você reconsiderar uma nova compra?"*
