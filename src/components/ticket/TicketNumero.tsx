import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { gerarTicket } from '../../utils/ticketUtils';

interface TicketNumeroProps {
  id: number;
  copiavel?: boolean;
  className?: string;
}

export function TicketNumero({ id, copiavel = false, className = '' }: TicketNumeroProps) {
  const [copiado, setCopiado] = useState(false);
  const numero = gerarTicket(id);

  const copiar = () => {
    navigator.clipboard.writeText(numero).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }).catch(() => {});
  };

  const pill = (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-full border ${
        copiado
          ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-950/30 dark:border-green-700 dark:text-green-400'
          : 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/30 dark:border-orange-700/60 dark:text-orange-400'
      } ${className}`}
    >
      {copiado ? <Check size={13} aria-hidden="true" /> : null}
      {copiado ? 'Copiado!' : numero}
    </span>
  );

  if (!copiavel) return pill;

  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex items-center gap-1.5 group cursor-pointer"
      title="Copiar número do ticket"
      aria-label={`Copiar ticket ${numero}`}
    >
      {pill}
      {!copiado && (
        <Copy
          size={13}
          className="text-gray-400 group-hover:text-orange-500 transition-colors"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
