import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Satellite, Calendar, Video, CheckCircle2,
  ArrowRight, Clock, MapPin, Stethoscope,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const especialidades = [
  'Clínica Geral',
  'Cardiologia',
  'Pediatria',
  'Ginecologia',
  'Dermatologia',
  'Ortopedia',
  'Psiquiatria',
  'Neurologia',
];

const urgencias = [
  { valor: 'BAIXA',  label: 'Rotina',    desc: 'Consulta preventiva ou acompanhamento',    cor: 'green'  },
  { valor: 'MEDIA',  label: 'Urgente',   desc: 'Sintomas moderados que precisam de atenção', cor: 'yellow' },
  { valor: 'ALTA',   label: 'Emergência', desc: 'Situação grave que exige atendimento imediato', cor: 'red'   },
];

const passos = [
  {
    num: '01',
    titulo: 'Preencha o formulário',
    desc: 'Informe sua localização, sintomas, especialidade desejada e nível de urgência.',
    icon: <Calendar size={28} />,
  },
  {
    num: '02',
    titulo: 'Triagem automática',
    desc: 'Nosso sistema analisa sua solicitação e conecta você ao médico voluntário mais adequado.',
    icon: <Stethoscope size={28} />,
  },
  {
    num: '03',
    titulo: 'Receba a confirmação',
    desc: 'Você receberá data, horário e link para a videochamada via satélite.',
    icon: <CheckCircle2 size={28} />,
  },
  {
    num: '04',
    titulo: 'Teleconsulta por vídeo',
    desc: 'Conecte-se com o médico no horário combinado, de onde você estiver.',
    icon: <Video size={28} />,
  },
];

export function Consultas() {
  const [especialidade, setEspecialidade] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [estado, setEstado] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [enviado, setEnviado] = useState(false);

  const usuarioLogado = sessionStorage.getItem('usuarioLogado');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 5000);
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay },
  });

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#050B18] via-[#0A1628] to-slate-900 pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#0EA5E9]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#0EA5E9]/20 text-[#0EA5E9] text-sm font-bold px-4 py-2 rounded-full mb-6 border border-[#0EA5E9]/20"
          >
            <Satellite size={15} /> Telemedicina via Satélite
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Agendar Teleconsulta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Consultas médicas gratuitas para comunidades remotas. Sem deslocamento, sem filas — só cuide da sua saúde.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">

        {/* ── Como Funciona ── */}
        <section>
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="text-xs font-black text-sky-500 uppercase tracking-widest mb-3 block">Processo</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Como funciona</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {passos.map((passo, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-7 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700/60 transition-all duration-300 flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/30 text-[#0EA5E9] rounded-2xl flex items-center justify-center">
                  {passo.icon}
                </div>
                <span className="text-[#0EA5E9] font-black text-sm">{passo.num}</span>
                <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight">{passo.titulo}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{passo.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Formulário + Info ── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Formulário */}
          <motion.div {...fadeUp()} className="lg:col-span-3">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Solicitar teleconsulta</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-8">
              {usuarioLogado ? 'Preencha os dados abaixo para solicitar sua teleconsulta gratuita.' : (
                <>Você precisa estar <Link to="/login" className="text-[#0EA5E9] font-bold hover:underline">logado</Link> para solicitar uma consulta. <Link to="/cadastro" className="text-[#0EA5E9] font-bold hover:underline">Criar conta →</Link></>
              )}
            </p>

            {enviado && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 rounded-xl p-4 mb-6 font-semibold text-sm"
              >
                <CheckCircle2 size={18} />
                Solicitação enviada! Em breve você receberá a confirmação.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Município
                  </label>
                  <input
                    type="text"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    placeholder="Ex: Altamira"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="Ex: PA"
                    maxLength={2}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Especialidade
                </label>
                <select
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all"
                >
                  <option value="">Selecione a especialidade</option>
                  {especialidades.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Urgência
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {urgencias.map((u) => (
                    <button
                      key={u.valor}
                      type="button"
                      onClick={() => setUrgencia(u.valor)}
                      className={`p-3 rounded-xl text-center border-2 transition-all duration-200 ${
                        urgencia === u.valor
                          ? u.cor === 'green'  ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                          : u.cor === 'yellow' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30'
                          :                      'border-red-500 bg-red-50 dark:bg-red-950/30'
                          : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300'
                      }`}
                    >
                      <p className={`text-xs font-black uppercase ${
                        urgencia === u.valor
                          ? u.cor === 'green' ? 'text-green-700' : u.cor === 'yellow' ? 'text-yellow-700' : 'text-red-700'
                          : 'text-gray-700 dark:text-slate-200'
                      }`}>{u.label}</p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 leading-tight">{u.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Sintomas / Motivo da consulta
                </label>
                <textarea
                  value={sintomas}
                  onChange={(e) => setSintomas(e.target.value)}
                  placeholder="Descreva brevemente seus sintomas ou motivo da consulta..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0EA5E9] hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_4px_24px_rgba(14,165,233,0.5)] text-base"
              >
                <Satellite size={18} />
                Solicitar Teleconsulta
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-xs text-gray-400 dark:text-slate-500">
                Serviço 100% gratuito. Seus dados são protegidos pela LGPD.
              </p>
            </form>
          </motion.div>

          {/* Info lateral */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-2 space-y-5">
            <div className="bg-sky-50 dark:bg-sky-950/30 rounded-2xl p-6 border border-sky-100 dark:border-sky-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0EA5E9] rounded-xl flex items-center justify-center text-white">
                  <Clock size={20} />
                </div>
                <h3 className="font-black text-gray-900 dark:text-white">Tempo de resposta</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Casos de urgência alta são atendidos em até <strong>2 horas</strong>. Consultas de rotina têm prazo de até <strong>48 horas</strong>.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-950/30 rounded-xl flex items-center justify-center text-green-600">
                  <MapPin size={20} />
                </div>
                <h3 className="font-black text-gray-900 dark:text-white">Cobertura</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Atendemos municípios em todo o Brasil com conectividade via satélite, priorizando regiões com IDH baixo e déficit de médicos.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-950/30 rounded-xl flex items-center justify-center text-violet-600">
                  <AlertCircle size={20} />
                </div>
                <h3 className="font-black text-gray-900 dark:text-white">Emergências</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Para situações de risco de vida, ligue para o SAMU <strong>192</strong> ou Corpo de Bombeiros <strong>193</strong>. O OrbitalCare não substitui atendimento presencial de emergência.
              </p>
            </div>

            <Link
              to="/regioes"
              className="flex items-center justify-between gap-3 p-5 bg-gradient-to-r from-[#0EA5E9] to-sky-600 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity group"
            >
              <span>Ver regiões com cobertura ativa</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
