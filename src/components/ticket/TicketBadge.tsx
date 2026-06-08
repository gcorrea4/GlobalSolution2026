import { TICKET_STATUS_CONFIG } from '../../utils/ticketStatusConfig';
import type { TicketStatus } from '../../lib/api';

interface TicketBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
  variant?: 'solid' | 'outline';
}

export function TicketBadge({ status, size = 'md', variant = 'outline' }: TicketBadgeProps) {
  const cfg = TICKET_STATUS_CONFIG[status];
  if (!cfg) return null;

  const Icone = cfg.icone;
  const cor = variant === 'solid' ? cfg.cor : cfg.corClara;

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-3 py-1 gap-1.5';

  const iconSize = size === 'sm' ? 11 : 14;

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full whitespace-nowrap ${cor} ${sizeClasses}`}
      title={cfg.descricao}
    >
      <Icone size={iconSize} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
