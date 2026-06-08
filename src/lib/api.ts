import { API_URL } from '../config';

// ── Status unificado (legado + OrbitalCare) ───────────────────────────────────
export type TicketStatus =
  | 'NAO_INICIADO'
  | 'EM_TRIAGEM'
  | 'AGUARDANDO_DENTISTA'
  | 'EM_ATENDIMENTO'
  | 'FINALIZADO'
  | 'CANCELADO'
  | 'PENDENTE'
  | 'AGENDADA'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA';

// Alias semântico para o domínio de consultas
export type ConsultaStatus = Extract<
  TicketStatus,
  'PENDENTE' | 'AGENDADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA'
>;

export interface EventoHistorico {
  statusAnterior: TicketStatus | null;
  statusNovo: TicketStatus;
  autorRole: string;
  motivo: string | null;
  dataMudanca: string; // ISO 8601
}

export interface MetricasOperacionais {
  // campos novos
  total_pacientes_ativos: number;
  consultas_realizadas: number;
  medicos_ativos: number;
  regioes_atendidas: number;
  por_status_consulta: Partial<Record<ConsultaStatus, number>>;
  por_urgencia: Partial<Record<'ALTA' | 'MEDIA' | 'BAIXA', number>>;
  por_regiao: Partial<Record<string, number>>;
  por_especialidade: Partial<Record<string, number>>;
  // campos legados (compatibilidade com dashboards ainda não migrados)
  por_status_ticket: Partial<Record<TicketStatus, number>>;
  por_canal_origem: Partial<Record<'WEB' | 'APP' | 'PRESENCIAL' | 'TELEFONE', number>>;
  mensagens: {
    total: number;
    por_categoria: Partial<Record<string, number>>;
    por_urgencia_msg: Partial<Record<'ALTA' | 'MEDIA' | 'BAIXA', number>>;
  };
}

export interface Medico {
  id: number;
  nome: string;
  especialidade: string;
  crm: string;
  disponivel: boolean;
}

export interface Consulta {
  id: number;
  pacienteNome: string;
  medicoNome: string;
  especialidade: string;
  status: ConsultaStatus;
  dataAgendamento: string;
  regiao: string;
  urgencia: 'ALTA' | 'MEDIA' | 'BAIXA';
}

// ── HTTP helper ────────────────────────────────────────────────────────────────

function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem('authToken') ?? '';
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return fetch(`${API_URL}${path}`, { ...options, headers }).then(async res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  });
}

// ── APIs ───────────────────────────────────────────────────────────────────────

export const consultasApi = {
  listar: () =>
    request<Consulta[]>('/consultas'),

  agendar: (dados: Omit<Consulta, 'id' | 'status'>) =>
    request<Consulta>('/consultas', { method: 'POST', body: JSON.stringify(dados) }),

  atualizarStatus: (id: number, status: TicketStatus, motivo: string) =>
    request<void>(`/consultas/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, motivo }),
    }),

  historico: (id: number) =>
    request<EventoHistorico[]>(`/consultas/${id}/historico`),
};

export const medicosApi = {
  listar: () =>
    request<Medico[]>('/medicos'),

  disponiveis: () =>
    request<Medico[]>('/medicos/disponiveis'),
};

export const pacientesApi = {
  atualizarStatus: (id: number, status: TicketStatus, motivo: string) =>
    request<void>(`/pacientes/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, motivo }),
    }),

  // historicoTicket mantido para compatibilidade com dashboards legados
  historicoTicket: (id: number) =>
    request<EventoHistorico[]>(`/pacientes/${id}/historico-ticket`),

  historicoConsulta: (id: number) =>
    request<EventoHistorico[]>(`/pacientes/${id}/historico-consulta`),
};

export const relatoriosApi = {
  operacional: () => request<MetricasOperacionais>('/admin/metricas'),
};
