import { TICKET_STATUS_CONFIG } from '../../utils/ticketStatusConfig';
import type { TicketStatus } from '../../lib/api';

interface FiltroStatusProps {
  contagem: Partial<Record<TicketStatus, number>>;
  valor: TicketStatus | null;
  onChange: (status: TicketStatus | null) => void;
}

const STATUS_ORDENADOS = (
  Object.entries(TICKET_STATUS_CONFIG) as [TicketStatus, (typeof TICKET_STATUS_CONFIG)[TicketStatus]][]
)
  .sort(([, a], [, b]) => a.ordem - b.ordem)
  .map(([key]) => key);

export function FiltroStatus({ contagem, valor, onChange }: FiltroStatusProps) {
  const total = Object.values(contagem).reduce<number>((acc, n) => acc + (n ?? 0), 0);

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
      role="group"
      aria-label="Filtrar por status"
    >
      {/* Botão "Todos" */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
          valor === null
            ? 'bg-orange-500 border-orange-500 text-white'
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-orange-300 hover:text-orange-500'
        }`}
      >
        Todos
        {total > 0 && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
            valor === null ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-700'
          }`}>
            {total}
          </span>
        )}
      </button>

      {/* Botão por status */}
      {STATUS_ORDENADOS.map(status => {
        const cfg = TICKET_STATUS_CONFIG[status];
        const Icone = cfg.icone;
        const count = contagem[status] ?? 0;
        const selecionado = valor === status;

        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(selecionado ? null : status)}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
              selecionado
                ? `${cfg.corClara} border-transparent`
                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-500'
            }`}
            aria-pressed={selecionado}
          >
            <Icone size={11} aria-hidden="true" />
            {cfg.label}
            {count > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                selecionado
                  ? 'bg-black/10 dark:bg-white/20'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
