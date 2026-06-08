import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Layers, Users, MessageSquare } from 'lucide-react';
import { Skeleton } from '../components/ui';
import { relatoriosApi } from '../lib/api';
import type { MetricasOperacionais as MetricasDados, TicketStatus } from '../lib/api';
import { TICKET_STATUS_CONFIG } from '../utils/ticketStatusConfig';

function KPICard({
  label, valor, icone, corIcone, descricao,
}: {
  label: string;
  valor: string;
  icone: React.ReactNode;
  corIcone: string;
  descricao?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${corIcone}`}>
        {icone}
      </div>
      <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-800 dark:text-white leading-none">{valor}</p>
      {descricao && (
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5 leading-snug">{descricao}</p>
      )}
    </div>
  );
}

const URGENCIA_CONFIG: Record<string, { label: string; cor: string }> = {
  ALTA:  { label: 'Alta',  cor: 'bg-red-500' },
  MEDIA: { label: 'Média', cor: 'bg-yellow-500' },
  BAIXA: { label: 'Baixa', cor: 'bg-green-500' },
};

const CANAL_CONFIG: Record<string, { label: string; cor: string }> = {
  WEB:        { label: 'Web',        cor: 'bg-blue-500' },
  APP:        { label: 'App',        cor: 'bg-purple-500' },
  PRESENCIAL: { label: 'Presencial', cor: 'bg-orange-500' },
  TELEFONE:   { label: 'Telefone',   cor: 'bg-teal-500' },
};

export function MetricasOperacionais() {
  const [dados, setDados] = useState<MetricasDados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  const carregar = () => {
    setCarregando(true);
    setErro(false);
    setDados(null);
    setTentativa(t => t + 1);
  };

  useEffect(() => {
    let live = true;
    relatoriosApi.operacional()
      .then(d => {
        if (!live) return;
        setDados(d);
        setCarregando(false);
      })
      .catch(() => {
        if (!live) return;
        setErro(true);
        setCarregando(false);
      });
    return () => { live = false; };
  }, [tentativa]);

  if (carregando) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} variant="card" className="h-32" />)}
        </div>
        <Skeleton variant="card" className="h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
        </div>
        <Skeleton variant="card" className="h-32" />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-full">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white mb-1">Não foi possível carregar as métricas</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Verifique a conexão com o servidor.</p>
        </div>
        <button
          onClick={carregar}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors"
        >
          <RefreshCw size={15} /> Tentar novamente
        </button>
      </div>
    );
  }

  const distStatus = dados?.por_status_ticket ?? {};
  const totalDistStatus = Object.values(distStatus).reduce<number>((acc, n) => acc + (n ?? 0), 0);
  const statusOrdenados = (Object.entries(distStatus) as [TicketStatus, number][])
    .filter(([, n]) => (n ?? 0) > 0)
    .sort(([, a], [, b]) => b - a);

  const urgenciaItens = (Object.entries(dados?.por_urgencia ?? {}) as [string, number][])
    .filter(([, n]) => (n ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));
  const totalUrgencia = urgenciaItens.reduce((acc, [, n]) => acc + n, 0);

  const canalItens = (Object.entries(dados?.por_canal_origem ?? {}) as [string, number][])
    .filter(([, n]) => (n ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));
  const totalCanal = canalItens.reduce((acc, [, n]) => acc + n, 0);

  const categoriaItens = (Object.entries(dados?.mensagens?.por_categoria ?? {}) as [string, number][])
    .filter(([, n]) => (n ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Métricas Operacionais</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Atualizado ao abrir a aba — cache de 60s no servidor.
        </p>
      </div>

      {/* Linha 1 — KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          label="Pacientes Ativos"
          valor={String(dados?.total_pacientes_ativos ?? 0)}
          icone={<Users size={20} className="text-orange-600" />}
          corIcone="bg-orange-100 dark:bg-orange-950/40"
          descricao="com casos em andamento"
        />
        <KPICard
          label="Total de Tickets"
          valor={String(totalDistStatus)}
          icone={<Layers size={20} className="text-blue-600" />}
          corIcone="bg-blue-100 dark:bg-blue-950/40"
          descricao="soma de todos os status"
        />
        <KPICard
          label="Mensagens Recebidas"
          valor={String(dados?.mensagens?.total ?? 0)}
          icone={<MessageSquare size={20} className="text-purple-600" />}
          corIcone="bg-purple-100 dark:bg-purple-950/40"
          descricao="total de mensagens no sistema"
        />
      </div>

      {/* Linha 2 — Distribuição por Status */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 dark:text-white mb-5 text-lg">Distribuição por Status</h3>
        {statusOrdenados.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">
            Nenhum dado disponível.
          </p>
        ) : (
          <div className="space-y-4">
            {statusOrdenados.map(([status, count]) => {
              const cfg = TICKET_STATUS_CONFIG[status];
              const pct = totalDistStatus > 0 ? (count / totalDistStatus) * 100 : 0;
              const Icone = cfg?.icone;
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      {Icone && <Icone size={13} className="text-gray-500 dark:text-slate-400" aria-hidden="true" />}
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                        {cfg?.label ?? status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 tabular-nums">
                      {count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cfg?.cor ?? 'bg-slate-400 text-white'}`}
                      style={{ width: `${pct > 0 ? Math.max(pct, 2) : 0}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Linha 3 — Urgência + Canal de Origem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Urgência */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-5 text-lg">Por Urgência</h3>
          {urgenciaItens.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Nenhum dado disponível.</p>
          ) : (
            <div className="space-y-4">
              {urgenciaItens.map(([key, count]) => {
                const cfg = URGENCIA_CONFIG[key];
                const pct = totalUrgencia > 0 ? (count / totalUrgencia) * 100 : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                        {cfg?.label ?? key}
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-slate-400 tabular-nums">
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${cfg?.cor ?? 'bg-slate-400'}`}
                        style={{ width: `${pct > 0 ? Math.max(pct, 2) : 0}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(pct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Canal de Origem */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-5 text-lg">Por Canal de Origem</h3>
          {canalItens.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Nenhum dado disponível.</p>
          ) : (
            <div className="space-y-4">
              {canalItens.map(([key, count]) => {
                const cfg = CANAL_CONFIG[key];
                const pct = totalCanal > 0 ? (count / totalCanal) * 100 : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                        {cfg?.label ?? key}
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-slate-400 tabular-nums">
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${cfg?.cor ?? 'bg-slate-400'}`}
                        style={{ width: `${pct > 0 ? Math.max(pct, 2) : 0}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(pct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Linha 4 — Mensagens por Categoria */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">Mensagens por Categoria</h3>
          <span className="text-sm font-bold text-gray-500 dark:text-slate-400 tabular-nums">
            {dados?.mensagens?.total ?? 0} total
          </span>
        </div>
        {categoriaItens.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Nenhum dado disponível.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categoriaItens.map(([categoria, count]) => (
              <div
                key={categoria}
                className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3 border border-gray-100 dark:border-slate-600"
              >
                <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                  {categoria.charAt(0) + categoria.slice(1).toLowerCase()}
                </span>
                <span className="text-lg font-black text-orange-500">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
