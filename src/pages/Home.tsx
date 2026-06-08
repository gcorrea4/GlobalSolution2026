import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Satellite, ShieldCheck, Zap,
  Radio, Users, MessageCircle, MapPin, Signal,
  CheckCircle2, ArrowRight, Activity, Layers, Target, Eye,
} from 'lucide-react';

export function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth } = carouselRef.current;
      if (scrollLeft <= 10) {
        carouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: -420, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' });
      }
    }
  };

  const impactNumbers = [
    { value: '2.500+', label: 'Consultas realizadas',   icon: <Activity  size={26} /> },
    { value: '350+',   label: 'Médicos voluntários',    icon: <Users     size={26} /> },
    { value: '180+',   label: 'Regiões atendidas',      icon: <MapPin    size={26} /> },
    { value: '12',     label: 'Estados com cobertura',  icon: <Signal    size={26} /> },
  ];

  const checklist = [
    'Teleconsultas 100% gratuitas para populações remotas',
    'Médicos voluntários verificados e especializados',
    'Triagem por urgência clínica e distância do serviço de saúde',
    'Cobertura via satélite em áreas sem internet convencional',
    'Prontuário digital para continuidade do cuidado',
    'Integrado com o SUS e programas federais de saúde rural',
  ];

  const steps = [
    {
      num: '01',
      title: 'Cadastre-se',
      desc: 'Informe sua localização, dados de saúde e necessidade clínica. O sistema identifica automaticamente sua região de cobertura.',
      blue: true,
    },
    {
      num: '02',
      title: 'Triagem & Conexão',
      desc: 'Nosso algoritmo avalia urgência e disponibilidade para conectar você ao médico voluntário mais adequado.',
      blue: false,
    },
    {
      num: '03',
      title: 'Teleconsulta',
      desc: 'Realize a consulta por vídeo via satélite, direto do seu município — sem precisar viajar centenas de quilômetros.',
      blue: true,
    },
  ];

  const cards = [
    { num: '1°', icon: <Radio       size={32} />, title: 'Triagem Inteligente',    desc: 'Algoritmo de priorização para regiões remotas baseado em urgência clínica, distância e disponibilidade de cobertura satelital.',  color: 'blue'  },
    { num: '2°', icon: <ShieldCheck size={32} />, title: 'Prontuário Digital',     desc: 'Histórico clínico completo e seguro, garantindo que cada teleconsulta seja registrada e disponível para acompanhamento.',          color: 'green' },
    { num: '3°', icon: <Zap         size={32} />, title: 'Match Geográfico',       desc: 'Conectamos médicos voluntários aos pacientes mais próximos através de mapas de calor de regiões com menor acesso à saúde.',         color: 'blue'  },
    { num: '4°', icon: <Satellite   size={32} />, title: 'Cobertura Satelital',    desc: 'Infraestrutura via satélite garante conectividade mesmo em áreas rurais, indígenas e ribeirinhas sem internet convencional.',       color: 'green' },
    { num: '5°', icon: <Users       size={32} />, title: 'Rede de Médicos',        desc: 'Faça parte da maior rede de telemedicina rural do Brasil, conectando especialistas a comunidades isoladas.',                        color: 'blue'  },
    { num: '6°', icon: <MessageCircle size={32} />, title: 'Suporte Contínuo',    desc: 'Canais diretos de acompanhamento pós-consulta e encaminhamento para serviços presenciais quando necessário.',                       color: 'green' },
  ];

  const fadeUp   = (delay = 0) => ({ initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });
  const fadeLeft = (delay = 0) => ({ initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });
  const fadeRight= (delay = 0) => ({ initial: { opacity: 0, x:  30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });

  return (
    <main className="bg-white dark:bg-slate-900 text-[#333333] dark:text-slate-100 font-sans overflow-x-hidden transition-colors duration-300">

      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-slow { 0%,100%{opacity:.15} 50%{opacity:.3} }
        .pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        @keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
        .orbit { animation: orbit 18s linear infinite; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center text-center pt-20 box-border overflow-hidden bg-[#050B18]">
        {/* Fundo espacial */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B18] via-[#0A1628] to-[#050B18]" />
        <div className="pulse-slow absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-[#0EA5E9]/12 blur-3xl" />
        <div className="pulse-slow absolute bottom-1/4 right-1/5 w-96 h-96 rounded-full bg-violet-500/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#0EA5E9]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#0EA5E9]/8" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 relative z-10"
        >
          <span className="bg-[#0EA5E9]/10 backdrop-blur-sm border border-[#0EA5E9]/30 text-[#0EA5E9] text-[11px] font-bold px-4 py-2 rounded-full tracking-wide uppercase">
            🛰️ Conectividade via satélite para regiões remotas
          </span>
        </motion.div>

        <div className="relative z-10 max-w-[860px] px-5 pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            className="text-white text-[2.25rem] sm:text-5xl md:text-[3.8rem] font-black leading-[1.1] mb-6"
          >
            Saúde acessível<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-sky-300">
              onde o sinal chega.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="text-[#B0C4D8] text-lg md:text-[1.2rem] mb-10 leading-[1.75] max-w-[660px] mx-auto"
          >
            Conectamos <strong className="text-white">médicos voluntários</strong> a pacientes em regiões remotas via telemedicina por satélite — de forma gratuita, ágil e inteligente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.38 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/cadastro"
              className="bg-[#0EA5E9] text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-sky-600 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.45)] flex items-center gap-2 justify-center"
            >
              <Activity size={20} /> Preciso de Atendimento
            </Link>
            <Link
              to="/cadastro"
              className="bg-transparent border-2 border-white text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-white hover:text-[#050B18] transition-all flex items-center gap-2 justify-center"
            >
              <Users size={20} /> Sou Médico Voluntário
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-5"
          >
            <Link to="/sobre" className="text-white/40 text-sm hover:text-white/70 transition-colors hover:underline underline-offset-2">
              Conheça o projeto →
            </Link>
          </motion.div>
        </div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-white/30 text-[10px] tracking-[3px] uppercase">role para ver mais</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          NÚMEROS DE IMPACTO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0B090B] py-16">
        <div className="h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/50 to-transparent mb-16" />

        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {impactNumbers.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9]">
                {item.icon}
              </div>
              <span className="text-white text-4xl font-black leading-none">{item.value}</span>
              <span className="text-white/45 text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/25 to-transparent mt-16" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MISSÃO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-[1150px] mx-auto flex flex-col lg:flex-row gap-20 items-center">

          <motion.div {...fadeLeft()} className="flex-1">
            <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Nossa missão
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.12] mb-6">
              Saúde não pode ser<br />
              <span className="text-[#0EA5E9]">privilégio geográfico.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-5">
              No Brasil, milhões de pessoas em regiões remotas <strong className="text-gray-700 dark:text-slate-200">nunca tiveram acesso a um médico</strong>. A distância dos centros urbanos, a ausência de infraestrutura e a falta de profissionais locais são barreiras que ceifam vidas diariamente.
            </p>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-9">
              O <strong className="text-gray-800 dark:text-slate-200">OrbitalCare</strong> usa conectividade satelital para levar teleconsultas a essas comunidades, priorizando os casos mais urgentes com tecnologia de triagem inteligente.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-[#0EA5E9] font-bold text-lg group"
            >
              Entenda o projeto
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div {...fadeRight(0.1)} className="flex-1 flex flex-col gap-3">
            {checklist.map((item, i) => (
              <motion.div
                key={i}
                {...fadeRight(i * 0.07)}
                className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-sky-100 dark:hover:border-sky-800/60 transition-all"
              >
                <CheckCircle2 size={20} className="text-[#0EA5E9] shrink-0" />
                <span className="text-gray-700 dark:text-slate-200 font-medium text-sm md:text-base">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COMO FUNCIONA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#0B090B] relative overflow-hidden">
        <div className="pulse-slow absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#0EA5E9]/8" />
        <div className="pulse-slow absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#0EA5E9]/5" />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Simples assim
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Do cadastro à teleconsulta<br />
              <span className="text-[#0EA5E9]">em 3 passos.</span>
            </h2>
            <p className="text-white/45 text-lg mt-5 max-w-md mx-auto">
              Sem deslocamento. Sem custo. Com satélite para chegar a quem mais precisa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px bg-gradient-to-r from-[#0EA5E9]/20 via-[#0EA5E9] to-[#0EA5E9]/20" />

            {steps.map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.15)} className="relative flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-7 relative z-10 transition-all
                  ${step.blue
                    ? 'bg-[#0EA5E9] text-white shadow-[0_0_30px_rgba(14,165,233,0.35)]'
                    : 'bg-white/8 text-white border-2 border-[#0EA5E9]/40'
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm max-w-[240px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} className="text-center mt-14">
            <Link
              to="/consultas"
              className="inline-flex items-center gap-2 bg-[#0EA5E9] text-white px-9 py-4 rounded-full font-bold text-lg hover:bg-sky-600 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.35)]"
            >
              Agendar teleconsulta <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CARROSSEL
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 max-w-[1400px] mx-auto overflow-hidden bg-white dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 mb-14 gap-6">
          <motion.div {...fadeLeft()} className="max-w-2xl">
            <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              A plataforma
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white tracking-tight">
              O que entregamos{' '}
              <span className="text-[#0EA5E9]">de verdade.</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">
              Nossa plataforma automatiza processos complexos para focar no que importa: levar saúde a quem mais precisa.
            </p>
          </motion.div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9] transition-all bg-white dark:bg-slate-800 shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9] transition-all bg-white dark:bg-slate-800 shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-12 snap-x snap-mandatory scroll-smooth hide-scroll w-full"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[32px] min-w-[320px] md:min-w-[420px] snap-start border border-gray-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-sky-200 dark:hover:border-sky-700/60 hover:shadow-[0_8px_30px_rgba(14,165,233,0.10)] transition-all duration-300"
            >
              <div className="absolute -right-4 -top-8 text-[8rem] font-black text-gray-50 dark:text-slate-700 group-hover:scale-110 transition-transform pointer-events-none select-none">
                {card.num.replace('°', '')}
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-colors ${card.color === 'blue' ? 'bg-sky-50 text-sky-500' : 'bg-green-50 text-green-500'}`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white relative z-10">{card.title}</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-lg relative z-10">{card.desc}</p>
            </motion.div>
          ))}
          <div className="min-w-[1px] flex-shrink-0 snap-end" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROGRAMAS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-[1100px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Nossas iniciativas
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Nossos <span className="text-[#0EA5E9]">Programas</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Missões de Saúde */}
            <motion.div
              {...fadeLeft(0.1)}
              className="bg-white dark:bg-slate-800 rounded-[32px] p-10 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] hover:border-sky-200 dark:hover:border-sky-700/60 transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center mb-6 text-[#0EA5E9]">
                <Satellite size={28} />
              </div>
              <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[2px] mb-2">Comunidades rurais e indígenas</span>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4">Missões de Saúde</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-base flex-1">
                Atendimento médico voluntário via telemedicina para comunidades sem acesso a serviços de saúde, com foco em prevenção, diagnóstico e acompanhamento de doenças crônicas.
              </p>
              <Link
                to="/apolonias"
                className="mt-8 inline-flex items-center gap-2 text-[#0EA5E9] font-bold group"
              >
                Saiba mais <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Card Cobertura Satelital */}
            <motion.div
              {...fadeRight(0.1)}
              className="bg-white dark:bg-slate-800 rounded-[32px] p-10 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] hover:border-violet-200 dark:hover:border-violet-700/60 transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-6 text-violet-600 dark:text-violet-400">
                <Signal size={28} />
              </div>
              <span className="text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-[2px] mb-2">Fronteiras e áreas isoladas</span>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4">Cobertura Satelital</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-base flex-1">
                Infraestrutura de conectividade via satélite levada diretamente às comunidades mais isoladas, garantindo teleconsultas estáveis mesmo sem energia elétrica regular.
              </p>
              <Link
                to="/regioes"
                className="mt-8 inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold group"
              >
                Ver regiões <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TECNOLOGIA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#0B090B] relative overflow-hidden">
        <div className="pulse-slow absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-500/5" />
        <div className="pulse-slow absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#0EA5E9]/5" />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Diferencial técnico
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Triagem <span className="text-[#0EA5E9]">Inteligente</span>
            </h2>
            <p className="text-white/50 text-lg max-w-[640px] mx-auto leading-relaxed">
              Substituímos filas manuais e deslocamentos desnecessários por um sistema de teleconsultas rastreáveis com priorização automatizada por urgência clínica e cobertura satelital.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Layers size={28} />, title: 'Gateway Satelital',        desc: 'Um único ponto de acesso para todos os canais de solicitação, integrando regiões com diferentes tipos de conectividade.' },
              { icon: <Target size={28} />, title: 'Score de Prioridade',       desc: 'Algoritmo que pontua casos por gravidade clínica, distância do serviço de saúde e disponibilidade de cobertura.' },
              { icon: <Eye   size={28} />, title: 'Acompanhamento em Tempo Real', desc: 'Paciente e médico acompanham cada etapa da consulta em tempo real, com histórico completo acessível.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.12)}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#0EA5E9]/40 hover:bg-[#0EA5E9]/5 transition-all duration-300 flex flex-col items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0EA5E9]/15 flex items-center justify-center text-[#0EA5E9]">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA DUPLO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-br from-[#0EA5E9] via-sky-500 to-sky-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/8 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-[1000px] mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Faça parte dessa missão.
            </h2>
            <p className="text-white/75 text-xl max-w-lg mx-auto leading-relaxed">
              Seja como paciente ou como médico voluntário, você pode transformar vidas em regiões onde a saúde ainda é distante.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Card paciente */}
            <motion.div
              {...fadeLeft(0.1)}
              className="bg-white rounded-3xl p-9 flex flex-col items-center text-center shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-5 text-[#0EA5E9]">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Preciso de atendimento</h3>
              <p className="text-gray-500 mb-7 leading-relaxed text-sm">
                Moro em uma região remota e preciso de uma teleconsulta médica gratuita via satélite.
              </p>
              <Link
                to="/cadastro"
                className="block w-full bg-[#0EA5E9] text-white py-4 rounded-2xl font-bold text-base hover:bg-sky-600 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.3)]"
              >
                Quero me cadastrar
              </Link>
            </motion.div>

            {/* Card médico */}
            <motion.div
              {...fadeRight(0.1)}
              className="bg-white/15 backdrop-blur-sm rounded-3xl p-9 flex flex-col items-center text-center border border-white/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-5 text-white">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Sou médico voluntário</h3>
              <p className="text-white/65 mb-7 leading-relaxed text-sm">
                Quero usar minha expertise para atender pacientes em regiões remotas e fazer parte da maior rede de telemedicina rural do Brasil.
              </p>
              <Link
                to="/cadastro"
                className="block w-full bg-white text-[#0EA5E9] py-4 rounded-2xl font-bold text-base hover:bg-sky-50 transition-all"
              >
                Quero ser voluntário
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.25)} className="text-center">
            <Link
              to="/regioes"
              className="inline-flex items-center gap-2 text-white/70 font-semibold hover:text-white transition-colors text-base group"
            >
              <MapPin size={18} className="group-hover:scale-110 transition-transform" />
              Ver regiões atendidas →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
