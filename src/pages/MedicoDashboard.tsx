import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { calcularScore, type TipoDor } from '../utils/scoreUtils';
import { gerarTicket, abreviarNome } from '../utils/ticketUtils';
import { imprimirRelatorio } from '../utils/relatorioUtils';
import { StatusAgendamento } from '../components/StatusAgendamento';
import { ModalAvaliarPaciente } from '../components/ModalAvaliarPaciente';
import { ModalFichaAtiva } from '../components/ModalFichaAtiva';
import { Skeleton, EmptyState, Badge, DemoBadge } from '../components/ui';
import { SLABadge, TicketBadge } from '../components/ticket';
import { pacientesApi } from '../lib/api';
import type { EventoHistorico, TicketStatus } from '../lib/api';
import {
  LayoutDashboard, Users, Calendar, LogOut,
  Search, MessageSquare, Send,
  MapPin, Phone, AlertCircle, Star, Filter, Clock, CheckCircle2, X,
  FileText, SearchX, CalendarDays, Menu, Satellite, Video,
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
}

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  pais: string;
  cidade: string;
  tipo_dor: string;
  score_match: number;
  renda: number;
  tempo_dor: number;
  telefone?: string;
  historico?: HistoricoConsulta[];
  criadoEm?: string;
  status?: TicketStatus;
}

interface Agendamento {
  id: number;
  paciente: Paciente;
  data: string;
  hora: string;
  tipo: string;
}

interface SlotProposto {
  id: string;
  data: string;
  hora: string;
}

interface OfertaAgendamento {
  id?: number;
  dentistaNome: string;
  dentistaCidade: string;
  procedimento: string;
  slots: SlotProposto[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
}

// ─── Funções puras ────────────────────────────────────────────────────────────

function mapearPaciente(p: Record<string, unknown>): Paciente {
  let idadeCalculada = p.idade as number | undefined;
  if (!idadeCalculada && p.dataNascimento) {
    const nasc = new Date(p.dataNascimento as string);
    const hoje = new Date();
    idadeCalculada = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idadeCalculada--;
  }
  return {
    id:          p.id as number,
    nome:        p.nome as string,
    idade:       idadeCalculada ?? 0,
    pais:        (p.pais as string)      || 'Não informado',
    cidade:      (p.cidade as string)    || 'Não informado',
    tipo_dor:    ((p.tipoDor ?? p.tipo_dor) as string)                   || 'Não informado',
    renda:       ((p.rendaSalarioMinimo ?? p.renda) as number)           ?? 0,
    tempo_dor:   ((p.tempoDorDias ?? p.tempo_dor) as number)             ?? 0,
    score_match: ((p.scoreMatch ?? p.score_match) as number)             ?? 50,
    telefone:    p.telefone as string | undefined,
    historico:   p.historico as HistoricoConsulta[] | undefined,
    criadoEm:    (p.criadoEm ?? p.dataCadastro) as string | undefined,
    status:      p.status as TicketStatus | undefined,
  };
}

function formatarDataAgenda(dataISO: string) {
  if (!dataISO) return { diaSemana: 'DIA', diaMes: '00' };
  const [ano, mes, dia] = dataISO.split('-');
  const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return { diaSemana: dias[dataObj.getDay()], diaMes: dia };
}

function mapDorParaEnum(tipoDor: string): TipoDor {
  const d = tipoDor.toLowerCase();
  if (d.includes('quebrado') || d === 'urgente' || d === 'alta') return 'urgente';
  if (d === 'forte' || d === 'media') return 'forte';
  if (d === 'moderada') return 'moderada';
  return 'leve';
}

function calcularScorePaciente(p: Paciente): number {
  return calcularScore(mapDorParaEnum(p.tipo_dor || ''), p.renda ?? 0, typeof p.idade === 'number' ? p.idade : 0);
}

function UrgenciaBadge({ score }: { score: number }) {
  if (score >= 70) return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">ALTA</span>
  );
  if (score >= 40) return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">MÉDIA</span>
  );
  return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">BAIXA</span>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

