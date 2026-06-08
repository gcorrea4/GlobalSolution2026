// ── Ticket ────────────────────────────────────────────────────────────────────

export function gerarTicket(id: number): string {
  const ano = new Date().getFullYear();
  return `TDB-${ano}-${String(id).padStart(5, '0')}`;
}

// "João Silva Costa" → "João C."  |  "Maria" → "Maria"
export function abreviarNome(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length < 2) return nome;
  return `${partes[0]} ${partes[partes.length - 1].charAt(0)}.`;
}

// ── LGPD ──────────────────────────────────────────────────────────────────────

export function mascaraCPF(cpf: string): string {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) return cpf;
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}

// ── Canal de contato ──────────────────────────────────────────────────────────

export interface CanalConfig {
  label: string;
  cls: string; // classes Tailwind para badge
}

const CANAL_MAP: Record<string, CanalConfig> = {
  APOLONIAS:    { label: 'Apolônias',    cls: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300' },
  VOLUNTARIADO: { label: 'Voluntariado', cls: 'bg-blue-100   text-blue-800   dark:bg-blue-950/40   dark:text-blue-300'   },
  DOACAO:       { label: 'Doação',       cls: 'bg-green-100  text-green-800  dark:bg-green-950/40  dark:text-green-300'  },
  GERAL:        { label: 'Geral',        cls: 'bg-gray-100   text-gray-700   dark:bg-slate-700     dark:text-slate-300'  },
};

export function canalConfig(canal: string): CanalConfig {
  return CANAL_MAP[canal] ?? CANAL_MAP['GERAL'];
}
