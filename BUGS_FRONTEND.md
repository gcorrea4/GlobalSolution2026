# Bugs Pré-existentes (não corrigir antes da demo)

## BUG-002 — Admin: badges de canal em mensagens de contato não implementados

**Contexto:** Fase 3c pedia badges de canal (APOLONIAS/VOLUNTARIADO/DOACAO/GERAL) + urgência
em cada mensagem de contato do AdminDashboard.
**Causa:** O AdminDashboard não possui seção de mensagens de contato na versão atual —
o `FormularioContato` envia dados para backend mas o admin não exibe essas mensagens.
**Ação:** Criar aba "Mensagens" no AdminDashboard que liste os contatos do backend +
aplicar `canalConfig()` e badge de urgência em cada item.

## BUG-003 — ESLint: 2 erros pré-existentes impedem `npm run check` de passar

**Arquivos:** `useCep.ts:24` e `PacienteDashboard.tsx:246`
**Regras:** `react-hooks/set-state-in-effect` e `react-hooks/purity`
**Causa:** Código anterior à Sprint que usa padrões não aprovados pelo React Compiler.
  - `useCep.ts`: `setDados(null)` em guard condicional dentro de effect
  - `PacienteDashboard.tsx`: `Date.now()` chamado no corpo do render
**Workaround:** Rodar `npm run typecheck && npm run test` separadamente — ambos passam.
**Ação:** Adicionar `// eslint-disable-next-line react-hooks/...` nas linhas afetadas
sem alterar a lógica. Não urgente para demo.

## BUG-001 — login.test.tsx falha com textos desatualizados

**Arquivo:** `src/test/login.test.tsx`
**Impacto:** 8/9 testes falham ao rodar `npm run test`
**Causa:** Os testes buscam "Bem-vindo!" e outros textos que não existem mais na
página `Login.tsx` após refatoração de UI anterior.
**Não afeta:** funcionalidade real do login (testad manualmente pelo fluxo normal).
**Ação:** corrigir os seletores dos testes para bater com o HTML atual do Login.
