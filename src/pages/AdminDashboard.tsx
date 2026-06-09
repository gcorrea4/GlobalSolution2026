import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../utils/api';
import {
  LayoutDashboard, Users, LogOut, MapPin, Stethoscope, CalendarDays, Clock,
   Video, Archive, AlertTriangle, CheckCircle2, Search, UserX,
  FileDown, Sheet, Database, Menu, Satellite, X,
} from 'lucide-react';
import { MetricasOperacionais } from './MetricasOperacionais';
import {
  exportarPacientesPDF, exportarPacientesCSV,
  exportarDentistasPDF, exportarDentistasCSV,
  exportarAtendimentosPDF, exportarAtendimentosCSV,
} from '../utils/adminExportUtils';
import { Skeleton, EmptyState, DemoBadge } from '../components/ui';
import { FiltroStatus, TicketBadge } from '../components/ticket';
import type { TicketStatus } from '../lib/api';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { LATAM_COORDINATES, normalizarCidade } from '../data/latamCoordinates';

// ─── Mapa de calor ────────────────────────────────────────────────────────────

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, {
      radius: 38, blur: 28, maxZoom: 10, max: 1.0,
      gradient: { 0.0: '#0c4a6e', 0.25: '#0369a1', 0.5: '#0ea5e9', 0.75: '#f97316', 1.0: '#dc2626' },
    }).addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, points]);
  return null;
}

function CityMarkers({ porCidade, coordsMap }: { porCidade: Record<string, number>; coordsMap: Record<string, [number, number]> }) {
  const maxQtd = Math.max(1, ...Object.values(porCidade).map(Number));
  return (
    <>
      {Object.entries(porCidade)
        .filter(([cidade]) => coordsMap[cidade])
        .map(([cidade, qtd]) => {
          const [lat, lng] = coordsMap[cidade];
          const ratio = Number(qtd) / maxQtd;
          const radius = 5 + ratio * 18;
          const color = ratio > 0.7 ? '#dc2626' : ratio > 0.4 ? '#f97316' : '#0ea5e9';
          return (
            <CircleMarker key={cidade} center={[lat, lng]} radius={radius}
              pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 0.85 }}>
              <Tooltip direction="top" offset={[0, -4]}>
                <span style={{ fontWeight: 700 }}>{cidade}</span>: {Number(qtd)} paciente{Number(qtd) !== 1 ? 's' : ''}
              </Tooltip>
            </CircleMarker>
          );
        })}
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function urgenciaDeTipoDor(tipoDor?: string): 'ALTA' | 'MEDIA' | 'BAIXA' {
  const d = (tipoDor || '').toLowerCase();
  if (d.includes('quebrado') || d === 'urgente' || d === 'forte' || d === 'alta') return 'ALTA';
  if (d === 'moderada' || d === 'media' || d === 'média') return 'MEDIA';
  return 'BAIXA';
}

function UrgenciaBadge({ tipoDor }: { tipoDor?: string }) {
  const nivel = urgenciaDeTipoDor(tipoDor);
  const cls = {
    ALTA:  'bg-red-500/10 text-red-400 border-red-500/20',
    MEDIA: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    BAIXA: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  }[nivel];
  return (
    <span className={`inline-flex items-center text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${cls}`}>
      {nivel}
    </span>
  );
}

