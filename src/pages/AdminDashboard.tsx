import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../utils/api';
import { LayoutDashboard, Users, LogOut, MapPin, Heart, CalendarDays, Clock, TrendingUp, Smile, DollarSign, Archive, AlertTriangle, CheckCircle2, Search, UserX, FileDown, Sheet, Database } from 'lucide-react';
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

// ─── Componentes internos do mapa de calor (Leaflet) ───────────────────────
// Definidos fora do componente principal para não serem recriados a cada render.

/**
 * Camada de calor (heatmap) renderizada sobre o mapa Leaflet.
 * Recebe `points` como [lat, lng, intensidade] — intensidade normalizada 0–1.
 * O hook useMap() só funciona dentro de um filho de <MapContainer>.
 */
function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, {
      radius: 38,
      blur: 28,
      maxZoom: 10,
      max: 1.0,
      gradient: { 0.0: '#312e81', 0.25: '#4338ca', 0.5: '#8b5cf6', 0.75: '#f97316', 1.0: '#dc2626' }
    }).addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, points]);
  return null;
}

/**
 * Marcadores circulares por cidade com tooltip de contagem.
 * O raio e a cor do círculo são proporcionais à concentração de usuários:
 *   vermelho (#dc2626) = >70% do máximo | laranja = 40–70% | roxo = <40%
 */
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
          const color = ratio > 0.7 ? '#dc2626' : ratio > 0.4 ? '#f97316' : '#8b5cf6';
          return (
            <CircleMarker
              key={cidade}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 0.85 }}
            >
              <Tooltip direction="top" offset={[0, -4]}>
                <span style={{ fontWeight: 700 }}>{cidade}</span>: {Number(qtd)} paciente{Number(qtd) !== 1 ? 's' : ''}
              </Tooltip>
            </CircleMarker>
          );
        })}
    </>
  );
}

// ------------------------------------------------------------

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

