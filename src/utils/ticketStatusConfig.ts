import type { LucideIcon } from 'lucide-react';
import { Clock, ClipboardList, UserCheck, Activity, CheckCircle2, XCircle } from 'lucide-react';
import type { TicketStatus } from '../lib/api';

export interface StatusConfig {
  label: string;
  cor: string;      // solid — usado em botões/fundo cheio
  corClara: string; // clara — usado em badges
  icone: LucideIcon;
  descricao: string;
  ordem: number;
}

export const TICKET_STATUS_CONFIG: Record<TicketStatus, StatusConfig> = {
  NAO_INICIADO: {
    label: 'Não iniciado',
    cor: 'bg-slate-500 text-white',
    corClara: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    icone: Clock,
    descricao: 'Aguardando triagem inicial',
    ordem: 0,
  },
  EM_TRIAGEM: {
    label: 'Em triagem',
    cor: 'bg-yellow-500 text-white',
    corClara: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300',
    icone: ClipboardList,
    descricao: 'Caso em avaliação pela equipe',
    ordem: 1,
  },
  AGUARDANDO_DENTISTA: {
    label: 'Aguardando dentista',
    cor: 'bg-orange-500 text-white',
    corClara: 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300',
    icone: UserCheck,
    descricao: 'Aguardando dentista voluntário',
    ordem: 2,
  },
  EM_ATENDIMENTO: {
    label: 'Em atendimento',
    cor: 'bg-blue-600 text-white',
    corClara: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
    icone: Activity,
    descricao: 'Tratamento em andamento com dentista voluntário',
    ordem: 3,
  },
  FINALIZADO: {
    label: 'Finalizado',
    cor: 'bg-green-600 text-white',
    corClara: 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300',
    icone: CheckCircle2,
    descricao: 'Tratamento concluído com sucesso',
    ordem: 4,
  },
  CANCELADO: {
    label: 'Cancelado',
    cor: 'bg-red-600 text-white',
    corClara: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300',
    icone: XCircle,
    descricao: 'Caso encerrado sem conclusão',
    ordem: 5,
  },
};
