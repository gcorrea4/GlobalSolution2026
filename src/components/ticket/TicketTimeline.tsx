import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Skeleton, EmptyState } from '../ui';
import { TICKET_STATUS_CONFIG } from '../../utils/ticketStatusConfig';
import type { EventoHistorico } from '../../lib/api';

interface TicketTimelineProps {
  eventos: EventoHistorico[];
  loading?: boolean;
}

const AUTOR_LABEL: Record<string, string> = {
  sistema:   'Sistema',
  SISTEMA:   'Sistema',
  dentista:  'Dentista voluntário',
  DENTISTA:  'Dentista voluntário',
  admin:     'Administrador',
  ADMIN:     'Administrador',
  paciente:  'Paciente',
  PACIENTE:  'Paciente',
};

function formatarDataEvento(iso: string): string {
  const d = new Date(iso);
  const data = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${data}, ${hora}`;
}

const container = {
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

export function TicketTimeline({ eventos, loading = false }: TicketTimelineProps) {
  if (loading) {
    return (
      <div className="space-y-6 ml-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" lines={1} className="w-1/3" />
              <Skeleton variant="text" lines={1} className="w-2/3" />
              <Skeleton variant="text" lines={1} className="w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="Sem eventos registrados"
        description="O histórico de mudanças de status aparecerá aqui."
      />
    );
  }

  return (
    <motion.ol
      variants={container}
      initial="hidden"
      animate="show"
      className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-3 space-y-6"
    >
      {eventos.map((evento, i) => {
        const cfg = TICKET_STATUS_CONFIG[evento.statusNovo];
        const Icone = cfg?.icone;
        const corDot = cfg?.cor ?? 'bg-slate-400 text-white';
        const autorLabel = AUTOR_LABEL[evento.autorRole] ?? evento.autorRole;

        return (
          <motion.li key={i} variants={item} className="relative pl-7">
            {/* Bolinha colorida */}
            <div
              className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center shrink-0 ${corDot}`}
              aria-hidden="true"
            >
              {Icone && <Icone size={10} />}
            </div>

            {/* Data */}
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 mb-1">
              {formatarDataEvento(evento.dataMudanca)}
            </p>

            {/* Card do evento */}
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
              {/* Status novo */}
              <p className="font-bold text-gray-800 dark:text-white text-sm">
                {cfg?.label ?? evento.statusNovo}
              </p>

              {/* Motivo */}
              {evento.motivo && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 italic">
                  "{evento.motivo}"
                </p>
              )}

              {/* Autor */}
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5">
                {autorLabel}
                {evento.statusAnterior && TICKET_STATUS_CONFIG[evento.statusAnterior] && (
                  <span>
                    {' '}· antes: {TICKET_STATUS_CONFIG[evento.statusAnterior].label}
                  </span>
                )}
              </p>
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