function BotoesExportar({ onPDF, onCSV }: { onPDF: () => void; onCSV: () => void }) {
  return (
    <div className="flex gap-2">
      <button onClick={onPDF}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-700 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10 transition-colors">
        <FileDown size={13} /> PDF
      </button>
      <button onClick={onCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-700 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10 transition-colors">
        <Sheet size={13} /> CSV
      </button>
    </div>
  );
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface AgendamentoAdmin {
  paciente: string;
  prioridade: string;
  proc: string;
  dentista: string;
  data: string;
  hora: string;
  cidade: string;
}

interface UsuarioPaciente {
  id: number;
  nomePaciente?: string;
  nome?: string;
  email: string;
  cidade: string;
  pais: string;
  tipoDor?: string;
  statusTicket?: TicketStatus;
}

interface UsuarioDentista {
  id: number;
  nomeDentista?: string;
  nome?: string;
  email: string;
  cidade: string;
  cro?: string;
}

type TelaAdmin = 'painel' | 'pacientes' | 'medicos' | 'consultas' | 'mapa' | 'metricas';

// ─── Componente principal ─────────────────────────────────────────────────────

export function AdminDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem('usuarioLogado') || 'Admin';

  const [telaAtiva, setTelaAtiva] = useState<TelaAdmin>('painel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pacientes, setPacientes] = useState<UsuarioPaciente[]>([]);
  const [dentistas, setDentistas] = useState<UsuarioDentista[]>([]);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [mensagemAdmin, setMensagemAdmin] = useState('');
  const [tipoMensagemAdmin, setTipoMensagemAdmin] = useState<'sucesso' | 'erro'>('sucesso');
  const [filtroStatus, setFiltroStatus] = useState<TicketStatus | null>(null);
  const [confirmacaoPendente, setConfirmacaoPendente] = useState<{
    tipo: 'pacientes' | 'dentistas';
    id: number;
    nome: string;
  } | null>(null);

  const [statsAdmin, setStatsAdmin] = useState({
    total_beneficiarios: 0,
    total_dentistas: 0,
    por_cidade: {} as Record<string, number>,
    ultimos_agendamentos: [] as AgendamentoAdmin[],
    coordenadas: {} as Record<string, [number, number]>,
  });

  useEffect(() => {
    apiFetch('/admin/estatisticas')
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setStatsAdmin({
        total_beneficiarios: data.total_beneficiarios || 0,
        total_dentistas: data.total_dentistas || 0,
        por_cidade: data.por_cidade || {},
        ultimos_agendamentos: data.ultimos_agendamentos || [],
        coordenadas: data.coordenadas || {},
      }))
      .catch(() => setStatsAdmin({ total_beneficiarios: 0, total_dentistas: 0, por_cidade: {}, ultimos_agendamentos: [], coordenadas: {} }));
  }, []);

  const fetchTodos = () =>
    Promise.all([
      apiFetch('/pacientes')
        .then(r => r.json())
        .then((d: unknown) => {
          const arr = Array.isArray(d)
            ? d
            : d && typeof d === 'object'
              ? (Object.values(d as Record<string, unknown>).find(Array.isArray) ?? [])
              : [];
          console.log('[ADMIN] /pacientes raw shape:', typeof d, Array.isArray(d) ? 'array' : JSON.stringify(d).slice(0, 120), '→ arr.length:', (arr as unknown[]).length);
          return arr as UsuarioPaciente[];
        })
        .catch((): UsuarioPaciente[] => []),
      apiFetch('/dentistas').then(r => r.json()).catch((): UsuarioDentista[] => []),
    ]);

  useEffect(() => {
    let live = true;
    fetchTodos().then(([pacs, dents]) => {
      if (!live) return;
      setPacientes(pacs);
      if (Array.isArray(dents)) setDentistas(dents);
    });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (telaAtiva !== 'pacientes' && telaAtiva !== 'medicos') return;
    let live = true;
    fetchTodos().then(([pacs, dents]) => {
      if (!live) return;
      setPacientes(pacs);
      if (Array.isArray(dents)) setDentistas(dents);
      setCarregandoUsuarios(false);
    });
    return () => { live = false; };
  }, [telaAtiva]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchTodos().then(([pacs, dents]) => {
        setPacientes(pacs);
        if (Array.isArray(dents)) setDentistas(dents);
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const deletarUsuario = (tipo: 'pacientes' | 'dentistas', id: number, nome: string) => {
    setConfirmacaoPendente({ tipo, id, nome });
  };

  const handleConfirmarInativacao = async () => {
    if (!confirmacaoPendente) return;
    const { tipo, id, nome } = confirmacaoPendente;
    setConfirmacaoPendente(null);
    try {
      const res = await apiFetch(`/${tipo}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setTipoMensagemAdmin('erro');
        setMensagemAdmin(`Erro ao inativar "${nome}": ${(err as { erro?: string }).erro ?? `HTTP ${res.status}`}`);
      } else {
        if (tipo === 'pacientes') setPacientes(prev => prev.filter(p => p.id !== id));
        else setDentistas(prev => prev.filter(d => d.id !== id));
        setTipoMensagemAdmin('sucesso');
        setMensagemAdmin(`Conta de ${nome} inativada com sucesso.`);
      }
    } catch {
      setTipoMensagemAdmin('erro');
      setMensagemAdmin(`Erro de conexão ao tentar inativar "${nome}".`);
    }
    setTimeout(() => setMensagemAdmin(''), 4000);
  };

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const consultasRealizadas = Math.round(statsAdmin.total_beneficiarios * 2.3 + 120);
  const regioesCovertas = Math.max(8, Math.ceil(statsAdmin.total_beneficiarios / 10));

  const allCoords = useMemo(
    () => ({ ...LATAM_COORDINATES, ...statsAdmin.coordenadas }),
    [statsAdmin.coordenadas]
  );

  const porCidadeNormalizado = useMemo(() => {
    const map: Record<string, number> = {};
    const cidades = [...pacientes.map(p => p.cidade), ...dentistas.map(d => d.cidade)];
    for (const cidade of cidades) {
      if (!cidade) continue;
      const canonical = normalizarCidade(cidade);
      if (allCoords[canonical]) map[canonical] = (map[canonical] ?? 0) + 1;
    }
    return map;
  }, [pacientes, dentistas, allCoords]);

  const maxQtdCidade = Math.max(1, ...Object.values(porCidadeNormalizado).map(Number));
  const heatPoints: [number, number, number][] = Object.entries(porCidadeNormalizado)
    .map(([cidade, qtd]) => {
      const [lat, lng] = allCoords[cidade];
      return [lat, lng, qtd / maxQtdCidade] as [number, number, number];
    });

  const contagemStatus = useMemo<Partial<Record<TicketStatus, number>>>(() => {
    const map: Partial<Record<TicketStatus, number>> = {};
    for (const p of pacientes) {
      if (p.statusTicket) map[p.statusTicket] = (map[p.statusTicket] ?? 0) + 1;
    }
    return map;
  }, [pacientes]);

  const pacientesFiltrados = pacientes.filter(p =>
    ((p.nomePaciente || p.nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(filtroBusca.toLowerCase())) &&
    (filtroStatus === null || p.statusTicket === filtroStatus)
  );

  const dentistasFiltrados = dentistas.filter(d =>
    (d.nomeDentista || d.nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
    (d.email || '').toLowerCase().includes(filtroBusca.toLowerCase())
  );

  useEffect(() => {
    const filtrados = pacientes.filter(p => filtroStatus === null || p.statusTicket === filtroStatus);
    console.log('[ADMIN] pacientes recebidos:', pacientes.length, 'filtrados:', filtrados.length, 'filtro:', filtroStatus);
  }, [pacientes, filtroStatus]);

  const navItems = [
    { id: 'painel' as const,    icon: <LayoutDashboard size={18} />, label: 'Visão Geral',     badge: 0 },
    { id: 'pacientes' as const, icon: <Users size={18} />,           label: 'Pacientes',       badge: pacientes.length },
    { id: 'medicos' as const,   icon: <Stethoscope size={18} />,     label: 'Médicos',         badge: dentistas.length },
    { id: 'consultas' as const, icon: <Video size={18} />,           label: 'Consultas',       badge: statsAdmin.ultimos_agendamentos.length },
    { id: 'mapa' as const,      icon: <MapPin size={18} />,          label: 'Mapa de Regiões', badge: 0 },
    { id: 'metricas' as const,  icon: <Database size={18} />,        label: 'Métricas',        badge: 0 },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
      <title>Painel Admin · OrbitalCare</title>

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
              onClick={() => {
                setTelaAtiva(item.id);
                setSidebarOpen(false);
                if (item.id === 'pacientes' || item.id === 'medicos') setCarregandoUsuarios(true);
              }}
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
              <p className="text-slate-500 text-[11px]">Administrador</p>
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {mensagemAdmin && (
            <div className={`mb-5 px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border ${
              tipoMensagemAdmin === 'sucesso'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {tipoMensagemAdmin === 'sucesso' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {mensagemAdmin}
            </div>
          )}

          {/* ── Visão Geral ── */}
          {telaAtiva === 'painel' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Painel Administrativo</h2>
                <p className="text-slate-400 text-sm mt-0.5">Visão geral da operação global OrbitalCare.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {([
                  { label: 'Total de Pacientes',    value: statsAdmin.total_beneficiarios, icon: <Users size={20} />,       accent: 'border-l-sky-500' },
                  { label: 'Médicos Ativos',         value: statsAdmin.total_dentistas,    icon: <Stethoscope size={20} />, accent: 'border-l-emerald-500' },
                  { label: 'Consultas Realizadas',   value: consultasRealizadas,           icon: <Video size={20} />,       accent: 'border-l-sky-500' },
                  { label: 'Regiões Cobertas',       value: regioesCovertas,               icon: <MapPin size={20} />,      accent: 'border-l-emerald-500' },
                ] as const).map(card => (
                  <div key={card.label} className={`bg-slate-900 border border-slate-800 border-l-4 ${card.accent} rounded-xl p-5`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-400 text-sm mb-2">{card.label}</p>
                        <p className="text-3xl font-black text-white">{card.value}</p>
                      </div>
                      <div className="text-slate-600 mt-1">{card.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <CalendarDays size={17} className="text-sky-500" /> Agenda da Rede
                  </h3>
                  <BotoesExportar
                    onPDF={() => exportarAtendimentosPDF(statsAdmin.ultimos_agendamentos)}
                    onCSV={() => exportarAtendimentosCSV(statsAdmin.ultimos_agendamentos)}
                  />
                </div>
                <div className="divide-y divide-slate-800">
                  {statsAdmin.ultimos_agendamentos.length === 0 ? (
                    <div className="p-6">
                      <EmptyState icon={CalendarDays} title="Sem teleconsultas previstas" description="Os próximos agendamentos da rede aparecerão aqui." />
                    </div>
                  ) : statsAdmin.ultimos_agendamentos.map((ag, idx) => (
                    <div key={idx} className={`px-5 py-4 flex items-start justify-between gap-4 transition-colors hover:bg-slate-800/50 ${idx % 2 === 1 ? 'bg-slate-800/30' : ''}`}>
                      <div>
                        <p className="font-semibold text-white text-sm">{ag.paciente}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{ag.proc} — Dr(a). <span className="text-slate-300">{ag.dentista}</span></p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs text-slate-500 flex items-center gap-1"><CalendarDays size={11} /> {ag.data}</span>
                          <span className="text-xs text-sky-500 flex items-center gap-1"><Clock size={11} /> {ag.hora}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} /> {ag.cidade}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex-shrink-0 border ${
                        ag.prioridade === 'Urgente' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        ag.prioridade === 'Alta' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>{ag.prioridade}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Pacientes ── */}
          {telaAtiva === 'pacientes' && (
            <div className="animate-fade-in space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Pacientes</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Visualize e gerencie contas de pacientes.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <BotoesExportar onPDF={() => exportarPacientesPDF(pacientesFiltrados)} onCSV={() => exportarPacientesCSV(pacientesFiltrados)} />
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input type="text" placeholder="Buscar paciente..." value={filtroBusca}
                      onChange={e => setFiltroBusca(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 w-full md:w-[220px] focus:ring-1 focus:ring-sky-500/40 focus:border-sky-500 outline-none" />
                  </div>
                </div>
              </div>

              {Object.keys(contagemStatus).length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                  <FiltroStatus contagem={contagemStatus} valor={filtroStatus} onChange={setFiltroStatus} />
                </div>
              )}

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {carregandoUsuarios ? (
                  <div className="p-6 space-y-3"><Skeleton variant="card" /><Skeleton variant="card" /></div>
                ) : pacientesFiltrados.length === 0 ? (
                  <div className="p-6"><EmptyState icon={UserX} title="Nenhum paciente encontrado" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Cidade</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Urgência</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Especialidade</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Status Ticket</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pacientesFiltrados.map((p, i) => (
                          <tr key={p.id} className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/60 ${i % 2 === 1 ? 'bg-slate-800/30' : ''}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {(p.nomePaciente || p.nome || '?').charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-white text-sm truncate max-w-[130px]">{p.nomePaciente || p.nome}</p>
                                  <p className="text-xs text-slate-500 truncate max-w-[130px]">{p.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-sm hidden sm:table-cell">{p.cidade}</td>
                            <td className="px-4 py-3"><UrgenciaBadge tipoDor={p.tipoDor} /></td>
                            <td className="px-4 py-3 text-slate-400 text-sm hidden md:table-cell">{p.tipoDor || '—'}</td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              {p.statusTicket ? <TicketBadge status={p.statusTicket} size="sm" /> : <span className="text-slate-600 text-xs">—</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => deletarUsuario('pacientes', p.id, p.nomePaciente || p.nome || '')}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Inativar conta">
                                <Archive size={15} />
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
          )}

          {/* ── Médicos ── */}
          {telaAtiva === 'medicos' && (
            <div className="animate-fade-in space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Médicos</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Gerencie os médicos cadastrados na plataforma.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <BotoesExportar onPDF={() => exportarDentistasPDF(dentistasFiltrados)} onCSV={() => exportarDentistasCSV(dentistasFiltrados)} />
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input type="text" placeholder="Buscar médico..." value={filtroBusca}
                      onChange={e => setFiltroBusca(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 w-full md:w-[220px] focus:ring-1 focus:ring-sky-500/40 focus:border-sky-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {carregandoUsuarios ? (
                  <div className="p-6 space-y-3"><Skeleton variant="card" /><Skeleton variant="card" /></div>
                ) : dentistasFiltrados.length === 0 ? (
                  <div className="p-6"><EmptyState icon={UserX} title="Nenhum médico encontrado" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">CRM</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Cidade</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Especialidade</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Pacientes/mês</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dentistasFiltrados.map((d, i) => (
                          <tr key={d.id} className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/60 ${i % 2 === 1 ? 'bg-slate-800/30' : ''}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {(d.nomeDentista || d.nome || '?').charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-white text-sm truncate max-w-[130px]">{d.nomeDentista || d.nome}</p>
                                  <p className="text-xs text-slate-500 truncate max-w-[130px]">{d.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-sm hidden sm:table-cell">{d.cro || '—'}</td>
                            <td className="px-4 py-3 text-slate-400 text-sm hidden md:table-cell">{d.cidade}</td>
                            <td className="px-4 py-3 text-slate-600 text-sm hidden lg:table-cell">—</td>
                            <td className="px-4 py-3 text-slate-600 text-sm hidden lg:table-cell">—</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Ativo
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => deletarUsuario('dentistas', d.id, d.nomeDentista || d.nome || '')}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Inativar conta">
                                <Archive size={15} />
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
          )}

          {/* ── Consultas ── */}
          {telaAtiva === 'consultas' && (
            <div className="animate-fade-in space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Consultas</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Últimos agendamentos da rede OrbitalCare.</p>
                </div>
                <BotoesExportar
                  onPDF={() => exportarAtendimentosPDF(statsAdmin.ultimos_agendamentos)}
                  onCSV={() => exportarAtendimentosCSV(statsAdmin.ultimos_agendamentos)}
                />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {statsAdmin.ultimos_agendamentos.length === 0 ? (
                  <div className="p-6">
                    <EmptyState icon={CalendarDays} title="Sem consultas registradas" description="Os agendamentos aparecerão aqui quando disponíveis." />
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {statsAdmin.ultimos_agendamentos.map((ag, idx) => (
                      <div key={idx} className={`px-5 py-4 flex items-start justify-between gap-4 transition-colors hover:bg-slate-800/50 ${idx % 2 === 1 ? 'bg-slate-800/30' : ''}`}>
                        <div>
                          <p className="font-semibold text-white text-sm">{ag.paciente}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{ag.proc} — Dr(a). <span className="text-slate-300">{ag.dentista}</span></p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-xs text-slate-500 flex items-center gap-1"><CalendarDays size={11} /> {ag.data}</span>
                            <span className="text-xs text-sky-500 flex items-center gap-1"><Clock size={11} /> {ag.hora}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} /> {ag.cidade}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex-shrink-0 border ${
                          ag.prioridade === 'Urgente' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          ag.prioridade === 'Alta' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>{ag.prioridade}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Mapa ── */}
          {telaAtiva === 'mapa' && (
            <div className="animate-fade-in space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Mapa de Regiões</h2>
                <p className="text-slate-400 text-sm mt-0.5">Concentração de pacientes por cidade — demanda em tempo real.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="relative" style={{ height: '480px' }}>
                  <MapContainer
                    center={[-15.0, -60.0]}
                    zoom={3}
                    style={{ width: '100%', height: '100%' }}
                    scrollWheelZoom={false}
                    zoomControl
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      subdomains="abcd"
                      maxZoom={19}
                    />
                    {heatPoints.length > 0 && <HeatmapLayer points={heatPoints} />}
                    <CityMarkers porCidade={porCidadeNormalizado} coordsMap={allCoords} />
                  </MapContainer>
                  <div className="absolute bottom-3 left-3 z-[1000] bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 pointer-events-none">
                    <div className="w-24 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #0369a1, #0ea5e9, #f97316, #dc2626)' }} />
                    <span className="text-white text-[10px] font-bold whitespace-nowrap">Baixa → Alta demanda</span>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-slate-800">
                  <p className="text-xs text-slate-500 text-center">Passe o mouse sobre os pontos para ver detalhes de cada cidade.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Métricas ── */}
          {telaAtiva === 'metricas' && <MetricasOperacionais />}

        </main>
      </div>

      {/* ── Modal de confirmação de inativação ── */}
      {confirmacaoPendente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setConfirmacaoPendente(null)}>
          <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-amber-500/10 p-3 rounded-xl shrink-0">
                <Archive size={24} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Inativar Conta</h3>
                <p className="text-sm text-slate-400 truncate max-w-xs">{confirmacaoPendente.nome}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              Deseja inativar este usuário? Ele perderá acesso à plataforma mas seus dados serão preservados.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmacaoPendente(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-400 font-bold text-sm hover:bg-slate-800 transition-colors">
                Voltar
              </button>
              <button onClick={handleConfirmarInativacao}
                className="flex-1 px-4 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors">
                Inativar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
