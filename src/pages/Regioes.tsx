import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Satellite, MapPin, Signal, Users, Activity, TrendingUp } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface Regiao {
  id: number;
  nome: string;
  estado: string;
  lat: number;
  lng: number;
  pacientes: number;
  medicos: number;
  consultas: number;
  cobertura: 'LEO' | 'GEO' | 'PARCIAL';
  ativa: boolean;
}

const regioes: Regiao[] = [
  { id: 1,  nome: 'Altamira',       estado: 'PA', lat: -3.2039,  lng: -52.2097, pacientes: 820,  medicos: 12, consultas: 340, cobertura: 'LEO',    ativa: true  },
  { id: 2,  nome: 'São Gabriel',    estado: 'AM', lat: -0.1303,  lng: -67.0876, pacientes: 650,  medicos: 8,  consultas: 210, cobertura: 'GEO',    ativa: true  },
  { id: 3,  nome: 'Porto Velho',    estado: 'RO', lat: -8.7612,  lng: -63.9039, pacientes: 540,  medicos: 9,  consultas: 190, cobertura: 'LEO',    ativa: true  },
  { id: 4,  nome: 'Boa Vista',      estado: 'RR', lat: 2.8235,   lng: -60.6758, pacientes: 430,  medicos: 7,  consultas: 155, cobertura: 'GEO',    ativa: true  },
  { id: 5,  nome: 'Marabá',         estado: 'PA', lat: -5.3686,  lng: -49.1178, pacientes: 380,  medicos: 6,  consultas: 130, cobertura: 'LEO',    ativa: true  },
  { id: 6,  nome: 'Boca do Acre',   estado: 'AM', lat: -8.7514,  lng: -67.3889, pacientes: 290,  medicos: 4,  consultas: 95,  cobertura: 'PARCIAL', ativa: true  },
  { id: 7,  nome: 'Tabatinga',      estado: 'AM', lat: -4.2556,  lng: -69.9381, pacientes: 260,  medicos: 4,  consultas: 88,  cobertura: 'GEO',    ativa: true  },
  { id: 8,  nome: 'Cruzeiro do Sul', estado: 'AC', lat: -7.6268, lng: -72.6737, pacientes: 220,  medicos: 3,  consultas: 74,  cobertura: 'LEO',    ativa: true  },
  { id: 9,  nome: 'Novo Progresso', estado: 'PA', lat: -7.1528,  lng: -55.3803, pacientes: 195,  medicos: 3,  consultas: 65,  cobertura: 'PARCIAL', ativa: true  },
  { id: 10, nome: 'Eirunepé',       estado: 'AM', lat: -6.6609,  lng: -69.8699, pacientes: 170,  medicos: 2,  consultas: 58,  cobertura: 'GEO',    ativa: false },
];

const coberturaConfig = {
  LEO:     { cor: '#0EA5E9', label: 'LEO (Baixa Latência)',   desc: 'Satélite de órbita baixa' },
  GEO:     { cor: '#8B5CF6', label: 'GEO (Alta Cobertura)',  desc: 'Satélite geoestacionário'   },
  PARCIAL: { cor: '#F59E0B', label: 'Cobertura Parcial',      desc: 'Implantação em andamento'  },
};