function BotoesExportar({ onPDF, onCSV }: { onPDF: () => void; onCSV: () => void }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onPDF}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
      >
        <FileDown size={13} /> PDF
      </button>
      <button
        onClick={onCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
      >
        <Sheet size={13} /> CSV
      </button>
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Admin";

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'usuarios' | 'metricas'>('painel');
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

  // Carrega estatísticas globais (auth centralizada em ProtectedRoute)
  useEffect(() => {
    apiFetch('/admin/estatisticas')
      .then(res => {
        if (!res.ok) throw new Error("Erro 500 do servidor");
        return res.json();
      })
      .then(data => {
        setStatsAdmin({
          total_beneficiarios: data.total_beneficiarios || 0,
          total_dentistas: data.total_dentistas || 0,
          por_cidade: data.por_cidade || {},
          ultimos_agendamentos: data.ultimos_agendamentos || [],
          coordenadas: data.coordenadas || {},
        });
      })
      .catch(() => {
        setStatsAdmin({
          total_beneficiarios: 0,
          total_dentistas: 0,
          por_cidade: {},
          ultimos_agendamentos: [],
          coordenadas: {},
        });
      });
  }, []);

  /**
   * Busca pacientes e dentistas em paralelo — sem setState, só retorna a Promise.
   * Centralizado aqui para ser reutilizado nos 3 useEffects abaixo sem duplicar URLs.
   */
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

  // 1. Mount: alimenta o mapa de calor com dados iniciais.
  //    O flag `live` evita setState em componente desmontado (memory leak / warning do React).
  useEffect(() => {
    let live = true;
    fetchTodos().then(([pacs, dents]) => {
      if (!live) return;
      setPacientes(pacs);
      if (Array.isArray(dents)) setDentistas(dents);
    });
    return () => { live = false; };
  }, []);

  // 2. Ao abrir a aba "Usuários": recarrega para exibir dados atualizados.
  //    setCarregandoUsuarios(true) é chamado no onClick do botão de navegação,
  //    antes da mudança de telaAtiva, para mostrar o spinner imediatamente.
  useEffect(() => {
    if (telaAtiva !== 'usuarios') return;
    let live = true;
    fetchTodos().then(([pacs, dents]) => {
      if (!live) return;
      setPacientes(pacs);
      if (Array.isArray(dents)) setDentistas(dents);
      setCarregandoUsuarios(false);
    });
    return () => { live = false; };
  }, [telaAtiva]);

  // 3. Refresh automático a cada 30s — mantém o mapa de calor atualizado
  //    sem exigir reload da página. clearInterval no cleanup evita múltiplos timers.
  useEffect(() => {
    const id = setInterval(() => {
      fetchTodos().then(([pacs, dents]) => {
        setPacientes(pacs);
        if (Array.isArray(dents)) setDentistas(dents);
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  // Abre o modal de confirmação — o fetch só acontece em handleConfirmarInativacao.
  const deletarUsuario = (tipo: 'pacientes' | 'dentistas', id: number, nome: string) => {
    setConfirmacaoPendente({ tipo, id, nome });
  };

  // Chamada HTTP idêntica à anterior (DELETE) — apenas renomeada e movida para cá.
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

  // KPIs estimados para o painel do admin — baseados no total de beneficiários cadastrados.
  // Fórmulas definidas pela equipe de negócio (Sprint 1):
  //   sorrisos = (beneficiários × 2) + 1450  → cada paciente impacta ~2 pessoas na família + base histórica
  //   horas    = sorrisos × 1.5              → média de 1h30 por atendimento
  //   economia = sorrisos × R$ 250           → custo médio evitado por consulta particular
  const sorrisosTransformados = (statsAdmin.total_beneficiarios * 2) + 1450;
  const horasDoadas = Math.round(sorrisosTransformados * 1.5);
  const economiaGerada = (sorrisosTransformados * 250).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Agrupa pacientes + dentistas por cidade para alimentar o mapa de calor.
  // useMemo garante que o agrupamento só recomputa quando os arrays mudam
  // (ex: após deletarUsuario), não em todo render.
  const allCoords = useMemo(
    () => ({ ...LATAM_COORDINATES, ...statsAdmin.coordenadas }),
    [statsAdmin.coordenadas]
  );

  const porCidadeNormalizado = useMemo(() => {
    const map: Record<string, number> = {};
    const cidades = [
      ...pacientes.map(p => p.cidade),
      ...dentistas.map(d => d.cidade),
    ];
    for (const cidade of cidades) {
      if (!cidade) continue;
      const canonical = normalizarCidade(cidade);
      if (allCoords[canonical]) {
        map[canonical] = (map[canonical] ?? 0) + 1;
      }
    }
    return map;
  }, [pacientes, dentistas, allCoords]);

  const maxQtdCidade = Math.max(1, ...Object.values(porCidadeNormalizado).map(Number));
  const heatPoints: [number, number, number][] = Object.entries(porCidadeNormalizado)
    .map(([cidade, qtd]) => {
      const [lat, lng] = allCoords[cidade];
      return [lat, lng, qtd / maxQtdCidade] as [number, number, number];
    });

  const navItems = [
    { id: 'painel',   icon: <LayoutDashboard size={20} />, label: 'Visão Geral', badge: 0 },
    { id: 'usuarios', icon: <Users size={20} />,           label: 'Usuários',    badge: pacientes.length + dentistas.length },
    { id: 'metricas', icon: <Database size={20} />,        label: 'Métricas',    badge: 0 },
  ] as const;

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
    const filtrados = pacientes.filter(p =>
      (filtroStatus === null || p.statusTicket === filtroStatus)
    );
    console.log('[ADMIN] pacientes recebidos:', pacientes.length, 'filtrados:', filtrados.length, 'filtro:', filtroStatus);
  }, [pacientes, filtroStatus]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-16 md:pb-0 transition-colors duration-300">
      <title>Painel Admin · Turma do Bem</title>

      {/* ── Top navigation bar ── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">

          {/* User info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl text-white flex items-center justify-center font-black text-base shadow-sm">
              {usuarioLogado.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none truncate max-w-[140px]">{usuarioLogado}</p>
              <p className="text-xs text-orange-500 font-semibold mt-0.5">Administrador</p>
            </div>
            <DemoBadge />
          </div>

          {/* Tab navigation — desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mx-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setTelaAtiva(item.id); if (item.id === 'usuarios') setCarregandoUsuarios(true); }}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  telaAtiva === item.id
                    ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-600/60'
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                    {item.badge > 99 ? '99' : item.badge}
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

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full animate-fade-in">

        {mensagemAdmin && (
          <div className={`mb-6 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 ${
            tipoMensagemAdmin === 'sucesso'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {tipoMensagemAdmin === 'sucesso'
              ? <CheckCircle2 size={16} />
              : <AlertTriangle size={16} />}
            {mensagemAdmin}
          </div>
        )}

        {telaAtiva === 'usuarios' && (
          <div className="animate-fade-in">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciar Usuários</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Visualize e remova contas de pacientes e dentistas.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar por nome ou e-mail..." value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 w-full md:w-[280px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
              </div>
            </div>

            {carregandoUsuarios ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton variant="card" className="h-64" />
                <Skeleton variant="card" className="h-64" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pacientes */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Users size={18} className="text-[#8dc63f]" /> Pacientes ({pacientesFiltrados.length})</h3>
                    <BotoesExportar
                      onPDF={() => exportarPacientesPDF(pacientesFiltrados)}
                      onCSV={() => exportarPacientesCSV(pacientesFiltrados)}
                    />
                  </div>
                  {Object.keys(contagemStatus).length > 0 && (
                    <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700">
                      <FiltroStatus
                        contagem={contagemStatus}
                        valor={filtroStatus}
                        onChange={setFiltroStatus}
                      />
                    </div>
                  )}
                  <div className="divide-y divide-gray-50 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
                    {pacientesFiltrados.length === 0 ? (
                      <EmptyState icon={UserX} title="Nenhum paciente encontrado" />
                    ) : pacientesFiltrados.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF8C00] flex items-center justify-center font-bold text-sm shrink-0">
                            {(p.nomePaciente || p.nome || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{p.nomePaciente || p.nome}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{p.email}</p>
                            <p className="text-[11px] text-gray-400 dark:text-slate-500">{p.cidade}, {p.pais}</p>
                            {p.statusTicket && <span className="mt-1 inline-block"><TicketBadge status={p.statusTicket} size="sm" /></span>}
                          </div>
                        </div>
                        <button onClick={() => deletarUsuario('pacientes', p.id, p.nomePaciente || p.nome || '')}
                          className="ml-3 shrink-0 p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          title="Inativar conta">
                          <Archive size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dentistas */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Heart size={18} className="text-[#FF8C00]" /> Dentistas ({dentistasFiltrados.length})</h3>
                    <BotoesExportar
                      onPDF={() => exportarDentistasPDF(dentistasFiltrados)}
                      onCSV={() => exportarDentistasCSV(dentistasFiltrados)}
                    />
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
                    {dentistasFiltrados.length === 0 ? (
                      <EmptyState icon={UserX} title="Nenhum dentista encontrado" />
                    ) : dentistasFiltrados.map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF8C00] flex items-center justify-center font-bold text-sm shrink-0">
                            {(d.nomeDentista || d.nome || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{d.nomeDentista || d.nome}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{d.email}</p>
                            {d.cro && <p className="text-[11px] text-gray-400 dark:text-slate-500">CRO: {d.cro}</p>}
                          </div>
                        </div>
                        <button onClick={() => deletarUsuario('dentistas', d.id, d.nomeDentista || d.nome || '')}
                          className="ml-3 shrink-0 p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          title="Inativar conta">
                          <Archive size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'metricas' && <MetricasOperacionais />}

        {telaAtiva === 'painel' && <>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Painel Administrativo</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Visão geral da operação global da Turma do Bem.</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><TrendingUp size={22} className="text-[#FF8C00]"/> Relatório de Impacto (2026)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#FF8C00] to-orange-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden group">
              <Smile className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-orange-100 font-bold text-sm uppercase tracking-wider mb-1">Sorrisos Transformados</p>
              <h4 className="text-4xl font-black">{sorrisosTransformados}</h4>
              <p className="text-xs text-orange-200 mt-2">+12% este mês</p>
            </div>
            <div className="bg-gradient-to-br from-[#8dc63f] to-green-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden group">
              <Clock className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-green-100 font-bold text-sm uppercase tracking-wider mb-1">Horas Clínicas Doadas</p>
              <h4 className="text-4xl font-black">{horasDoadas}h</h4>
              <p className="text-xs text-green-200 mt-2">Pelos Dentistas Voluntários</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <DollarSign className="absolute -right-4 -bottom-4 text-gray-100 dark:text-slate-700 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-gray-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Economia Social Gerada</p>
              <h4 className="text-3xl font-black text-[#FF8C00]">{economiaGerada}</h4>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Valor poupado pelas famílias</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-slate-400 text-sm font-bold mb-1 uppercase tracking-widest">Jovens na Fila</h3>
              <p className="text-5xl font-black text-gray-800 dark:text-white">{statsAdmin.total_beneficiarios}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"><Users size={40} className="text-[#8dc63f]"/></div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-slate-400 text-sm font-bold mb-1 uppercase tracking-widest">Dentistas Voluntários</h3>
              <p className="text-5xl font-black text-gray-800 dark:text-white">{statsAdmin.total_dentistas}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"><Heart size={40} className="text-[#FF8C00]"/></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-slate-700 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><MapPin size={24} className="text-[#FF8C00]"/> Mapa de Calor (Demandas)</h3>
            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-600 relative" style={{ minHeight: '380px' }}>
              <MapContainer
                center={[-15.0, -60.0]}
                zoom={3}
                style={{ width: '100%', height: '100%', minHeight: '380px' }}
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
              {/* Legenda do mapa */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 pointer-events-none">
                <div className="w-24 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #4338ca, #8b5cf6, #f97316, #dc2626)' }} />
                <span className="text-white text-[10px] font-bold whitespace-nowrap">Baixa → Alta demanda</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-4 text-center font-medium">Zonas quentes indicam maior concentração de jovens na fila. Passe o mouse sobre os pontos para ver detalhes.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-slate-700 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2"><CalendarDays size={24} className="text-[#8dc63f]"/> Agenda da Rede</h3>
              <BotoesExportar
                onPDF={() => exportarAtendimentosPDF(statsAdmin.ultimos_agendamentos)}
                onCSV={() => exportarAtendimentosCSV(statsAdmin.ultimos_agendamentos)}
              />
            </div>
            <div className="space-y-4">
              {statsAdmin.ultimos_agendamentos && statsAdmin.ultimos_agendamentos.map((ag: AgendamentoAdmin, index: number) => (
                <div key={index} className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 dark:bg-slate-700/50 shadow-sm hover:border-orange-200 dark:hover:border-orange-700/60 transition-colors flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-800 dark:text-white text-lg">{ag.paciente}</p>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-md ${ag.prioridade === 'Urgente' ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400' : ag.prioridade === 'Alta' ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400' : 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400'}`}>{ag.prioridade}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{ag.proc} com <strong className="text-gray-700 dark:text-slate-200">{ag.dentista}</strong></p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300 flex items-center gap-1 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14}/> {ag.data}</span>
                    <span className="text-xs font-bold text-[#FF8C00] flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1.5 rounded-lg"><Clock size={14}/> {ag.hora}</span>
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300 flex items-center gap-1 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><MapPin size={14}/> {ag.cidade}</span>
                  </div>
                </div>
              ))}
              {(!statsAdmin.ultimos_agendamentos || statsAdmin.ultimos_agendamentos.length === 0) && (
                <EmptyState
                  icon={CalendarDays}
                  title="Sem atendimentos previstos"
                  description="Os próximos agendamentos da rede aparecerão aqui."
                />
              )}
            </div>
          </div>
        </div>
        </>}
      </main>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setTelaAtiva(item.id); if (item.id === 'usuarios') setCarregandoUsuarios(true); }}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-colors ${
                telaAtiva === item.id ? 'text-orange-500' : 'text-slate-400'
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold leading-none">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Modal de confirmação de inativação ── */}
      {confirmacaoPendente && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setConfirmacaoPendente(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-amber-50 p-3 rounded-xl shrink-0">
                <Archive size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Inativar Conta</h3>
                <p className="text-sm text-gray-500 truncate max-w-xs">{confirmacaoPendente.nome}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Deseja inativar este usuário? Ele perderá acesso à plataforma mas seus dados serão preservados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmacaoPendente(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-gray-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmarInativacao}
                className="flex-1 px-4 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-colors"
              >
                Inativar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}