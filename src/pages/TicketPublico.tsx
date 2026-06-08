import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { Skeleton } from '../components/ui';
import { TicketBadge, TicketNumero, TicketTimeline } from '../components/ticket';
import { pacientesApi } from '../lib/api';
import type { EventoHistorico, TicketStatus } from '../lib/api';
import { TICKET_STATUS_CONFIG } from '../utils/ticketStatusConfig';

// ── Helpers ────────────────────────────────────────────────────────────────────

const CODIGO_REGEX = /^TDB-\d{4}-(\d{5})$/;

function extrairId(codigo: string): number | null {
  const match = codigo.match(CODIGO_REGEX);
  return match ? parseInt(match[1], 10) : null;
}

// Extrai apenas o primeiro nome do dentista a partir do campo motivo.
// Sem sobrenome, sem outros dados (LGPD).
function extrairPrimeiroNome(eventos: EventoHistorico[]): string | null {
  const evento = [...eventos]
    .reverse()
    .find(e => e.statusNovo === 'EM_ATENDIMENTO' && e.motivo?.startsWith('Adotado por '));
  if (!evento?.motivo) return null;
  const nome = evento.motivo.replace('Adotado por ', '').split(' ')[0].trim();
  return nome || null;
}

// ── Layout header — definido FORA do componente principal (regra de hooks) ───

function TicketHeader() {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-200 hover:text-orange-500 transition-colors"
        >
          <span className="text-xl font-black text-orange-500">TdB</span>
          <span className="hidden sm:inline">Turma do Bem</span>
        </Link>
        <Link
          to="/login"
          className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1"
        >
          Entrar <ExternalLink size={11} />
        </Link>
      </div>
    </header>
  );
}

// ── Tipos ──────────────────────────────────────────────────────────────────────

type Estado = 'carregando' | 'invalido' | 'nao_encontrado' | 'ok';

// ── Componente ─────────────────────────────────────────────────────────────────

export function TicketPublico() {
  const { codigo = '' } = useParams<{ codigo: string }>();
  const id = extrairId(codigo);

  // Estado inicializado com base no formato do código — sem setState síncrono no effect
  const [estado, setEstado] = useState<Estado>(id !== null ? 'carregando' : 'invalido');
  const [eventos, setEventos] = useState<EventoHistorico[]>([]);

  useEffect(() => {
    if (id === null) return;
    let live = true;
    pacientesApi.historicoTicket(id)
      .then(data => {
        if (!live) return;
        setEventos(Array.isArray(data) ? data : []);
        setEstado('ok');
      })
      .catch(() => {
        if (!live) return;
        setEstado('nao_encontrado');
      });
    return () => { live = false; };
  }, [id]);

  const statusAtual: TicketStatus | null = eventos.length > 0
    ? eventos[eventos.length - 1].statusNovo
    : null;

  // Só primeiro nome — sem sobrenome (LGPD)
  const nomeDentista = extrairPrimeiroNome(eventos);

  // ── Wrapper único — sem componente definido dentro do render ─────────────────

  if (estado === 'carregando') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
        <title>{`Ticket ${codigo} · Turma do Bem`}</title>
        <TicketHeader />
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-5">
          <Skeleton variant="text" lines={1} className="w-1/3" />
          <Skeleton variant="card" className="h-20" />
          <Skeleton variant="card" className="h-48" />
        </main>
      </div>
    );
  }

  if (estado === 'invalido' || estado === 'nao_encontrado') {
    const titulo = estado === 'invalido' ? 'Código inválido' : 'Ticket não encontrado';
    const descricao = estado === 'invalido'
      ? 'O código informado não está no formato esperado (TDB-AAAA-NNNNN).'
      : 'Este ticket não existe ou foi removido. Verifique o código e tente novamente.';

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
        <title>{`${titulo} · Turma do Bem`}</title>
        <TicketHeader />
        <main className="max-w-2xl mx-auto px-4 py-10">
          <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
            <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-full">
              <AlertCircle size={36} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{titulo}</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">{descricao}</p>
            </div>
            <Link to="/" className="flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:underline">
              <ArrowLeft size={14} /> Voltar ao início
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ── Estado: ok ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <title>{`Ticket ${codigo} · Turma do Bem`}</title>
      <TicketHeader />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="space-y-6 animate-fade-in">

          {/* Cabeçalho do ticket */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Acompanhamento de caso
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <TicketNumero id={id ?? 0} copiavel />
              {statusAtual && <TicketBadge status={statusAtual} />}
            </div>
          </div>

          {/* Card de status atual */}
          {statusAtual && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
              <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Status atual
              </p>
              <TicketBadge status={statusAtual} variant="solid" />
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                {TICKET_STATUS_CONFIG[statusAtual]?.descricao}
              </p>
              {nomeDentista && (
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-3 font-medium">
                  Dentista responsável: <span className="font-bold">{nomeDentista}</span>
                </p>
              )}
            </div>
          )}

          {/* Linha do tempo de status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Histórico de status
            </p>
            <TicketTimeline eventos={eventos} />
          </div>

          {/* Mensagem de acompanhamento + CTA login */}
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              Acompanhe seu caso aqui sempre que quiser. Para mais detalhes e comunicação
              com seu dentista,{' '}
              <Link to="/login" className="font-bold text-orange-500 hover:underline">
                faça login na plataforma
              </Link>
              .
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
