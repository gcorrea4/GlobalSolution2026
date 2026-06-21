import { useState } from 'react';
import { Brain, Loader2, Clock, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { IA_API_URL } from '../config';

interface ResultadoUrgencia {
  urgencia_predita: string;
  probabilidades_percentual: Record<string, number>;
  confianca: number;
  interpretacao: string;
}

interface ResultadoTempo {
  tempo_espera_dias: number;
  categoria: string;
  descricao: string;
}

const urgenciaConfig = {
  ALTA: {
    label: 'Urgência ALTA',
    cor: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    barra: 'bg-red-500',
    icon: <AlertTriangle size={24} className="text-red-400" />,
  },
  MEDIA: {
    label: 'Urgência MÉDIA',
    cor: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
    barra: 'bg-orange-500',
    icon: <Zap size={24} className="text-orange-400" />,
  },
  BAIXA: {
    label: 'Urgência BAIXA',
    cor: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
    barra: 'bg-green-500',
    icon: <CheckCircle size={24} className="text-green-400" />,
  },
};

const REGIOES = ['Amazônia', 'Pantanal', 'Sertão Nordestino', 'Vale do Ribeira', 'Roraima', 'Amapá', 'Acre', 'Tocantins'];
const ESPECIALIDADES = ['Clínico Geral', 'Cardiologia', 'Pediatria', 'Ginecologia', 'Ortopedia', 'Dermatologia'];
const SINTOMAS = ['Dor no peito', 'Febre alta', 'Dor abdominal', 'Fratura', 'Infecção', 'Tontura', 'Dificuldade respiratória', 'Dor crônica'];

export function TriagemIA() {
  const [form, setForm] = useState({
    idade: '35',
    genero: 'M',
    regiao: REGIOES[0],
    sintoma_principal: SINTOMAS[0],
    especialidade_necessaria: ESPECIALIDADES[0],
    tempo_dias_sintoma: '7',
    distancia_hospital_km: '150',
    medicos_disponiveis: '2',
    cobertura_satelite: '1',
    renda_salarios_minimos: '1.5',
  });

  const [urgencia, setUrgencia] = useState<ResultadoUrgencia | null>(null);
  const [tempo, setTempo] = useState<ResultadoTempo | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const set = (campo: string, valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }));

  const analisar = async () => {
    setLoading(true);
    setErro(null);
    setUrgencia(null);
    setTempo(null);

    const payload = {
      ...form,
      idade: parseInt(form.idade),
      tempo_dias_sintoma: parseInt(form.tempo_dias_sintoma),
      distancia_hospital_km: parseInt(form.distancia_hospital_km),
      medicos_disponiveis: parseInt(form.medicos_disponiveis),
      cobertura_satelite: parseInt(form.cobertura_satelite),
      renda_salarios_minimos: parseFloat(form.renda_salarios_minimos),
    };

    try {
      const resUrgencia = await fetch(`${IA_API_URL}/predict/urgencia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resUrgencia.ok) {
        const d = await resUrgencia.json();
        throw new Error(d.erro || 'Erro na predição de urgência');
      }

      const dataUrgencia: ResultadoUrgencia = await resUrgencia.json();
      setUrgencia(dataUrgencia);

      const resTempo = await fetch(`${IA_API_URL}/predict/tempo-espera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, urgencia: dataUrgencia.urgencia_predita }),
      });

      if (!resTempo.ok) {
        const d = await resTempo.json();
        throw new Error(d.erro || 'Erro na predição de tempo');
      }

      const dataTempo: ResultadoTempo = await resTempo.json();
      setTempo(dataTempo);

    } catch (e: unknown) {
      if (e instanceof TypeError && e.message.includes('fetch')) {
        setErro('Serviço de IA temporariamente indisponível. Tente novamente em instantes.');
      } else {
        setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  const cfg = urgencia ? urgenciaConfig[urgencia.urgencia_predita as keyof typeof urgenciaConfig] : null;

  return (
    <main className="bg-[#030712] min-h-screen pt-24 pb-20 px-6 text-white font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-purple-400 text-[11px] font-bold uppercase tracking-[4px] mb-4 flex items-center gap-2">
            <Brain size={13} /> OrbitalCare IA · Machine Learning
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Triagem Inteligente<br />
            <span className="text-purple-400">com IA</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Modelos de machine learning treinados com dados de telemedicina em regiões remotas. Classifica urgência e estima tempo de espera para atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Formulário */}
          <div className="space-y-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-black text-lg mb-1 flex items-center gap-2">
                <Brain size={18} className="text-purple-400" /> Dados do Paciente
              </h2>

              {/* Idade + Gênero */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Idade</label>
                  <input
                    type="number"
                    value={form.idade}
                    onChange={e => set('idade', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Gênero</label>
                  <select
                    value={form.genero}
                    onChange={e => set('genero', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>

              {/* Região */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Região</label>
                <select
                  value={form.regiao}
                  onChange={e => set('regiao', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {REGIOES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Sintoma */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Sintoma Principal</label>
                <select
                  value={form.sintoma_principal}
                  onChange={e => set('sintoma_principal', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {SINTOMAS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Especialidade */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Especialidade Necessária</label>
                <select
                  value={form.especialidade_necessaria}
                  onChange={e => set('especialidade_necessaria', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* Numéricos */}
              {[
                { campo: 'tempo_dias_sintoma',      label: 'Dias com sintoma',              type: 'number' },
                { campo: 'distancia_hospital_km',   label: 'Distância do Hospital (km)',    type: 'number' },
                { campo: 'medicos_disponiveis',     label: 'Médicos disponíveis na região', type: 'number' },
                { campo: 'renda_salarios_minimos',  label: 'Renda (salários mínimos)',      type: 'number' },
              ].map(({ campo, label, type }) => (
                <div key={campo}>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    type={type}
                    step="0.1"
                    value={form[campo as keyof typeof form]}
                    onChange={e => set(campo, e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              ))}

              {/* Cobertura Satélite */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Cobertura de Satélite</label>
                <div className="flex gap-3">
                  {[{ v: '1', l: 'Disponível' }, { v: '0', l: 'Indisponível' }].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() => set('cobertura_satelite', v)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                        form.cobertura_satelite === v
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={analisar}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-base px-6 py-4 rounded-xl transition-colors"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Brain size={20} />}
              {loading ? 'Analisando com IA...' : 'Analisar com IA'}
            </button>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                {erro}
              </div>
            )}
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            {!urgencia && !loading && (
              <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <Brain size={40} className="text-slate-700 mb-4" />
                <p className="text-slate-600 font-semibold">Preencha os dados e clique em Analisar para ver a predição do modelo.</p>
              </div>
            )}

            {urgencia && cfg && (
              <div className={`rounded-2xl border p-6 ${cfg.bg}`}>
                <div className="flex items-center gap-3 mb-5">
                  {cfg.icon}
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Classificação do Modelo</p>
                    <p className={`text-2xl font-black ${cfg.cor}`}>{cfg.label}</p>
                  </div>
                  <span className={`ml-auto text-2xl font-black ${cfg.cor}`}>{urgencia.confianca}%</span>
                </div>

                <p className="text-slate-300 text-sm mb-5 leading-relaxed">{urgencia.interpretacao}</p>

                {/* Probabilidades */}
                <div className="space-y-3 mb-5">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Probabilidades</p>
                  {Object.entries(urgencia.probabilidades_percentual)
                    .sort(([, a], [, b]) => b - a)
                    .map(([classe, prob]) => {
                      const barCfg = urgenciaConfig[classe as keyof typeof urgenciaConfig];
                      return (
                        <div key={classe}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className={barCfg?.cor ?? 'text-slate-400'}>{classe}</span>
                            <span className="text-slate-300">{prob}%</span>
                          </div>
                          <div className="bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${barCfg?.barra ?? 'bg-slate-500'}`}
                              style={{ width: `${prob}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {tempo && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={24} className="text-sky-400" />
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Estimativa de Espera</p>
                    <p className="text-2xl font-black text-white">{tempo.tempo_espera_dias} dias</p>
                  </div>
                  <span className="ml-auto px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">
                    {tempo.categoria}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{tempo.descricao}</p>
              </div>
            )}

            {/* Info sobre o modelo */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Sobre o Modelo</p>
              <div className="space-y-2 text-xs text-slate-500">
                <p>• Classificação: Random Forest treinado com dados sintéticos de telemedicina remota</p>
                <p>• Regressão: Modelo de estimativa de tempo de espera por região e urgência</p>
                <p>• 8 regiões · 6 especialidades · 8 tipos de sintoma</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-xs text-center mt-12">
          Ferramenta acadêmica — não substitui avaliação médica profissional. Global Solution 2026 · FIAP
        </p>
      </div>
    </main>
  );
}
