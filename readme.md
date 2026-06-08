# 🦷 Dentista na Nuvem — Frontend

> Plataforma digital da **Turma do Bem** — ONG que conecta dentistas voluntários a jovens em vulnerabilidade social e mulheres vítimas de violência doméstica. Interface SPA com 3 painéis especializados (Admin, Dentista, Beneficiário) e sistema de tickets rastreáveis.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tests](https://img.shields.io/badge/tests-43_passing-success?style=for-the-badge)

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Stack Técnica](#-stack-técnica)
- [Como Rodar Local](#-como-rodar-local)
- [Credenciais de Demo](#-credenciais-de-demo)
- [Algoritmo Score TdB](#-algoritmo-score-tdb)
- [Sistema de Tickets](#-sistema-de-tickets)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Equipe](#-equipe)

---

## 🎯 Visão Geral

O **Dentista na Nuvem** centraliza pedidos de atendimento odontológico em **tickets rastreáveis com timeline pública** (estilo Correios), substituindo o fluxo manual de WhatsApp + e-mail que a TdB usa hoje.

A plataforma se conecta a uma API Quarkus + Oracle ([backend repo →](../dentista-na-nuvem)) e oferece:

- 🎫 **Tickets TDB-YYYY-NNNNN** com timeline visual de cada caso
- 🤖 **Triagem inteligente** combinando Score TdB determinístico + assistente Gemini
- 🗺 **Mapa de calor** com React Leaflet mostrando demanda por cidade
- 📊 **Painel de métricas** operacionais (tempo médio, SLA, top cidades)
- 🌙 **Dark mode persistente** (sem flash em F5)
- 📱 **Mobile-first** — funciona em viewport 360px

---

## ✨ Funcionalidades

### Por papel de usuário

#### 👨‍💼 Admin
- 🗺 **Heatmap de demanda** (Leaflet + leaflet.heat)
- 📋 **Lista de pacientes/dentistas** com filtros por status do ticket
- 📊 **Aba Métricas**: 4 KPIs principais + distribuição por status + top cidades/dentistas
- 💬 **Gestão de contatos** com categorização automática (Apolônias / Voluntariado / Doação)
- 📤 **Exportação PDF/CSV** de relatórios
- 🔒 **Soft-delete** com auditoria

#### 🦷 Dentista voluntário
- 🎯 **Fila de triagem inteligente** ordenada por Score TdB
- ⏱ **SLA Badge** em cada caso (verde < 48h, amarelo < 96h, vermelho > 96h)
- 👥 **Meus Pacientes** com TicketBadge de status
- 📅 **Agenda de consultas** com proposta de horários estilo marketplace
- 📝 **Prontuário com timeline** completa do ticket
- 🤖 **Chat com IA** (Gemini) contextualizado para a fila

#### 👧 Beneficiário/Paciente
- 📋 **Triagem** com 11 campos clínicos + socioeconômicos
- 🎫 **Número de ticket copiável** (TDB-YYYY-NNNNN)
- 🕐 **Timeline do caso** mostrando todas as transições
- 📅 **Recebimento de propostas** de horário com aceite com 1 clique
- 🔔 **Toast automático** quando status do caso muda

### Páginas públicas

- 🏠 **Landing page** com hero, estatísticas, programas (Dentista do Bem + Apolônias do Bem)
- ℹ️ **Sobre, FAQ, Quem Somos, Reconhecimentos**
- 💝 **Doador** com PIX + calculadora de impacto + Nota Fiscal Paulista
- 📩 **Contato** com chatbot integrado ao Gemini
- 🎫 **Consulta pública de ticket** em `/ticket/TDB-2026-XXXXX` (sem login, LGPD-safe)

---

## 🛠 Stack Técnica

| Categoria | Tecnologia | Versão | Motivação |
|---|---|---|---|
| **Framework** | React | 19 | Servidor de UI |
| **Linguagem** | TypeScript | 5.9 | Tipagem estrita |
| **Build** | Vite | 8 (Rolldown) | Hot reload instantâneo |
| **Estilização** | Tailwind CSS | v4 (CSS-first) | Utility-first sem config JS |
| **Roteamento** | React Router DOM | 7 | SPA com lazy-load |
| **Forms** | React Hook Form + Zod | 7 / 4 | Validação tipada |
| **Animações** | Framer Motion | 12 | Transições fluidas |
| **Mapas** | React Leaflet + leaflet.heat | — | Heatmap geográfico |
| **Ícones** | Lucide React | — | Stroke icons consistentes |
| **PDF** | jsPDF + jspdf-autotable | — | Exportação de relatórios |
| **Toast** | Sonner | — | Notificações não-bloqueantes |
| **Testes** | Vitest + Testing Library | — | Unitários + integração |

### Integrações externas

| API | Uso |
|---|---|
| Backend Quarkus | Autenticação, dados, IA, métricas |
| Nominatim (OSM) | Geocodificação de cidades |
| OpenRouteService | Rotas para consultas |
| Google Gemini | Triagem assistida (via backend) |

---

## 🚀 Como Rodar Local

### Pré-requisitos

- 📦 **Node.js 18+** ([download](https://nodejs.org/))
- 🦷 **Backend rodando** em `http://localhost:8080` ([instruções no repo do backend](../dentista-na-nuvem))

### Passo 1 — Clonar e instalar

```bash
git clone <repo-url>
cd Challenge-Sprint
npm install
```

### Passo 2 — Configurar API local

Crie um arquivo `.env.local` na raiz:

```bash
echo "VITE_API_URL=http://localhost:8080" > .env.local
```

> Sem esse arquivo, o frontend aponta para a API em produção (Azure).

### Passo 3 — Rodar em modo desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:5173**

Você verá um badge laranja **"DEMO"** no header — indicador visual de que está rodando em ambiente local.

### Passo 4 — Build de produção (opcional, para teste)

```bash
npm run build && npm run preview
```

### Scripts úteis

```bash
npm run dev              # Servidor de desenvolvimento (HMR)
npm run build            # Build de produção
npm run preview          # Preview do build
npm run typecheck        # tsc --noEmit
npm run lint             # ESLint
npm run test             # Vitest (43 testes)
npm run test:watch       # Vitest em watch mode
npm run test:coverage    # Cobertura
npm run check            # tsc + eslint + vitest (gate pré-commit)
npm run coords:update    # Regenera src/data/latamCoordinates.ts via Nominatim
```

---

## 🔑 Credenciais de Demo

> ℹ️ As credenciais abaixo só funcionam após rodar os `UPDATE`s descritos no README do backend.

| Papel | E-mail | Senha | Dashboard |
|---|---|---|---|
| 👨‍💼 **Admin** | `carlos.mendes@demo.com` | `demo123` | `/dashboard/admin` |
| 🦷 **Dentista** | `ana.lima@demo.com` | `demo123` | `/dashboard/dentista` |
| 👧 **Paciente** | `mateus.oliveira@demo.com` | `demo123` | `/dashboard/paciente` |

Outros dentistas (cidades diferentes para ver o heatmap funcionando):
- `pedro.alves@demo.com` (Belo Horizonte)
- `juliana.torres@demo.com` (Salvador)
- `rafael.costa@demo.com` (Curitiba)
- `mariana.souza@demo.com` (Recife)

---

## 🧮 Algoritmo Score TdB

Pacientes são priorizados por um **score 0–100** transparente e auditável:

| Critério | Peso | Detalhamento |
|---|---|---|
| 🦷 **Gravidade da dor** | 0–45 | Leve (5) · Moderada (15) · Forte (30) · Urgente/quebrado (45) |
| 💰 **Renda familiar** | 0–35 | ≤0.5 SM (35) · ≤1 SM (28) · ≤2 SM (15) · >2 SM (5) |
| 👤 **Idade (11–17)** | 0–20 | 17a (20) · 16a (17) · ... · 11a (3) — prioriza próximos da maioridade |

**Decisão de design:** algoritmo determinístico em vez de ML. Em saúde infantil + vulnerabilidade social, **explicabilidade vale mais que sofisticação** — a equipe da TdB consegue auditar e ajustar pesos sem precisar de cientista de dados. Tabelas exportadas como constantes em `src/utils/scoreUtils.ts`, cobertas por testes unitários.

---

## 🎫 Sistema de Tickets

Cada caso recebe um identificador único `TDB-YYYY-NNNNN` que serve como **fio condutor visual** entre todos os papéis do sistema.

### Estados possíveis

```
NAO_INICIADO ──→ EM_TRIAGEM ──→ AGUARDANDO_DENTISTA ──→ EM_ATENDIMENTO ──→ FINALIZADO
      │              │                    │                       │
      └──────────────┴────────────────────┴───────────────────────┴──→ CANCELADO
```

### Componentes visuais reutilizáveis

Em `src/components/ticket/`:

| Componente | Função |
|---|---|
| `<TicketBadge>` | Badge colorido com ícone + label do status |
| `<TicketNumero>` | Pill com código TDB-YYYY-NNNNN (copiável) |
| `<SLABadge>` | Tempo aberto com semáforo verde/amarelo/vermelho |
| `<TicketTimeline>` | Linha do tempo vertical com eventos animados (Framer Motion) |
| `<FiltroStatus>` | Filtro pill horizontal com contadores por status |

### Página pública (LGPD-safe)

`/ticket/TDB-2026-00042` — acessível **sem login**, mostra:
- ✅ Número do ticket + status atual
- ✅ Timeline de eventos
- ✅ Primeiro nome do dentista (se atribuído)
- ❌ NUNCA mostra nome do paciente, CPF, endereço ou descrição do problema

---

## 📂 Estrutura do Projeto

```
Challenge-Sprint/
├── public/                          # Assets estáticos
├── index.html                       # Inclui script inline para dark mode sem flash
├── package.json
├── vite.config.ts                   # Proxy /api → Azure em dev
├── vercel.json                      # Rewrites SPA
├── src/
│   ├── App.tsx
│   ├── main.tsx                     # Entry point
│   ├── config.ts                    # API_URL com fallback prod
│   ├── stl.css                      # Tailwind v4 + variantes dark
│   ├── Routes/
│   │   └── index.tsx                # Rotas + ProtectedRoute por role
│   ├── contexts/
│   │   ├── AuthContext.tsx          # JWT + sessionStorage
│   │   └── ThemeContext.tsx         # Dark mode persistente
│   ├── hooks/
│   │   ├── useDarkMode.ts
│   │   └── useToast.tsx
│   ├── components/
│   │   ├── Header.tsx               # Com DemoBadge condicional
│   │   ├── Footer.tsx
│   │   ├── ProtectedRoute.tsx       # Guard por role
│   │   ├── MapaRota.tsx             # Leaflet + OSRM
│   │   ├── StatusAgendamento.tsx
│   │   ├── ModalAvaliarPaciente.tsx
│   │   ├── ModalFichaAtiva.tsx      # Com TicketTimeline integrada
│   │   ├── ticket/
│   │   │   ├── TicketBadge.tsx
│   │   │   ├── TicketNumero.tsx
│   │   │   ├── SLABadge.tsx
│   │   │   ├── TicketTimeline.tsx
│   │   │   └── FiltroStatus.tsx
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx
│   │   └── ui/
│   │       ├── DemoBadge.tsx        # Aparece só em DEV
│   │       └── index.tsx            # Skeleton, EmptyState, Badge
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Cadastro.tsx
│   │   ├── Sobre.tsx, FAQ.tsx, QuemSomos.tsx, Reconhecimentos.tsx
│   │   ├── ApoloniasDoBem.tsx       # Programa para mulheres em violência
│   │   ├── Doador.tsx               # PIX + Nota Fiscal Paulista
│   │   ├── Contato.tsx, FormularioContato.tsx
│   │   ├── Formulario.tsx           # Triagem detalhada
│   │   ├── Prontuario.tsx
│   │   ├── CalculadoraScore.tsx
│   │   ├── TicketPublico.tsx        # /ticket/:codigo (sem auth)
│   │   ├── MetricasOperacionais.tsx # Aba do admin
│   │   ├── AdminDashboard.tsx
│   │   ├── DentistaDashboard.tsx
│   │   └── PacienteDashboard.tsx
│   ├── data/
│   │   └── latamCoordinates.ts      # Gerado por scripts/generateCoordinates.mjs
│   ├── img/                         # Hero, fotos da equipe
│   ├── lib/
│   │   ├── api.ts                   # Cliente HTTP (novos endpoints)
│   │   └── cn.ts
│   ├── utils/
│   │   ├── api.ts                   # apiFetch (injeta JWT)
│   │   ├── ticketUtils.ts           # gerarTicket, mascaraCPF (LGPD), canalConfig
│   │   ├── ticketStatusConfig.ts    # Cor, ícone, label por status
│   │   ├── sla.ts                   # Cálculo de SLA
│   │   ├── scoreUtils.ts            # Algoritmo Score TdB
│   │   ├── relatorioUtils.ts        # Geração de HTML imprimível
│   │   └── adminExportUtils.ts      # PDF/CSV
│   └── test/                        # Vitest (43 testes)
│       ├── scoreUtils.test.ts
│       ├── sla.test.ts
│       ├── login.test.tsx
│       └── routes.test.ts
└── scripts/
    └── generateCoordinates.mjs      # Nominatim batch
```

---

## ☁ Deploy

**Produção:** Vercel.

- **URL:** `https://challenge-sprint.vercel.app` (ou domínio configurado)
- **CI/CD:** GitHub Actions
- **Auto-deploy:** push na `master` dispara build + deploy

`vercel.json` faz rewrite de todas as rotas para `index.html` (SPA navigation).

A variável `VITE_API_URL` precisa ser configurada no painel da Vercel apontando para a URL do backend em produção.

---

## 🌗 Dark Mode sem flash

O `index.html` inclui um script inline que roda **antes** do React montar, evitando o flash de tema errado:

```html
<script>
  (function() {
    const t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

Importante para a apresentação: F5 ao vivo não causa "piscada" de tema.

---

## 👥 Equipe

Desenvolvido pela turma **1TDSPB — FIAP** como Challenge Sprint 2026.

| Nome | RM | GitHub |
|---|---|---|
| Gabriel Correa Souza | 567903 | [@gcorrea4](https://github.com/gcorrea4) |
| Kayque Duarte | 567980 | [@Kayque2012](https://github.com/Kayque2012) |
| Eric Maciel | 567398 | [@Eric-devops-tech](https://github.com/Eric-devops-tech) |

---

## 📄 Licença

Projeto acadêmico desenvolvido em parceria com a **ONG Turma do Bem**.
Uso restrito a fins educacionais e à demonstração do desafio.

---

<p align="center">
  Feito com 💙 e propósito · <strong>Devolver o sorriso é devolver a empregabilidade.</strong>
</p>