export function Regioes() {
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<Regiao | null>(null);
  const [filtroCobertura, setFiltroCobertura] = useState<string>('TODAS');

  const regioesFiltradas = filtroCobertura === 'TODAS'
    ? regioes
    : regioes.filter(r => r.cobertura === filtroCobertura);

  const totalPacientes = regioes.reduce((s, r) => s + r.pacientes, 0);
  const totalMedicos   = regioes.reduce((s, r) => s + r.medicos, 0);
  const totalConsultas = regioes.reduce((s, r) => s + r.consultas, 0);
  const ativas         = regioes.filter(r => r.ativa).length;

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay },
  });

  // Fix leaflet default icon para ambientes Vite
  useEffect(() => {
    // Sem ação necessária: usamos CircleMarker que não depende de arquivos de ícone
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#050B18] via-[#0A1628] to-slate-900 pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#0EA5E9]/20 text-[#0EA5E9] text-sm font-bold px-4 py-2 rounded-full mb-6 border border-[#0EA5E9]/20"
          >
            <Satellite size={15} /> Cobertura Satelital
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Regiões Atendidas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Painel de cobertura satelital do OrbitalCare — regiões remotas do Brasil com acesso ativo à telemedicina.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">

        {/* ── Métricas ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <MapPin size={22} />,    label: 'Regiões ativas',    value: ativas,         cor: 'sky'    },
            { icon: <Users size={22} />,     label: 'Pacientes cadastrados', value: totalPacientes, cor: 'violet' },
            { icon: <Activity size={22} />,  label: 'Consultas realizadas',  value: totalConsultas, cor: 'green'  },
            { icon: <Signal size={22} />,    label: 'Médicos voluntários',   value: totalMedicos,   cor: 'amber'  },
          ].map((m, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.08)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-3"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                m.cor === 'sky'    ? 'bg-sky-50 text-sky-500' :
                m.cor === 'violet' ? 'bg-violet-50 text-violet-500' :
                m.cor === 'green'  ? 'bg-green-50 text-green-500' :
                                     'bg-amber-50 text-amber-500'
              }`}>
                {m.icon}
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{m.value.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{m.label}</p>
            </motion.div>
          ))}
        </section>

        {/* ── Mapa ── */}
        <section>
          <motion.div {...fadeUp()} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-black text-sky-500 uppercase tracking-widest block mb-1">Visualização</span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Mapa de Cobertura</h2>
            </div>

            {/* Filtro */}
            <div className="flex flex-wrap gap-2">
              {['TODAS', 'LEO', 'GEO', 'PARCIAL'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroCobertura(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    filtroCobertura === f
                      ? 'bg-[#0EA5E9] text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f === 'TODAS' ? 'Todas' : coberturaConfig[f as keyof typeof coberturaConfig].label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg"
            style={{ height: '480px' }}
          >
            <MapContainer
              center={[-8, -55]}
              zoom={4}
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {regioesFiltradas.map((regiao) => (
                <CircleMarker
                  key={regiao.id}
                  center={[regiao.lat, regiao.lng]}
                  radius={Math.max(8, Math.sqrt(regiao.pacientes) * 0.4)}
                  pathOptions={{
                    color: coberturaConfig[regiao.cobertura].cor,
                    fillColor: coberturaConfig[regiao.cobertura].cor,
                    fillOpacity: regiao.ativa ? 0.75 : 0.3,
                    weight: 2,
                  }}
                  eventHandlers={{ click: () => setRegiaoSelecionada(regiao) }}
                >
                  <Popup>
                    <div className="p-1 min-w-[160px]">
                      <p className="font-black text-base text-gray-900 mb-1">{regiao.nome} — {regiao.estado}</p>
                      <p className="text-xs text-gray-500 mb-2">{coberturaConfig[regiao.cobertura].label}</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>Pacientes:</strong> {regiao.pacientes}</p>
                        <p><strong>Médicos:</strong> {regiao.medicos}</p>
                        <p><strong>Consultas:</strong> {regiao.consultas}</p>
                        <p><strong>Status:</strong> <span className={regiao.ativa ? 'text-green-600' : 'text-red-500'}>{regiao.ativa ? 'Ativo' : 'Implantação'}</span></p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-4 mt-4">
            {Object.entries(coberturaConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.cor }} />
                {cfg.label}
              </div>
            ))}
          </div>
        </section>

        {/* ── Lista de Regiões ── */}
        <section>
          <motion.div {...fadeUp()} className="mb-8">
            <span className="text-xs font-black text-sky-500 uppercase tracking-widest block mb-1">Detalhes</span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Regiões por Cobertura</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {regioesFiltradas.map((regiao, i) => (
              <motion.div
                key={regiao.id}
                {...fadeUp(i * 0.06)}
                onClick={() => setRegiaoSelecionada(regiao === regiaoSelecionada ? null : regiao)}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 ${
                  regiaoSelecionada?.id === regiao.id
                    ? 'border-[#0EA5E9] shadow-[0_0_0_3px_rgba(14,165,233,0.15)]'
                    : 'border-gray-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-700/50 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-base">{regiao.nome}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold">{regiao.estado}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-[10px] font-black px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: coberturaConfig[regiao.cobertura].cor }}
                    >
                      {regiao.cobertura}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      regiao.ativa ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {regiao.ativa ? 'Ativo' : 'Em implantação'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { icon: <Users size={13} />,    label: 'Pacientes', value: regiao.pacientes },
                    { icon: <Activity size={13} />, label: 'Consultas', value: regiao.consultas },
                    { icon: <TrendingUp size={13} />, label: 'Médicos', value: regiao.medicos },
                  ].map((stat, j) => (
                    <div key={j} className="bg-gray-50 dark:bg-slate-700 rounded-xl p-2.5 text-center">
                      <div className="flex items-center justify-center text-sky-500 mb-1">{stat.icon}</div>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