type TelaMedico = 'painel' | 'pacientes' | 'agenda';

export function MedicoDashboard() {
  const navigate = useNavigate();

  const [telaAtiva, setTelaAtiva] = useState<TelaMedico>('painel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [respostaIA, setRespostaIA] = useState('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [meusPacientes, setMeusPacientes] = useState<Paciente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [slotsPropostos, setSlotsPropostos] = useState<SlotProposto[]>([]);
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');
  const [procedimentoOferta, setProcedimentoOferta] = useState('Primeira Teleconsulta - Avaliação');
  const [ofertasMapa, setOfertasMapa] = useState<Record<string, OfertaAgendamento>>({});
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [fichaAtiva, setFichaAtiva] = useState<Paciente | null>(null);
  const [carregandoPacientes, setCarregandoPacientes] = useState(true);
  const [carregandoMeusPacientes, setCarregandoMeusPacientes] = useState(true);
  const [confirmarCancelamento, setConfirmarCancelamento] = useState<Paciente | null>(null);
  const [historicoFichaAtiva, setHistoricoFichaAtiva] = useState<EventoHistorico[]>([]);
  const [carregandoHistoricoFicha, setCarregandoHistoricoFicha] = useState(false);

  const medicoId = sessionStorage.getItem('userId') || '0';
  const usuarioLogado = sessionStorage.getItem('usuarioLogado') || 'Médico';
  const userRole = sessionStorage.getItem('userRole');
  const [cidadeAtiva, setCidadeAtiva] = useState(sessionStorage.getItem('dentistaCidade') || sessionStorage.getItem('medicoCidade') || 'São Paulo');

  const showMensagem = (msg: string, ms = 3500) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), ms);
  };

  const handleConcluirConsulta = async (idOferta: number) => {
    try {
      const res = await apiFetch(`/ofertas/${idOferta}/concluir`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      setAgendamentos(prev => prev.filter(a => a.id !== idOferta));
      showMensagem('Teleconsulta marcada como concluída!');
    } catch {
      showMensagem('Erro ao concluir. Tente novamente.');
    }
  };

  useEffect(() => {
    if (fichaAtiva) { setRespostaIA(''); setPergunta(''); }
  }, [fichaAtiva]);

  useEffect(() => { localStorage.setItem('orb_agendamentos', JSON.stringify(agendamentos)); }, [agendamentos]);
  useEffect(() => { localStorage.setItem('orb_ofertasHorario', JSON.stringify(ofertasMapa)); }, [ofertasMapa]);

  useEffect(() => {
    const idNum = Number(medicoId);
    if (!idNum) { setCarregandoMeusPacientes(false); return; }
    apiFetch(`/pacientes/adotados?idDentista=${idNum}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMeusPacientes(data.map(mapearPaciente));
        setCarregandoMeusPacientes(false);
      })
      .catch(() => { setCarregandoMeusPacientes(false); });
  }, [medicoId]);

  useEffect(() => {
    const idMedico = sessionStorage.getItem('userId');
    if (!idMedico) return;
    apiFetch(`/ofertas/dentista/${idMedico}`)
      .then(res => res.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((ofertas: any[]) => {
        if (!Array.isArray(ofertas)) return;
        const mapa: Record<string, OfertaAgendamento> = {};
        const agendados: Agendamento[] = [];
        for (const o of ofertas) {
          mapa[o.pacienteNome] = {
            id: o.id,
            dentistaNome: usuarioLogado, dentistaCidade: cidadeAtiva,
            procedimento: o.procedimento, slots: [],
            status: o.status as 'pendente' | 'confirmado',
            slotEscolhido: o.status === 'confirmado' ? { data: o.data, hora: o.hora } : undefined,
            criadaEm: '',
          };
          if (o.status === 'confirmado') {
            agendados.push({
              id: o.id,
              paciente: { id: o.idPaciente, nome: o.pacienteNome, idade: 0, pais: '', cidade: '', tipo_dor: '', score_match: 0, renda: 0, tempo_dor: 0 },
              data: o.data, hora: o.hora, tipo: o.procedimento,
            });
          }
        }
        setOfertasMapa(mapa);
        setAgendamentos(agendados);
      })
      .catch(() => {});
  }, [usuarioLogado, cidadeAtiva]);

  useEffect(() => {
    setCarregandoPacientes(true);
    apiFetch(`/pacientes?cidade=${cidadeAtiva}`)
      .then(res => res.json())
      .then(data => {
        setPacientes(Array.isArray(data) ? data.map(mapearPaciente) : []);
        setCarregandoPacientes(false);
      })
      .catch(() => { setCarregandoPacientes(false); });
  }, [cidadeAtiva]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      apiFetch(`/pacientes?cidade=${cidadeAtiva}`)
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setPacientes(data.map(mapearPaciente)); })
        .catch(() => {});
      const idNum = Number(medicoId);
      if (idNum) {
        apiFetch(`/pacientes/adotados?idDentista=${idNum}`)
          .then(r => r.json())
          .then(data => { if (Array.isArray(data)) setMeusPacientes(data.map(mapearPaciente)); })
          .catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [cidadeAtiva, medicoId]);

  // ─── Derivados ──────────────────────────────────────────────────────────────

  const slotsOcupados = agendamentos.map(a => `${a.data}|${a.hora}`);
  const slotsLivres   = slotsPropostos.filter(s => !slotsOcupados.includes(`${s.data}|${s.hora}`));
  const dataHoje      = new Date().toISOString().split('T')[0];
  const ofertaAtiva   = fichaAtiva ? ofertasMapa[fichaAtiva.nome] : undefined;

  const pacientesFiltrados = pacientes
    .filter(p => p.nome.toLowerCase().includes(pesquisa.toLowerCase()))
    .sort((a, b) => calcularScorePaciente(b) - calcularScorePaciente(a))
    .map(p => ({ ...p, score_match: calcularScorePaciente(p) }));

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const handleAdicionarSlot = () => {
    if (!novaData || !novaHora) return;
    const chave = `${novaData}|${novaHora}`;
    if (slotsPropostos.find(s => `${s.data}|${s.hora}` === chave)) return;
    setSlotsPropostos(prev => [...prev, { id: Date.now().toString(), data: novaData, hora: novaHora }]);
    setNovaHora('');
  };

  const handleRemoverSlot = (id: string) => setSlotsPropostos(prev => prev.filter(s => s.id !== id));

  const handleEnviarOferta = async () => {
    if (!fichaAtiva || slotsLivres.length === 0) return;
    try {
      const res = await apiFetch('/ofertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idDentista: Number(medicoId), idPaciente: fichaAtiva.id,
          procedimento: procedimentoOferta,
          slots: slotsLivres.map(s => ({ data: s.data, hora: s.hora })),
        }),
      });
      if (!res.ok) throw new Error('API error');
      setOfertasMapa(prev => ({ ...prev, [fichaAtiva.nome]: {
        dentistaNome: usuarioLogado, dentistaCidade: cidadeAtiva,
        procedimento: procedimentoOferta, slots: slotsLivres,
        status: 'pendente', criadaEm: new Date().toISOString(),
      } }));
      setSlotsPropostos([]); setNovaData(''); setNovaHora('');
      showMensagem(`Horários de teleconsulta enviados para ${fichaAtiva.nome}!`);
    } catch {
      showMensagem('Erro ao enviar proposta. Tente novamente.');
    }
  };

  const atualizarStatusPaciente = async (paciente: Paciente, acao: 'adotado' | 'disponivel') => {
    const idNum = Number(medicoId);
    if (acao === 'adotado' && !idNum) { alert('Erro: ID do médico não encontrado. Por favor, faça login novamente.'); return; }
    try {
      const res = await apiFetch(`/pacientes/${paciente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: paciente.nome, cidade: paciente.cidade, pais: paciente.pais,
          tipoDor: paciente.tipo_dor !== 'Não informado' ? paciente.tipo_dor : undefined,
          tempoDorDias: paciente.tempo_dor || 0,
          rendaSalarioMinimo: paciente.renda || 0,
          telefone: paciente.telefone,
          status: acao,
          ...(acao === 'adotado' ? { idDentistaResponsavel: idNum } : {}),
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as { erro?: string; causa?: string }).causa || (errBody as { erro?: string }).erro || `Erro HTTP ${res.status}`);
      }
      if (acao === 'adotado') {
        setPacientes(prev => prev.filter(p => p.id !== paciente.id));
        setMeusPacientes(prev => [...prev, { ...paciente }]);
        setPacienteSelecionado(null);
        setTelaAtiva('pacientes');
        showMensagem(`Paciente ${paciente.nome} aceito com sucesso!`);
        pacientesApi.atualizarStatus(paciente.id, 'EM_ATENDIMENTO', `Aceito por Dr(a). ${usuarioLogado}`).catch(() => {});
      } else {
        setMeusPacientes(prev => prev.filter(p => p.id !== paciente.id));
        setAgendamentos(prev => prev.filter(a => a.paciente.nome !== paciente.nome));
        apiFetch(`/pacientes?cidade=${cidadeAtiva}`)
          .then(r => r.json())
          .then(data => { if (Array.isArray(data)) setPacientes(data.map(mapearPaciente)); })
          .catch(() => {});
        showMensagem(`Atendimento de ${paciente.nome} encerrado. Paciente retornou à fila.`, 4000);
      }
    } catch {
      showMensagem(acao === 'adotado' ? 'Erro ao aceitar paciente. Tente novamente.' : 'Erro ao encerrar atendimento. Tente novamente.');
    }
  };

  const handleCancelarOferta = async (ofertaId: number, pacienteNome: string) => {
    try {
      const res = await apiFetch(`/ofertas/${ofertaId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setOfertasMapa(prev => { const novo = { ...prev }; delete novo[pacienteNome]; return novo; });
      showMensagem(`Proposta enviada a ${pacienteNome} cancelada.`);
    } catch {
      showMensagem('Erro ao cancelar a proposta. Tente novamente.');
    }
  };

  const enviarPerguntaIA = async () => {
    if (!pergunta.trim()) return;
    setCarregandoIA(true);
    try {
      const res = await apiFetch('/IA/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: pergunta, fila_json: JSON.stringify(pacientesFiltrados) }),
      });
      const data = await res.json();
      let textoFinal = '';
      if (data.candidates?.length > 0) textoFinal = data.candidates[0].content.parts[0].text;
      else if (data.resposta) textoFinal = data.resposta;
      else if (data.error) textoFinal = 'Erro do servidor: ' + data.error;
      else textoFinal = 'A IA processou, mas não retornou um formato legível.';
      setRespostaIA(textoFinal);
      setPergunta('');
    } catch {
      setRespostaIA('Desculpe, Doutor(a). Tive um erro de conexão ao consultar a IA.');
    } finally {
      setCarregandoIA(false);
    }
  };

  const abrirFicha = (p: Paciente) => {
    setFichaAtiva(p);
    setSlotsPropostos([]);
    setNovaData('');
    setNovaHora('');
    setProcedimentoOferta('Primeira Teleconsulta - Avaliação');
    setHistoricoFichaAtiva([]);
    setCarregandoHistoricoFicha(true);
    pacientesApi.historicoTicket(p.id)
      .then(eventos => setHistoricoFichaAtiva(Array.isArray(eventos) ? eventos : []))
      .catch(() => {})
      .finally(() => setCarregandoHistoricoFicha(false));
  };

  // ─── Nav ─────────────────────────────────────────────────────────────────────

  const navItems = [
    { id: 'painel' as const,    icon: <LayoutDashboard size={18} />, label: 'Fila de Pacientes',  badge: pacientes.length },
    { id: 'pacientes' as const, icon: <Users size={18} />,           label: 'Meus Pacientes',     badge: meusPacientes.length },
    { id: 'agenda' as const,    icon: <Calendar size={18} />,        label: 'Teleconsultas',      badge: agendamentos.length },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
      <title>Meu Painel · OrbitalCare</title>

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
                <span className="ml-auto bg-slate-800 text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500/20 text-sky-400 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              {usuarioLogado.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{usuarioLogado}</p>
              <p className="text-slate-500 text-[11px]">{userRole === 'dev' ? 'Desenvolvedor' : 'Médico OrbitalCare'}</p>
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
            {navItems.find(n => n.id === telaAtiva)?.label ?? 'Dashboard'}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <DemoBadge />
          </div>
        </header>

        {/* Toast */}
        {mensagem && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap shadow-lg">
            <CheckCircle2 size={16} /> {mensagem}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* ── Fila de Pacientes ── */}
          {telaAtiva === 'painel' && (
            <div className="animate-fade-in space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Fila de Triagem</h2>
                  {userRole === 'dev' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Filter size={12} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase">Simular Região:</span>
                      <select value={cidadeAtiva} onChange={e => setCidadeAtiva(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2 py-1 text-sky-400 font-bold outline-none cursor-pointer hover:border-sky-500 transition-colors">
                        <option value="São Paulo">São Paulo (BR)</option>
                        <option value="Rio de Janeiro">Rio de Janeiro (BR)</option>
                        <option value="Bogotá">Bogotá (CO)</option>
                        <option value="Buenos Aires">Buenos Aires (AR)</option>
                        <option value="Cidade do México">Cidade do México (MX)</option>
                        <option value="Santiago">Santiago (CL)</option>
                      </select>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm mt-0.5">Região: <span className="font-semibold text-white">{cidadeAtiva}</span> — ordenado por IA</p>
                  )}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input type="text" placeholder="Buscar paciente..." value={pesquisa}
                    onChange={e => setPesquisa(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 w-full md:w-[220px] focus:ring-1 focus:ring-sky-500/40 focus:border-sky-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Tabela de fila */}
                <div className="lg:col-span-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pacientes na Fila</span>
                    </div>

                    {carregandoPacientes ? (
                      <div className="p-4 space-y-3">
                        <Skeleton variant="card" />
                        <Skeleton variant="card" />
                        <Skeleton variant="card" />
                      </div>
                    ) : pacientesFiltrados.length === 0 ? (
                      <div className="p-6">
                        <EmptyState icon={SearchX} title="Nenhum paciente na fila"
                          description="Quando pacientes desta região solicitarem teleconsulta, aparecerão aqui." />
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-800">
                              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Paciente</th>
                              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Sintoma</th>
                              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Urgência</th>
                              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Espera</th>
                              <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pacientesFiltrados.map((p, i) => (
                              <tr key={p.id} className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/60 ${i % 2 === 1 ? 'bg-slate-800/30' : ''}`}>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${p.score_match >= 70 ? 'bg-red-500/10 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                                      {p.nome.charAt(0)}
                                    </div>
                                    <div>
                                      <button className="font-semibold text-white text-sm hover:text-sky-400 transition-colors text-left"
                                        onClick={() => navigate(`/prontuario/${p.nome}`)}>
                                        {p.nome}
                                      </button>
                                      <p className="text-xs text-slate-500">{p.idade} anos · {p.cidade}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm hidden sm:table-cell">
                                  <div className="flex items-center gap-1.5">
                                    <AlertCircle size={12} className={p.score_match >= 70 ? 'text-red-400' : 'text-slate-500'} />
                                    {p.tipo_dor}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <UrgenciaBadge score={p.score_match} />
                                    <span className="text-xs text-slate-500 font-mono">{p.score_match}%</span>
                                    {p.score_match >= 70 && <Star size={11} className="text-amber-400 fill-amber-400" />}
                                  </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                  {p.criadoEm ? <SLABadge criadoEm={p.criadoEm} /> : <span className="text-slate-600 text-xs">—</span>}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button onClick={() => setPacienteSelecionado(p)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/40 text-sky-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors">
                                    Aceitar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat IA */}
                <div className="hidden lg:flex lg:col-span-4 flex-col">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[520px] sticky top-0 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3 flex-shrink-0">
                      <div className="bg-sky-500/10 p-1.5 rounded-lg border border-sky-500/20 text-sky-400">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Assistente OrbitalCare</h3>
                        <p className="text-xs text-slate-500">Gemini 2.5</p>
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      <div className="bg-slate-800 p-3 rounded-xl rounded-tl-sm text-sm text-slate-300 border border-slate-700">
                        Doutor(a), os pacientes estão priorizados por urgência na região de <strong className="text-white">{cidadeAtiva}</strong>. Posso ajudar a analisar algum caso?
                      </div>
                      {respostaIA && (
                        <div className="bg-sky-500/5 p-3 rounded-xl rounded-tl-sm text-sm text-slate-300 border border-sky-500/20 whitespace-pre-wrap">{respostaIA}</div>
                      )}
                      {carregandoIA && <div className="text-xs text-slate-500 font-medium animate-pulse pl-1">Analisando...</div>}
                    </div>
                    <div className="p-3 border-t border-slate-800 flex gap-2 flex-shrink-0">
                      <input type="text" placeholder="Ex: Qual o caso mais urgente?" value={pergunta}
                        onChange={e => setPergunta(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && enviarPerguntaIA()}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-sky-500/40 focus:border-sky-500 outline-none" />
                      <button onClick={enviarPerguntaIA}
                        className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600 transition-colors flex-shrink-0">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Meus Pacientes ── */}
          {telaAtiva === 'pacientes' && (
            <div className="animate-fade-in space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Meus Pacientes</h2>
                <p className="text-slate-400 text-sm mt-0.5">Pacientes em teleconsulta sob seus cuidados.</p>
              </div>

              {carregandoMeusPacientes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton variant="card" />
                  <Skeleton variant="card" />
                </div>
              ) : meusPacientes.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <EmptyState icon={Users} title="Ainda sem pacientes ativos"
                    description="Acesse a Fila de Triagem, avalie um paciente e aceite o atendimento."
                    action={{ label: 'Ver Fila de Triagem', onClick: () => setTelaAtiva('painel') }} />
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Paciente</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Contato</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Status Ticket</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Agendamento</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meusPacientes.map((p, i) => (
                          <tr key={p.id} className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/60 ${i % 2 === 1 ? 'bg-slate-800/30' : ''}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {p.nome.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-white text-sm">{p.nome}</p>
                                  <p className="text-xs text-slate-500">{p.idade} anos · {p.cidade}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <p className="text-slate-400 text-xs flex items-center gap-1"><Phone size={11} /> {p.telefone || '—'}</p>
                              <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><MapPin size={11} /> {p.pais}</p>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              {p.status ? <TicketBadge status={p.status} size="sm" /> : <Badge variant="success">Ativo</Badge>}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <StatusAgendamento oferta={ofertasMapa[p.nome]} temAgendamento={agendamentos.some(a => a.paciente?.nome === p.nome)} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => abrirFicha(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 transition-colors" title="Ver Prontuário">
                                  <CalendarDays size={15} />
                                </button>
                                <button onClick={() => imprimirRelatorio(p, usuarioLogado)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Gerar Relatório">
                                  <FileText size={15} />
                                </button>
                                <button onClick={() => setConfirmarCancelamento(p)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Encerrar atendimento">
                                  <X size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Teleconsultas ── */}
          {telaAtiva === 'agenda' && (
            <div className="animate-fade-in space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Teleconsultas</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Próximas consultas agendadas na plataforma.</p>
                </div>
                <button onClick={() => {
                  if (meusPacientes.length === 0) { showMensagem('Aceite um paciente na Triagem primeiro!'); setTelaAtiva('painel'); }
                  else setTelaAtiva('pacientes');
                }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors flex items-center gap-1.5">
                  <Video size={14} /> Nova Consulta
                </button>
              </div>

              {agendamentos.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <EmptyState icon={CalendarDays} title="Sem teleconsultas agendadas"
                    description="Vá a Meus Pacientes para propor horários."
                    action={{ label: 'Ir para Meus Pacientes', onClick: () => setTelaAtiva('pacientes') }} />
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {agendamentos.sort((a, b) => a.data.localeCompare(b.data)).map(ag => {
                      const { diaSemana, diaMes } = formatarDataAgenda(ag.data);
                      return (
                        <div key={ag.id} className="px-5 py-4 flex items-start gap-5 hover:bg-slate-800/50 transition-colors">
                          <div className="text-center w-12 flex-shrink-0">
                            <p className="text-xs font-bold text-slate-500 uppercase">{diaSemana}</p>
                            <p className="text-2xl font-black text-sky-400">{diaMes}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white">{ag.tipo}</p>
                            <p className="text-slate-500 text-xs font-mono mt-0.5">
                              {gerarTicket(ag.paciente.id)} · {abreviarNome(ag.paciente.nome)}
                            </p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                <Clock size={12} /> {ag.hora}
                              </span>
                              <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                <MapPin size={12} /> Via Satélite
                              </span>
                            </div>
                            <button onClick={() => handleConcluirConsulta(ag.id)}
                              className="mt-3 text-xs font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5">
                              <CheckCircle2 size={13} /> Marcar como Concluída
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Modais ── */}
      {pacienteSelecionado && (
        <ModalAvaliarPaciente
          paciente={pacienteSelecionado}
          onClose={() => setPacienteSelecionado(null)}
          onAdotar={p => atualizarStatusPaciente(p, 'adotado')}
        />
      )}

      {confirmarCancelamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setConfirmarCancelamento(null)}>
          <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-red-500/10 p-3 rounded-xl shrink-0">
                <X size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Remover Paciente</h3>
                <p className="text-sm text-slate-400 truncate max-w-xs">{confirmarCancelamento.nome}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              Tem certeza? <strong className="text-white">{confirmarCancelamento.nome}</strong> voltará para a fila de triagem.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarCancelamento(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-400 font-bold text-sm hover:bg-slate-800 transition-colors">
                Voltar
              </button>
              <button onClick={() => { const p = confirmarCancelamento; setConfirmarCancelamento(null); atualizarStatusPaciente(p, 'disponivel'); }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {fichaAtiva && (
        <ModalFichaAtiva
          ficha={fichaAtiva}
          usuarioLogado={usuarioLogado}
          slotsPropostos={slotsPropostos}
          novaData={novaData}
          novaHora={novaHora}
          procedimentoOferta={procedimentoOferta}
          slotsOcupados={slotsOcupados}
          slotsLivres={slotsLivres}
          dataHoje={dataHoje}
          ofertaAtiva={ofertaAtiva}
          historicoTicket={historicoFichaAtiva}
          carregandoHistorico={carregandoHistoricoFicha}
          onClose={() => setFichaAtiva(null)}
          onGerarRelatorio={p => imprimirRelatorio(p, usuarioLogado)}
          onAdicionarSlot={handleAdicionarSlot}
          onRemoverSlot={handleRemoverSlot}
          onEnviarOferta={handleEnviarOferta}
          onCancelarOferta={handleCancelarOferta}
          setNovaData={setNovaData}
          setNovaHora={setNovaHora}
          setProcedimentoOferta={setProcedimentoOferta}
        />
      )}
    </div>
  );
}
