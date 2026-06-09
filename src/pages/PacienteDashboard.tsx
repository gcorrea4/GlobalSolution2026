import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useForm } from 'react-hook-form';
import {
  LayoutDashboard, LogOut, Clock, CalendarDays, Users, ClipboardList, Activity,
  CheckCircle2, AlertCircle, TrendingUp, Bell, CalendarCheck, Phone, Mail,
  MapPin, Video, Menu, Satellite, X, FileText, Settings,
} from 'lucide-react';
import { Skeleton, EmptyState, DemoBadge } from '../components/ui';
import { TicketBadge, TicketNumero, TicketTimeline } from '../components/ticket';
import { pacientesApi } from '../lib/api';
import type { EventoHistorico, TicketStatus } from '../lib/api';

interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  dataISO?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
  dentistaCidade?: string;
  dentistaPais?: string;
}

interface SlotOferta {
  id: string;
  data: string;
  hora: string;
}

interface OfertaAgendamento {
  id?: number;
  dentistaNome: string;
  dentistaCidade?: string;
  dentistaPais?: string;
  procedimento: string;
  slots: SlotOferta[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
}

interface TriagemFormData {
  especialidade: string;
  urgencia: 'ALTA' | 'MEDIA' | 'BAIXA';
  sintomas: string;
  telefone: string;
  email: string;
}

const TOTAL_CONSULTAS_PLANO = 5;

type TelaPaciente = 'painel' | 'triagem' | 'consultas';

export function PacienteDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  const userId = sessionStorage.getItem('userId');

