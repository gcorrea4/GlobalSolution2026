import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Zap, Loader2 } from 'lucide-react';
import { RISCO_API_URL } from '../config';

type NivelRisco = 'EMERGENCIA' | 'URGENTE' | 'ATENCAO' | 'BAIXO' | null;

interface Resultado {
  pontuacao: number;
  nivel: NivelRisco;
  alertas: string[];
  recomendacao: string;
}

const nivelConfig = {
  EMERGENCIA: {
    label: 'EMERGÊNCIA',
    cor: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    icon: <XCircle size={28} className="text-red-400" />,
    barra: 'bg-red-500',
  },
  URGENTE: {
    label: 'URGENTE',
    cor: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
    icon: <AlertTriangle size={28} className="text-orange-400" />,
    barra: 'bg-orange-500',
  },
  ATENCAO: {
    label: 'ATENÇÃO',
    cor: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: <Zap size={28} className="text-yellow-400" />,
    barra: 'bg-yellow-500',
  },
  BAIXO: {
    label: 'BAIXO RISCO',
    cor: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
    icon: <CheckCircle size={28} className="text-green-400" />,
    barra: 'bg-green-500',
  },
};

export function CalculadoraRisco() {
  const [sinais, setSinais] = useState({
    temperatura: '36.5',
    saturacao: '98',
    frequencia_cardiaca: '75',
    pressao_sistolica: '120',
    pressao_diastolica: '80',
  });

  const [sintomas, setSintomas] = useState({
    dor_peito: false,
    falta_ar: false,
    confusao: false,
    desmaio: false,
    sangramento: false,
    febre_persistente: false,
    vomitos: false,
    dor_forte: false,
  });

  const [contexto, setContexto] = useState({
    distancia_hospital_km: '10',
    internet_disponivel: true,
    medicamentos_basicos: true,
  });

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSinais = (campo: string, valor: string) =>
    setSinais(prev => ({ ...prev, [campo]: valor }));

  const handleSintoma = (campo: string) =>
    setSintomas(prev => ({ ...prev, [campo]: !prev[campo as keyof typeof prev] }));

  const handleContexto = (campo: string, valor: string | boolean) =>
    setContexto(prev => ({ ...prev, [campo]: valor }));

  const calcular = async () => {
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const res = await fetch(`${RISCO_API_URL}/calcular-risco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sinais: {
            temperatura:         parseFloat(sinais.temperatura),
            saturacao:           parseFloat(sinais.saturacao),
            frequencia_cardiaca: parseFloat(sinais.frequencia_cardiaca),
            pressao_sistolica:   parseFloat(sinais.pressao_sistolica),
            pressao_diastolica:  parseFloat(sinais.pressao_diastolica),
          },
          sintomas,
          contexto: {
            distancia_hospital_km: parseFloat(contexto.distancia_hospital_km),
            internet_disponivel:   contexto.internet_disponivel,
            medicamentos_basicos:  contexto.medicamentos_basicos,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || 'Erro na API');
      }

      const data: Resultado = await res.json();
      setResultado(data);
    } catch (e: unknown) {
      if (e instanceof TypeError) {
        setErro('Serviço indisponível. O servidor pode estar iniciando (aguarde ~40s e tente de novo).');
      } else {
        setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  const sinaisLabels: Record<string, string> = {
    temperatura: 'Temperatura (°C)',
    saturacao: 'Saturação O₂ (%)',
    frequencia_cardiaca: 'Frequência Cardíaca (bpm)',
    pressao_sistolica: 'Pressão Sistólica (mmHg)',
    pressao_diastolica: 'Pressão Diastólica (mmHg)',
  };

  const sintomasLabels: Record<string, string> = {
    dor_peito: 'Dor no peito',
    falta_ar: 'Falta de ar',
    confusao: 'Confusão mental',
    desmaio: 'Desmaio',
    sangramento: 'Sangramento',
    febre_persistente: 'Febre persistente',
    vomitos: 'Vômitos intensos',
    dor_forte: 'Dor forte',
  };

  const cfg = resultado?.nivel ? nivelConfig[resultado.nivel] : null;

  return (
    <main className="bg-[#030712] min-h-screen pt-24 pb-20 px-6 text-white font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-4 flex items-center gap-2">
            <Activity size={13} /> AstraCare · Python
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Calculadora de<br />
            <span className="text-sky-500">Risco Clínico</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Sistema de triagem para ambientes remotos e isolados. Insira os sinais vitais do paciente e obtenha uma avaliação de risco baseada no algoritmo AstraCare.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Coluna esquerda — Sinais e Sintomas */}
          <div className="space-y-8">

            {/* Sinais Vitais */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                <Activity size={18} className="text-sky-500" /> Sinais Vitais
              </h2>
              <div className="space-y-4">
                {Object.entries(sinaisLabels).map(([campo, label]) => (
                  <div key={campo}>
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      {label}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={sinais[campo as keyof typeof sinais]}
                      onChange={e => handleSinais(campo, e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sintomas */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                <AlertTriangle size={18} className="text-sky-500" /> Sintomas Relatados
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(sintomasLabels).map(([campo, label]) => (
                  <button
                    key={campo}
                    onClick={() => handleSintoma(campo)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                      sintomas[campo as keyof typeof sintomas]
                        ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita — Contexto e Resultado */}
          <div className="space-y-8">

            {/* Contexto */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                <Zap size={18} className="text-sky-500" /> Contexto Operacional
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Distância do Hospital (km)
                  </label>
                  <input
                    type="number"
                    value={contexto.distancia_hospital_km}
                    onChange={e => handleContexto('distancia_hospital_km', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { campo: 'internet_disponivel', label: 'Internet disponível para teleconsulta' },
                    { campo: 'medicamentos_basicos', label: 'Estoque básico de medicamentos' },
                  ].map(({ campo, label }) => (
                    <button
                      key={campo}
                      onClick={() => handleContexto(campo, !contexto[campo as keyof typeof contexto])}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                        contexto[campo as keyof typeof contexto]
                          ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${contexto[campo as keyof typeof contexto] ? 'bg-sky-500 border-sky-500' : 'border-slate-600'}`}>
                        {contexto[campo as keyof typeof contexto] && (
                          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={calcular}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white font-black text-base px-6 py-4 rounded-xl transition-colors"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Activity size={20} />}
              {loading ? 'Calculando...' : 'Calcular Risco'}
            </button>

            {/* Erro */}
            {erro && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                {erro}
              </div>
            )}

            {/* Resultado */}
            {resultado && cfg && (
              <div className={`rounded-2xl border p-6 ${cfg.bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  {cfg.icon}
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Nível de Risco</p>
                    <p className={`text-2xl font-black ${cfg.cor}`}>{cfg.label}</p>
                  </div>
                  <span className={`ml-auto text-3xl font-black ${cfg.cor}`}>{resultado.pontuacao}pts</span>
                </div>

                {/* Barra de pontuação */}
                <div className="bg-slate-800 rounded-full h-2 mb-5 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${cfg.barra}`}
                    style={{ width: `${Math.min(100, (resultado.pontuacao / 20) * 100)}%` }}
                  />
                </div>

                {/* Alertas */}
                {resultado.alertas.length > 0 && (
                  <div className="mb-4">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Alertas identificados</p>
                    <div className="flex flex-wrap gap-2">
                      {resultado.alertas.map((alerta, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-semibold">
                          {alerta}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recomendação */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Conduta recomendada</p>
                  <p className="text-white text-sm leading-relaxed">{resultado.recomendacao}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Aviso */}
        <p className="text-slate-600 text-xs text-center mt-12">
          Ferramenta acadêmica — não substitui avaliação médica profissional. Global Solution 2026 · FIAP
        </p>
      </div>
    </main>
  );
}
