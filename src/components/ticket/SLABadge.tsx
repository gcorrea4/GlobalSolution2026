import { Clock } from 'lucide-react';
import { calcularSLA } from '../../utils/sla';

interface SLABadgeProps {
  criadoEm: string;
  className?: string;
}

export function SLABadge({ criadoEm, className = '' }: SLABadgeProps) {
  const sla = calcularSLA(criadoEm);

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${sla.cor} ${className}`}
      title={`Nível: ${sla.nivel}`}
    >
      <Clock size={11} aria-hidden="true" />
      {sla.label}
    </span>
  );
}