  const [telaAtiva, setTelaAtiva] = useState<TelaPaciente>('painel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historicoPaciente, setHistoricoPaciente] = useState<HistoricoConsulta[]>([]);
  const [fichaEnviada, setFichaEnviada] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [ofertaRecebida, setOfertaRecebida] = useState<OfertaAgendamento | null>(null);
  const [slotEscolhidoId, setSlotEscolhidoId] = useState<string>('');
  const [historicoTicket, setHistoricoTicket] = useState<EventoHistorico[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TriagemFormData>({
    defaultValues: { urgencia: 'MEDIA', especialidade: '' },
  });
  const urgenciaAtual = watch('urgencia');

  const aplicarMascaraTelefone = (valor: string): string => {
    const d = valor.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const [pacienteInfo, setPacienteInfo] = useState<{ cidade: string; pais: string }>({ cidade: '', pais: 'Brasil' });

  useEffect(() => {
    if (!userId) { setCarregandoDados(false); return; }
    const fetchInfo = apiFetch(`/pacientes/${userId}`)
      .then(res => res.json())
      .then(data => { if (data?.cidade) setPacienteInfo({ cidade: data.cidade, pais: data.pais || 'Brasil' }); })
      .catch(() => {});
    const fetchHistorico = apiFetch(`/pacientes/${userId}/historico`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setHistoricoPaciente(data); })
      .catch(() => {});
    const fetchOferta = apiFetch(`/ofertas/paciente/${userId}`)
      .then(res => res.json())
      .then(data => { setOfertaRecebida(data && data.id ? (data as OfertaAgendamento) : null); })
      .catch(() => {});
    Promise.allSettled([fetchInfo, fetchHistorico, fetchOferta]).finally(() => setCarregandoDados(false));
  }, [userId]);

  useEffect(() => {
    if (!userId) { setCarregandoHistorico(false); return; }
    pacientesApi.historicoTicket(Number(userId))
      .then(eventos => {
        const lista = Array.isArray(eventos) ? eventos : [];
        setHistoricoTicket(lista);
        const novoStatus = lista[lista.length - 1]?.statusNovo ?? null;
        const prevStatus = sessionStorage.getItem(`orb_status_${userId}`);
        if (prevStatus && novoStatus && prevStatus !== novoStatus) {
          setMensagemSucesso('🩺 Seu caso teve uma atualização!');
          setTimeout(() => setMensagemSucesso(''), 4000);
        }
        if (novoStatus) sessionStorage.setItem(`orb_status_${userId}`, novoStatus);
      })
      .catch(() => {})
      .finally(() => setCarregandoHistorico(false));
  }, [userId]);

  useEffect(() => {
    if (telaAtiva !== 'consultas' || !userId) return;
    apiFetch(`/ofertas/paciente/${userId}`)
      .then(res => res.json())
      .then(data => { setOfertaRecebida(data && data.id ? (data as OfertaAgendamento) : null); })
      .catch(() => {});
  }, [telaAtiva, userId]);

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const consultasConcluidas = historicoPaciente.filter(h => h.status === 'Concluído').length;
  const consultasAgendadas  = historicoPaciente.filter(h => h.status === 'Agendado').length;
  const progressoPct = Math.min(Math.round((consultasConcluidas / TOTAL_CONSULTAS_PLANO) * 100), 100);
  const statusAtual: TicketStatus | null = historicoTicket.length > 0
    ? historicoTicket[historicoTicket.length - 1].statusNovo
    : null;

  const onSubmit = async (data: TriagemFormData) => {
    const payload = {
      nome: usuarioLogado,
      especialidade: data.especialidade,
      urgencia: data.urgencia,
      sintomas: data.sintomas,
      pais: pacienteInfo.pais || 'Brasil',
      cidade: pacienteInfo.cidade || 'Não informada',
      telefone: data.telefone,
      email: data.email,
    };
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await apiFetch(`/pacientes/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (response.ok) {
        if (usuarioLogado) {
          localStorage.setItem(`orb_contato_${usuarioLogado}`, JSON.stringify({ email: data.email, telefone: data.telefone }));
          localStorage.setItem(`orb_triagem_${usuarioLogado}`, JSON.stringify(payload));
        }
        setMensagemSucesso('Solicitação de teleconsulta enviada! Um médico disponível entrará em contato em breve.');
        setFichaEnviada(true);
        setTimeout(() => { setTelaAtiva('painel'); setMensagemSucesso(''); }, 4000);
      } else {
        const err = await response.json().catch(() => null);
        setMensagemSucesso('__erro__' + (err?.erro || 'Erro ao enviar solicitação. Tente novamente.'));
        setTimeout(() => setMensagemSucesso(''), 4000);
      }
    } catch {
      setMensagemSucesso('__erro__Sem conexão com o servidor. Verifique sua internet e tente novamente.');
      setTimeout(() => setMensagemSucesso(''), 4000);
    }
  };

  const handleConfirmarSlot = async () => {
    if (!ofertaRecebida || !slotEscolhidoId || !usuarioLogado) return;
    const slot = ofertaRecebida.slots.find(s => s.id === slotEscolhidoId);
    if (!slot) return;
    const dataParts = slot.data.split('-');
    const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;
    if (ofertaRecebida.id) {
      try {
        const res = await apiFetch(`/ofertas/${ofertaRecebida.id}/confirmar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: slot.data, hora: slot.hora }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          setMensagemSucesso('__erro__' + (err?.erro || 'Erro ao confirmar agendamento. Tente novamente.'));
          setTimeout(() => setMensagemSucesso(''), 4000);
          return;
        }
      } catch {
        setMensagemSucesso('__erro__Sem conexão com o servidor. Tente novamente.');
        setTimeout(() => setMensagemSucesso(''), 4000);
        return;
      }
    }
    const ofertaAtualizada = { ...ofertaRecebida, status: 'confirmado' as const, slotEscolhido: { data: slot.data, hora: slot.hora } };
    setOfertaRecebida(ofertaAtualizada);
    setHistoricoPaciente(prev => [...prev, { status: 'Agendado', data: dataFormatada, dataISO: slot.data, hora: slot.hora, proc: ofertaRecebida.procedimento, dentista: ofertaRecebida.dentistaNome, dentistaCidade: ofertaRecebida.dentistaCidade, dentistaPais: ofertaRecebida.dentistaPais }]);
    setMensagemSucesso(`Teleconsulta confirmada para ${dataFormatada} às ${slot.hora}! O seu médico foi notificado.`);
    setTimeout(() => { setTelaAtiva('painel'); setMensagemSucesso(''); }, 4000);
  };

  const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const slotConfirmado = ofertaRecebida?.status === 'confirmado' ? ofertaRecebida.slotEscolhido : null;
  let confirmedDiaSemana = '';
  let confirmedDataFormatada = '';
  let confirmedDiasAte: number | null = null;
  if (slotConfirmado) {
    const [cAno, cMes, cDia] = slotConfirmado.data.split('-');
    const cObj = new Date(Number(cAno), Number(cMes) - 1, Number(cDia));
    confirmedDiaSemana     = DIAS_SEMANA[cObj.getDay()];
    confirmedDataFormatada = `${cDia}/${cMes}/${cAno}`;
    confirmedDiasAte       = Math.ceil((cObj.getTime() - Date.now()) / 86_400_000);
  }

  const navItems = [
    { id: 'painel' as const,    icon: <LayoutDashboard size={18} />, label: 'Início',           badge: 0 },
    { id: 'triagem' as const,   icon: <ClipboardList size={18} />,   label: 'Minha Triagem',    badge: 0 },
    { id: 'consultas' as const, icon: <CalendarCheck size={18} />,   label: 'Minhas Consultas', badge: ofertaRecebida?.status === 'pendente' ? 1 : 0 },
  ];

  const inputClass = 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-sky-500/40 focus:border-sky-500 outline-none transition-colors';

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
      <title>Meu Caso · OrbitalCare</title>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center gap-3 px-5 border-b border-slate-800 flex-shrink-0">
          <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Satellite size={14} className="text-white" />
          </div>
          <span className="font-black text-white text-sm tracking-wide">OrbitalCare</span>
          <button className="ml-auto text-slate-500 hover:text-white md:hidden transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setTelaAtiva(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                telaAtiva === item.id
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {item.label}
              {item.badge > 0 && (
                <span className="ml-auto bg-sky-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">!</span>
              )}
            </button>
          ))}

          <button
            onClick={() => { setSidebarOpen(false); navigate(`/prontuario/${usuarioLogado}`); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent transition-colors"
          >
            <FileText size={18} className="flex-shrink-0" />
            Meu Prontuário
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent transition-colors"
          >
            <Settings size={18} className="flex-shrink-0" />
            Meus Dados
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500/20 text-sky-400 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              {usuarioLogado?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{usuarioLogado}</p>
              <p className="text-slate-500 text-[11px]">Paciente OrbitalCare</p>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Sair">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center gap-4 px-4 md:px-6 flex-shrink-0">
          <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="text-white font-semibold text-sm">
            {navItems.find(n => n.id === telaAtiva)?.label ?? 'Meu Painel'}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <DemoBadge />
          </div>
        </header>

        {/* Toast */}
        {mensagemSucesso && (() => {
          const isErro = mensagemSucesso.startsWith('__erro__');
          const texto = isErro ? mensagemSucesso.replace('__erro__', '') : mensagemSucesso;
          return (
            <div className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 whitespace-nowrap border ${
              isErro
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <CheckCircle2 size={16} /> {texto}
            </div>
          );
        })()}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* ── Início ── */}
          {telaAtiva === 'painel' && (
            <div className="animate-fade-in space-y-5 max-w-3xl">

              {carregandoDados && (
                <div className="space-y-4">
                  <Skeleton variant="card" />
                  <Skeleton variant="card" />
                  <Skeleton variant="card" />
                </div>
              )}

              {!carregandoDados && (<>

                {/* Oferta pendente */}
                {ofertaRecebida?.status === 'pendente' && (
                  <button onClick={() => setTelaAtiva('consultas')}
                    className="w-full bg-sky-500/10 border border-sky-500/30 text-left p-4 rounded-xl flex items-center gap-4 hover:bg-sky-500/20 transition-colors">
                    <div className="bg-sky-500/20 p-2.5 rounded-lg flex-shrink-0">
                      <Bell size={20} className="text-sky-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">Novo horário disponível!</p>
                      <p className="text-slate-400 text-xs mt-0.5">Dr(a). {ofertaRecebida.dentistaNome} enviou {ofertaRecebida.slots.length} opção(ões). Escolha o melhor horário.</p>
                    </div>
                    <span className="text-sky-400 text-xs font-bold">Ver →</span>
                  </button>
                )}

                {/* Ticket + Status */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      {userId && Number(userId) > 0 && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <TicketNumero id={Number(userId)} copiavel />
                          {statusAtual && <TicketBadge status={statusAtual} />}
                        </div>
                      )}
                      <h2 className="text-2xl font-black text-white">Olá, {usuarioLogado}!</h2>
                      <p className="text-slate-400 text-sm mt-0.5">Bem-vindo ao seu painel OrbitalCare.</p>
                    </div>
                    {!fichaEnviada && (
                      <button onClick={() => setTelaAtiva('triagem')}
                        className="bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-sky-600 transition-colors flex items-center gap-2 whitespace-nowrap self-start md:self-center">
                        <ClipboardList size={16} /> Solicitar Teleconsulta
                      </button>
                    )}
                  </div>
                </div>

                {/* Progresso */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-sky-400" />
                    <h3 className="font-bold text-white text-sm">Progresso do Acompanhamento</h3>
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-4xl font-black text-sky-400">{consultasConcluidas}
                        <span className="text-lg font-semibold text-slate-500"> / {TOTAL_CONSULTAS_PLANO}</span>
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">teleconsultas realizadas</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {consultasAgendadas > 0 && (
                        <span className="inline-flex items-center gap-1 bg-sky-500/10 text-sky-400 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-500/20">
                          <Clock size={11} /> {consultasAgendadas} agendada{consultasAgendadas > 1 ? 's' : ''}
                        </span>
                      )}
                      {consultasConcluidas >= TOTAL_CONSULTAS_PLANO && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 size={11} /> Acompanhamento concluído!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progressoPct}%`,
                        background: progressoPct >= 100 ? '#10b981' : 'linear-gradient(90deg, #0EA5E9, #38bdf8)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {Array.from({ length: TOTAL_CONSULTAS_PLANO }).map((_, i) => (
                      <span key={i} className={`text-[10px] font-bold ${i < consultasConcluidas ? 'text-sky-400' : 'text-slate-700'}`}>
                        {i + 1}ª
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline do ticket */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                    <Activity size={16} className="text-sky-400" />
                    <h3 className="font-bold text-white text-sm">Linha do Tempo do Caso</h3>
                  </div>
                  <div className="p-5">
                    <TicketTimeline eventos={historicoTicket} loading={carregandoHistorico} />
                  </div>
                </div>

                {/* Histórico */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                    <CalendarDays size={16} className="text-sky-400" />
                    <h3 className="font-bold text-white text-sm">Histórico de Teleconsultas</h3>
                  </div>
                  <div className="p-5">
                    {historicoPaciente.length === 0 ? (
                      <EmptyState icon={ClipboardList} title="Sem teleconsultas registradas"
                        description="Solicite uma teleconsulta para que o sistema conecte você ao médico disponível."
                        action={{ label: 'Solicitar Teleconsulta', onClick: () => setTelaAtiva('triagem') }} />
                    ) : (
                      <div className="space-y-3">
                        {historicoPaciente.map((item, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border transition-colors ${
                            item.status === 'Agendado'
                              ? 'bg-sky-500/5 border-sky-500/20'
                              : 'bg-slate-800/50 border-slate-700/50'
                          }`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                {item.titulo && <p className="font-semibold text-white text-sm">{item.titulo}</p>}
                                {item.proc && <p className="text-slate-400 text-xs mt-0.5">{item.proc}</p>}
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="text-xs text-slate-500 flex items-center gap-1"><CalendarDays size={11} /> {item.data}</span>
                                  {item.hora && <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={11} /> {item.hora}</span>}
                                  {item.dentista && <span className="text-xs text-slate-500 flex items-center gap-1"><Users size={11} /> Dr(a). {item.dentista}</span>}
                                </div>
                                {item.status === 'Agendado' && (
                                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                                    <Video size={12} /> Teleconsulta — Via Satélite
                                  </div>
                                )}
                              </div>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex-shrink-0 border ${
                                item.status === 'Agendado'
                                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </>)}
            </div>
          )}

          {/* ── Minhas Consultas ── */}
          {telaAtiva === 'consultas' && (
            <div className="animate-fade-in max-w-2xl space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Minhas Consultas</h2>
                <p className="text-slate-400 text-sm mt-0.5">Escolha o melhor horário ou veja os agendamentos.</p>
              </div>

              {ofertaRecebida?.status === 'pendente' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 bg-sky-500/5">
                    <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">Proposta do seu médico</p>
                    <h3 className="text-lg font-black text-white">{ofertaRecebida.procedimento}</h3>
                    <p className="text-slate-400 text-sm mt-1">Dr(a). {ofertaRecebida.dentistaNome} disponibilizou {ofertaRecebida.slots.length} opção(ões).</p>
                  </div>
                  <div className="p-5 space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Selecione um horário:</p>
                    {ofertaRecebida.slots.map(slot => {
                      const [ano, mes, dia] = slot.data.split('-');
                      const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
                      const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
                      const diaSemana = diasSemana[dataObj.getDay()];
                      const selecionado = slotEscolhidoId === slot.id;
                      return (
                        <label key={slot.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selecionado
                            ? 'border-sky-500 bg-sky-500/10'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}>
                          <input type="radio" name="slot" value={slot.id} checked={selecionado}
                            onChange={() => setSlotEscolhidoId(slot.id)}
                            className="accent-sky-500 w-4 h-4 flex-shrink-0" />
                          <div className="flex-1">
                            <p className={`font-bold text-sm ${selecionado ? 'text-sky-400' : 'text-white'}`}>
                              {diaSemana}, {dia}/{mes}/{ano}
                            </p>
                            <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                              <Clock size={11} /> {slot.hora}
                            </p>
                          </div>
                          {selecionado && <CheckCircle2 size={20} className="text-sky-400 flex-shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                  <div className="px-5 pb-5">
                    <button onClick={handleConfirmarSlot} disabled={!slotEscolhidoId}
                      className="w-full bg-sky-500 text-white font-bold py-3.5 rounded-xl hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                      <CheckCircle2 size={18} /> Confirmar este Horário
                    </button>
                  </div>
                </div>

              ) : ofertaRecebida?.status === 'confirmado' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-sky-500 to-sky-400" />
                  <div className="px-6 py-8 text-center border-b border-slate-800">
                    <div className="w-14 h-14 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-sky-500/10">
                      <CheckCircle2 size={30} className="text-sky-400" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">Teleconsulta Confirmada!</h3>
                    <p className="text-slate-400 text-sm">{ofertaRecebida.procedimento}</p>
                    {confirmedDiasAte !== null && confirmedDiasAte >= 0 && (
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-400 text-xs font-bold px-3 py-1.5 rounded-full border border-sky-500/20">
                        <Clock size={11} />
                        {confirmedDiasAte === 0 ? 'Hoje!' : confirmedDiasAte === 1 ? 'Amanhã!' : `Em ${confirmedDiasAte} dias`}
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    {slotConfirmado && (
                      <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="bg-sky-500/10 rounded-lg p-2.5 flex-shrink-0 border border-sky-500/20">
                          <CalendarDays size={18} className="text-sky-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Data e Hora</p>
                          <p className="font-bold text-white text-sm">{confirmedDiaSemana}, {confirmedDataFormatada}</p>
                          <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5"><Clock size={11} /> {slotConfirmado.hora}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                        {ofertaRecebida.dentistaNome.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Médico</p>
                        <p className="font-bold text-white text-sm truncate">Dr(a). {ofertaRecebida.dentistaNome}</p>
                        {ofertaRecebida.dentistaCidade && (
                          <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5"><MapPin size={11} /> {ofertaRecebida.dentistaCidade}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <div className="bg-sky-500/10 rounded-lg p-2.5 flex-shrink-0 border border-sky-500/20">
                        <Video size={18} className="text-sky-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Formato</p>
                        <p className="font-bold text-white text-sm">Teleconsulta Online</p>
                        <p className="text-slate-400 text-xs mt-0.5">Via Satélite / Videochamada</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-sky-500/5 border border-sky-500/20 rounded-xl p-4">
                      <Bell size={13} className="text-sky-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sky-300 text-xs leading-relaxed">
                        Você receberá lembretes por e-mail <strong>3, 2 e 1 dia(s)</strong> antes da teleconsulta.
                      </p>
                    </div>
                  </div>
                </div>

              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <EmptyState icon={CalendarCheck} title="Sem propostas pendentes"
                    description="Quando um médico enviar opções de horário, elas aparecerão aqui." />
                </div>
              )}
            </div>
          )}

          {/* ── Minha Triagem ── */}
          {telaAtiva === 'triagem' && (
            <div className="animate-fade-in max-w-2xl space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Nova Solicitação de Teleconsulta</h2>
                <p className="text-slate-400 text-sm mt-0.5">Preencha para que o sistema encontre o médico especialista disponível na sua região.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                {fichaEnviada ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Solicitação Recebida!</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">Solicitação registrada e priorizada pelo sistema. Um médico disponível entrará em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Bloco de dados da teleconsulta */}
                    <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl space-y-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="text-sky-400" />
                        <h4 className="font-bold text-sky-400 text-sm">Dados da Teleconsulta</h4>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5">Especialidade Médica</label>
                        <select {...register('especialidade', { required: 'Selecione uma especialidade' })}
                          className={`${inputClass} ${errors.especialidade ? 'border-red-500' : ''}`}>
                          <option value="">Selecione a especialidade...</option>
                          <option value="Clínica Geral">Clínica Geral</option>
                          <option value="Pediatria">Pediatria</option>
                          <option value="Cardiologia">Cardiologia</option>
                          <option value="Dermatologia">Dermatologia</option>
                          <option value="Ortopedia">Ortopedia</option>
                          <option value="Ginecologia">Ginecologia</option>
                          <option value="Psiquiatria">Psiquiatria</option>
                          <option value="Neurologia">Neurologia</option>
                        </select>
                        {errors.especialidade && <span className="text-red-400 text-xs mt-1 block">{errors.especialidade.message}</span>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Nível de Urgência</label>
                        <div className="flex gap-3">
                          {(['BAIXA', 'MEDIA', 'ALTA'] as const).map(u => {
                            const isSelected = urgenciaAtual === u;
                            const colorsMap = {
                              BAIXA: isSelected ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 text-slate-500 bg-slate-800',
                              MEDIA: isSelected ? 'border-amber-500 bg-amber-500/10 text-amber-400'   : 'border-slate-700 text-slate-500 bg-slate-800',
                              ALTA:  isSelected ? 'border-red-500 bg-red-500/10 text-red-400'         : 'border-slate-700 text-slate-500 bg-slate-800',
                            };
                            return (
                              <label key={u} className="flex-1 cursor-pointer">
                                <input type="radio" value={u}
                                  {...register('urgencia', { required: true })}
                                  className="sr-only" />
                                <div className={`text-center py-2.5 px-2 rounded-xl border-2 font-bold text-sm transition-all ${colorsMap[u]}`}>
                                  {u === 'BAIXA' ? 'Baixa' : u === 'MEDIA' ? 'Média' : 'Alta'}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5">Descreva seus sintomas</label>
                        <textarea
                          {...register('sintomas', {
                            required: 'Descreva os sintomas',
                            minLength: { value: 10, message: 'Mínimo de 10 caracteres' }
                          })}
                          rows={3}
                          placeholder="Ex: Dor de cabeça há 3 dias, febre de 38°C, dificuldade para respirar..."
                          className={`${inputClass} resize-none ${errors.sintomas ? 'border-red-500' : ''}`}
                        />
                        {errors.sintomas && <span className="text-red-400 text-xs mt-1 block">{errors.sintomas.message}</span>}
                      </div>
                    </div>

                    {/* Contato */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-300 mb-1.5">
                          <Phone size={13} className="text-slate-500" /> Telefone para Contato
                        </label>
                        <input type="tel" placeholder="(11) 99999-9999"
                          {...register('telefone', {
                            required: 'Telefone obrigatório',
                            pattern: { value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Formato inválido. Use (11) 99999-9999' }
                          })}
                          onChange={e => setValue('telefone', aplicarMascaraTelefone(e.target.value), { shouldValidate: !!errors.telefone })}
                          className={`${inputClass} ${errors.telefone ? 'border-red-500' : ''}`} />
                        {errors.telefone && <span className="text-red-400 text-xs mt-1 block">{errors.telefone.message}</span>}
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-300 mb-1.5">
                          <Mail size={13} className="text-slate-500" /> E-mail para Lembretes
                        </label>
                        <input type="email" placeholder="seu@email.com"
                          {...register('email', {
                            required: 'E-mail obrigatório',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
                          })}
                          className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} />
                        {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                        <p className="text-[11px] text-slate-600 mt-1">Lembretes 3, 2 e 1 dia(s) antes da consulta.</p>
                      </div>
                    </div>

                    <button type="submit"
                      className="w-full bg-sky-500 text-white font-bold py-3.5 rounded-xl hover:bg-sky-600 transition-colors text-sm mt-2">
                      Enviar Solicitação
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
