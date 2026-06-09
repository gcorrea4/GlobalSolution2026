import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useForm } from 'react-hook-form';
import { LayoutDashboard, LogOut, Clock, CalendarDays, Users, ClipboardList, Activity, CheckCircle2, AlertCircle, TrendingUp, Bell, CalendarCheck, ChevronRight, Phone, Mail, MapPin, Sparkles, Video } from 'lucide-react';
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

export function PacienteDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  const userId = sessionStorage.getItem('userId');

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'triagem' | 'consultas'>('painel');
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
      .then(data => {
        setOfertaRecebida(data && data.id ? (data as OfertaAgendamento) : null);
      })
      .catch(() => {});

    Promise.allSettled([fetchInfo, fetchHistorico, fetchOferta])
      .finally(() => setCarregandoDados(false));

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
      .then(data => {
        setOfertaRecebida(data && data.id ? (data as OfertaAgendamento) : null);
      })
      .catch(() => {});
  }, [telaAtiva, userId]);

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const consultasConcluidas = historicoPaciente.filter(h => h.status === 'Concluído').length;
  const consultasAgendadas = historicoPaciente.filter(h => h.status === 'Agendado').length;
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

  const inputClass = 'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500 outline-none';

  const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const slotConfirmado = ofertaRecebida?.status === 'confirmado' ? ofertaRecebida.slotEscolhido : null;
  let confirmedDiaSemana = '';
  let confirmedDataFormatada = '';
  let confirmedDiasAte: number | null = null;
  if (slotConfirmado) {
    const [cAno, cMes, cDia] = slotConfirmado.data.split('-');
    const cObj = new Date(Number(cAno), Number(cMes) - 1, Number(cDia));
    confirmedDiaSemana    = DIAS_SEMANA[cObj.getDay()];
    confirmedDataFormatada = `${cDia}/${cMes}/${cAno}`;
    confirmedDiasAte      = Math.ceil((cObj.getTime() - Date.now()) / 86_400_000);
  }

  const navItems = [
    { id: 'painel',    icon: <LayoutDashboard size={20} />, label: 'Meu Painel',  badge: 0 },
    { id: 'triagem',   icon: <ClipboardList size={20} />,   label: 'Solicitar',   badge: 0 },
    { id: 'consultas', icon: <CalendarCheck size={20} />,   label: 'Consultas',   badge: ofertaRecebida?.status === 'pendente' ? 1 : 0 },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-16 md:pb-0 transition-colors duration-300">
      <title>Meu Caso · OrbitalCare</title>

      {/* ── Top navigation bar ── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">

          {/* User info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl text-white flex items-center justify-center font-black text-base shadow-sm">
              {usuarioLogado?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none truncate max-w-[140px]">{usuarioLogado}</p>
              <p className="text-xs text-sky-500 font-semibold mt-0.5">Paciente OrbitalCare</p>
            </div>
            <DemoBadge />
          </div>

          {/* Tab navigation — desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mx-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setTelaAtiva(item.id)}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  telaAtiva === item.id
                    ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-600/60'
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge > 0 && (
                  <span className="bg-sky-500 text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none animate-pulse">
                    !
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm font-bold transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
            title="Sair"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Toast */}
      {mensagemSucesso && (() => {
        const isErro = mensagemSucesso.startsWith('__erro__');
        const texto = isErro ? mensagemSucesso.replace('__erro__', '') : mensagemSucesso;
        return (
          <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 w-max ${isErro ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            <CheckCircle2 size={20} /> {texto}
          </div>
        );
      })()}

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 w-full">

        {telaAtiva === 'painel' && (
          <div className="animate-fade-in space-y-8">
            {carregandoDados && (
              <>
                <Skeleton variant="card" />
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </>
            )}
            {!carregandoDados && (<>

            {/* Oferta de agendamento pendente */}
            {ofertaRecebida?.status === 'pendente' && (
              <button onClick={() => setTelaAtiva('consultas')}
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white p-5 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition-all text-left animate-fade-in">
                <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                  <Bell size={24} className="text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-lg">Novo horário disponível!</p>
                  <p className="text-sky-100 text-sm mt-0.5">Dr(a). {ofertaRecebida.dentistaNome} enviou {ofertaRecebida.slots.length} opção(ões) para <strong>{ofertaRecebida.procedimento}</strong>. Escolha o melhor horário.</p>
                </div>
                <ChevronRight size={24} className="flex-shrink-0 text-white/80" />
              </button>
            )}

            {/* Boas-vindas */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                {userId && Number(userId) > 0 && (
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <TicketNumero id={Number(userId)} copiavel />
                    {statusAtual && <TicketBadge status={statusAtual} />}
                  </div>
                )}
                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">Olá, {usuarioLogado}! 👋</h2>
                <p className="text-gray-500 dark:text-slate-400 text-lg">Bem-vindo ao seu painel OrbitalCare.</p>
              </div>
              {!fichaEnviada && (
                <button onClick={() => setTelaAtiva('triagem')}
                  className="bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
                  <ClipboardList size={20} /> Solicitar Teleconsulta
                </button>
              )}
            </div>

            {/* Barra de progresso do acompanhamento */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-sky-100 dark:bg-sky-950/40 p-2 rounded-lg text-sky-500"><TrendingUp size={20} /></div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Progresso do Acompanhamento</h3>
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-4xl font-black text-sky-500">{consultasConcluidas}
                    <span className="text-lg font-semibold text-gray-400"> / {TOTAL_CONSULTAS_PLANO}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">teleconsultas realizadas</p>
                </div>
                <div className="text-right space-y-1">
                  {consultasAgendadas > 0 && (
                    <span className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-950/40 text-sky-500 dark:text-sky-400 text-xs font-bold px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/40">
                      <Clock size={12} /> {consultasAgendadas} agendada{consultasAgendadas > 1 ? 's' : ''}
                    </span>
                  )}
                  {consultasConcluidas >= TOTAL_CONSULTAS_PLANO && (
                    <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-100 dark:border-green-900/40">
                      <CheckCircle2 size={12} /> Acompanhamento concluído!
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressoPct}%`,
                    background: progressoPct >= 100 ? '#10b981' : 'linear-gradient(90deg, #0EA5E9, #38bdf8)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {Array.from({ length: TOTAL_CONSULTAS_PLANO }).map((_, i) => (
                  <span key={i} className={`text-[10px] font-bold ${i < consultasConcluidas ? 'text-sky-500' : 'text-gray-300 dark:text-slate-600'}`}>
                    {i + 1}ª
                  </span>
                ))}
              </div>
              {historicoPaciente.length === 0 && !carregandoDados && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 text-center">Solicite uma teleconsulta para iniciar o seu acompanhamento.</p>
              )}
            </div>

            {/* Linha do tempo do seu caso */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 flex items-center gap-3">
                <div className="bg-sky-100 dark:bg-sky-950/40 p-2 rounded-lg text-sky-500"><Activity size={20} /></div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Linha do tempo do seu caso</h3>
              </div>
              <div className="p-6">
                <TicketTimeline eventos={historicoTicket} loading={carregandoHistorico} />
              </div>
            </div>

            {/* Histórico */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 flex items-center gap-3">
                <div className="bg-sky-100 dark:bg-sky-950/40 p-2 rounded-lg text-sky-500"><Activity size={20} /></div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Histórico de Teleconsultas</h3>
              </div>
              <div className="p-6">
                <div className="relative border-l-2 border-gray-100 dark:border-slate-700 ml-4 space-y-8">
                  {historicoPaciente.length === 0 ? (
                    <EmptyState
                      icon={ClipboardList}
                      title="Sem teleconsultas registradas"
                      description="Solicite uma teleconsulta para que o sistema conecte você ao médico disponível."
                      action={{ label: 'Solicitar Teleconsulta', onClick: () => setTelaAtiva('triagem') }}
                    />
                  ) : (
                    historicoPaciente.map((item, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className={`absolute w-6 h-6 rounded-full -left-[13px] top-0 border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ${item.status === 'Agendado' ? 'bg-sky-500' : 'bg-emerald-500'}`}>
                          {item.status === 'Agendado' ? <Clock size={10} className="text-white" /> : <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 dark:text-white text-lg">{item.titulo}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${item.status === 'Agendado' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40' : 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/40'}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.proc && <p className="text-gray-600 dark:text-slate-400 text-sm mb-3 font-medium">{item.proc}</p>}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14} /> {item.data}</span>
                            {item.hora && <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><Clock size={14} /> {item.hora}</span>}
                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><Users size={14} /> Dr(a). {item.dentista}</span>
                          </div>
                          {item.status === 'Agendado' && (
                            <div className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/30 px-3 py-2.5 rounded-xl border border-sky-200 dark:border-sky-900/40">
                              <Video size={14} />
                              Teleconsulta Online — Via Satélite / Videochamada
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            </>)}
          </div>
        )}

        {telaAtiva === 'consultas' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-sky-100 dark:bg-sky-950/40 p-3 rounded-xl text-sky-500">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Consultas</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm">Escolha o melhor horário ou veja os agendamentos.</p>
              </div>
            </div>

            {/* Pending offer */}
            {ofertaRecebida?.status === 'pendente' ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-sky-500/10 to-transparent border-b border-gray-100 dark:border-slate-700">
                  <p className="text-[11px] font-bold text-sky-500 uppercase tracking-wider mb-1">Proposta do seu médico</p>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white">{ofertaRecebida.procedimento}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Dr(a). {ofertaRecebida.dentistaNome} disponibilizou {ofertaRecebida.slots.length} opção(ões). Escolha a que melhor se adequa à sua agenda.</p>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Selecione um horário:</p>
                  {ofertaRecebida.slots.map(slot => {
                    const [ano, mes, dia] = slot.data.split('-');
                    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
                    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
                    const diaSemana = diasSemana[dataObj.getDay()];
                    const selecionado = slotEscolhidoId === slot.id;
                    return (
                      <label key={slot.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selecionado ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/20' : 'border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/40 hover:border-gray-300 dark:hover:border-slate-500'}`}>
                        <input type="radio" name="slot" value={slot.id} checked={selecionado}
                          onChange={() => setSlotEscolhidoId(slot.id)}
                          className="accent-sky-500 w-4 h-4 flex-shrink-0" />
                        <div className="flex-1">
                          <p className={`font-bold text-base ${selecionado ? 'text-sky-500' : 'text-gray-800 dark:text-white'}`}>
                            {diaSemana}, {dia}/{mes}/{ano}
                          </p>
                          <p className="text-gray-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                            <Clock size={13} /> {slot.hora}
                          </p>
                        </div>
                        {selecionado && <CheckCircle2 size={22} className="text-sky-500 flex-shrink-0" />}
                      </label>
                    );
                  })}
                </div>

                <div className="p-6 pt-0">
                  <button onClick={handleConfirmarSlot} disabled={!slotEscolhidoId}
                    className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-colors shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed">
                    <CheckCircle2 size={20} /> Confirmar este Horário
                  </button>
                </div>
              </div>
            ) : ofertaRecebida?.status === 'confirmado' ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">

                {/* Barra de destaque no topo */}
                <div className="h-1.5 bg-gradient-to-r from-sky-400 via-[#0EA5E9] to-sky-600" />

                {/* Ícone + título */}
                <div className="px-8 py-8 text-center border-b border-gray-50 dark:border-slate-700">
                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/30 rounded-full flex items-center justify-center ring-4 ring-sky-50 dark:ring-sky-950/30">
                      <CheckCircle2 size={34} className="text-sky-500" strokeWidth={2.5} />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 bg-sky-500 rounded-full p-1 shadow-sm">
                      <Sparkles size={11} className="text-white" />
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Teleconsulta Confirmada!</h3>
                  <p className="text-gray-400 dark:text-slate-400 text-sm">{ofertaRecebida.procedimento}</p>
                  {confirmedDiasAte !== null && confirmedDiasAte >= 0 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-xs font-bold px-3 py-1.5 rounded-full border border-sky-100 dark:border-sky-900/50">
                      <Clock size={11} />
                      {confirmedDiasAte === 0 ? 'Hoje!' : confirmedDiasAte === 1 ? 'Amanhã!' : `Em ${confirmedDiasAte} dias`}
                    </div>
                  )}
                </div>

                {/* Info rows */}
                <div className="p-6 space-y-3">

                  {/* Data e hora */}
                  {slotConfirmado && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <div className="bg-sky-100 dark:bg-sky-950/30 rounded-xl p-2.5 flex-shrink-0">
                        <CalendarDays size={20} className="text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Data e Hora</p>
                        <p className="font-bold text-gray-900 dark:text-white">{confirmedDiaSemana}, {confirmedDataFormatada}</p>
                        <p className="text-gray-400 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {slotConfirmado.hora}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Médico */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center font-black text-base flex-shrink-0">
                      {ofertaRecebida.dentistaNome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Médico</p>
                      <p className="font-bold text-gray-900 dark:text-white truncate">Dr(a). {ofertaRecebida.dentistaNome}</p>
                      {ofertaRecebida.dentistaCidade && (
                        <p className="text-gray-400 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {ofertaRecebida.dentistaCidade}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Formato da consulta */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <div className="bg-sky-100 dark:bg-sky-950/30 rounded-xl p-2.5 flex-shrink-0">
                      <Video size={20} className="text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Formato</p>
                      <p className="font-bold text-gray-900 dark:text-white">Teleconsulta Online</p>
                      <p className="text-gray-400 dark:text-slate-400 text-xs mt-0.5">Via Satélite / Videochamada</p>
                    </div>
                  </div>

                  {/* Lembrete */}
                  <div className="flex items-start gap-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 rounded-2xl p-4">
                    <Bell size={14} className="text-sky-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sky-600 dark:text-sky-300 text-xs font-medium leading-relaxed">
                      Você receberá lembretes por e-mail <strong>3, 2 e 1 dia(s)</strong> antes da teleconsulta. Fique atento à sua caixa de entrada.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
                <EmptyState
                  icon={CalendarCheck}
                  title="Sem propostas pendentes"
                  description="Quando um médico disponível enviar opções de horário para teleconsulta, elas aparecerão aqui."
                />
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'triagem' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-sky-100 dark:bg-sky-950/40 p-3 rounded-xl text-sky-500">
                <ClipboardList size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Nova Solicitação de Teleconsulta</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm">Preencha para que o sistema encontre o médico especialista disponível na sua região.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
              {fichaEnviada ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Solicitação Recebida!</h3>
                  <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto">Solicitação registrada e priorizada pelo sistema. Um médico disponível entrará em contato para a teleconsulta em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Especialidade e Urgência */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-2xl">
                    <div className="md:col-span-2">
                      <h4 className="font-bold text-sky-700 dark:text-sky-400 text-sm flex items-center gap-2 mb-4">
                        <AlertCircle size={16} className="text-sky-500" /> Dados da Teleconsulta
                      </h4>
                    </div>

                    {/* Especialidade */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-1.5">
                        Especialidade Médica
                      </label>
                      <select
                        {...register('especialidade', { required: 'Selecione uma especialidade' })}
                        className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none ${errors.especialidade ? 'border-red-500' : ''}`}
                      >
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
                      {errors.especialidade && <span className="text-red-500 text-xs mt-1">{errors.especialidade.message}</span>}
                    </div>

                    {/* Urgência */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
                        Nível de Urgência
                      </label>
                      <div className="flex gap-3">
                        {(['BAIXA', 'MEDIA', 'ALTA'] as const).map(u => {
                          const isSelected = urgenciaAtual === u;
                          const colorsMap = {
                            BAIXA: isSelected ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500',
                            MEDIA: isSelected ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400' : 'border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500',
                            ALTA:  isSelected ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' : 'border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500',
                          };
                          return (
                            <label key={u} className="flex-1 cursor-pointer">
                              <input
                                type="radio"
                                value={u}
                                {...register('urgencia', { required: true })}
                                className="sr-only"
                              />
                              <div className={`text-center py-2.5 px-2 rounded-xl border-2 font-bold text-sm transition-all ${colorsMap[u]}`}>
                                {u === 'BAIXA' ? 'Baixa' : u === 'MEDIA' ? 'Média' : 'Alta'}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sintomas */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-1.5">
                        Descreva seus sintomas
                      </label>
                      <textarea
                        {...register('sintomas', {
                          required: 'Descreva os sintomas',
                          minLength: { value: 10, message: 'Mínimo de 10 caracteres' }
                        })}
                        rows={3}
                        placeholder="Ex: Dor de cabeça há 3 dias, febre de 38°C, dificuldade para respirar..."
                        className={`${inputClass.replace('dark:bg-slate-700', 'dark:bg-slate-800')} resize-none ${errors.sintomas ? 'border-red-500' : ''}`}
                      />
                      {errors.sintomas && <span className="text-red-500 text-xs mt-1">{errors.sintomas.message}</span>}
                    </div>
                  </div>

                  {/* Contato */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" /> Telefone para Contato
                      </label>
                      <input type="tel" placeholder="(11) 99999-9999"
                        {...register('telefone', {
                          required: 'Telefone obrigatório',
                          pattern: { value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Formato inválido. Use (11) 99999-9999' }
                        })}
                        onChange={e => setValue('telefone', aplicarMascaraTelefone(e.target.value), { shouldValidate: !!errors.telefone })}
                        className={`${inputClass} ${errors.telefone ? 'border-red-500' : ''}`} />
                      {errors.telefone && <span className="text-red-500 text-xs mt-1">{errors.telefone.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" /> E-mail para Lembretes
                      </label>
                      <input type="email" placeholder="seu@email.com"
                        {...register('email', {
                          required: 'E-mail obrigatório',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
                        })}
                        className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} />
                      {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">Você receberá lembretes 3, 2 e 1 dia(s) antes da teleconsulta.</p>
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full bg-[#0EA5E9] text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-colors shadow-md text-lg mt-4">
                    Enviar Solicitação
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTelaAtiva(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-colors ${
                telaAtiva === item.id ? 'text-sky-500' : 'text-slate-400'
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-sky-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none animate-pulse">
                    !
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold leading-none">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
