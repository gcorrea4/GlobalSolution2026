# DEMO — Frontend Turma do Bem

## Rodar localmente (apontando para o backend Oracle local)

1. Crie o arquivo `.env.local` na raiz do projeto:
   ```
   VITE_API_URL=http://localhost:8080
   ```
2. Inicie o backend Quarkus local (porta 8080 por padrão).
3. Execute o frontend:
   ```bash
   npm install
   npm run dev
   ```
4. Acesse `http://localhost:5173`.

> O badge **DEMO** (laranja) aparece no header de cada dashboard apenas em modo dev.

---

## Rodar build de produção local

```bash
npm run build          # compila TypeScript + Vite
npm run preview        # serve a pasta dist/ em http://localhost:4173
```

Aponte para o backend de produção no `.env` (ou passe `VITE_API_URL` inline):
```bash
VITE_API_URL=https://challengesprint-api.azurewebsites.net npm run build && npm run preview
```

---

## Checklist de Smoke Test — dia 15/06

Execute estes passos **em ordem**, idealmente no mobile (360px) e no desktop.

- [ ] **1. Login Admin** — entrar com credenciais de admin → redireciona para `/dashboard/admin` → painel carrega sem erro no console
- [ ] **2. Admin: Visão Geral** — mapa de calor renderiza, cards de impacto exibem números
- [ ] **3. Admin: Usuários** — lista de pacientes e dentistas aparece; busca filtra corretamente; FiltroStatus aparece se backend retorna campo `status`
- [ ] **4. Admin: Métricas** — aba "Métricas" carrega KPI cards (ou skeleton → erro amigável se endpoint indisponível)
- [ ] **5. Login Dentista** — entrar com credenciais de dentista → fila de triagem exibe pacientes ordenados por score
- [ ] **6. Dentista: Adotar paciente** — clicar em "Avaliar" → modal abre → clicar "Adotar" → paciente vai para "Meus Pacientes"
- [ ] **7. Dentista: Prontuário** — clicar em prontuário de paciente adotado → ModalFichaAtiva abre → aba de histórico renderiza (TicketTimeline ou empty state)
- [ ] **8. Login Paciente** — entrar com credenciais de paciente → painel carrega → TicketNumero aparece no card de boas-vindas (se userId válido) → timeline "Linha do tempo do seu caso" renderiza (skeleton ou eventos)
- [ ] **9. Ticket público (válido)** — acessar `/ticket/TDB-2026-00001` sem estar logado → página renderiza com cabeçalho mínimo, badge de status e timeline (ou loading/empty)
- [ ] **10. Ticket público (inválido)** — acessar `/ticket/INVALIDO` → exibe "Código inválido" com link de volta ao início; sem erro de console
