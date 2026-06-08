import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Satellite, FileText, CheckCircle2, ArrowRight,
  Shield, Building2, Sparkles,
  MapPin, Users, Signal, Stethoscope,
} from 'lucide-react';

export function ApoloniasDoBem() {

  const fadeUp = (delay = 0) => ({
    initial:     { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0  },
    viewport:    { once: true },
    transition:  { duration: 0.6, delay },
  });
  const fadeLeft = (delay = 0) => ({
    initial:     { opacity: 0, x: -32 },
    whileInView: { opacity: 1, x: 0   },
    viewport:    { once: true },
    transition:  { duration: 0.65, delay, ease: 'easeOut' as const },
  });
  const fadeRight = (delay = 0) => ({
    initial:     { opacity: 0, x: 32 },
    whileInView: { opacity: 1, x: 0  },
    viewport:    { once: true },
    transition:  { duration: 0.65, delay, ease: 'easeOut' as const },
  });
  const scaleIn = (delay = 0) => ({
    initial:     { opacity: 0, scale: 0.88 },
    whileInView: { opacity: 1, scale: 1    },
    viewport:    { once: true },
    transition:  { duration: 0.5, delay, ease: 'easeOut' as const },
  });
  const popIn = (delay = 0) => ({
    initial:     { opacity: 0, scale: 0.6 },
    whileInView: { opacity: 1, scale: 1   },
    viewport:    { once: true },
    transition:  { type: 'spring' as const, stiffness: 280, damping: 22, delay },
  });

  const steps = [
    {
      num: '01', icon: <MapPin size={22} />,
      title: 'Identificação da região',
      desc: 'Mapeamos municípios com IDH baixo, déficit crítico de médicos e populações indígenas ou ribeirinhas sem acesso a serviços de saúde.',
      cta: null,
    },
    {
      num: '02', icon: <Satellite size={22} />,
      title: 'Instalação do terminal',
      desc: 'Equipes de campo instalam terminais satelitais compactos com energia solar, garantindo conectividade para teleconsultas de alta qualidade.',
      cta: null,
    },
    {
      num: '03', icon: <Stethoscope size={22} />,
      title: 'Recrutamento de médicos',
      desc: 'Médicos voluntários cadastrados na plataforma se conectam à missão, comprometendo-se com um calendário de atendimentos via telemedicina.',
      cta: null,
    },
    {
      num: '04', icon: <Signal size={22} />,
      title: 'Teleconsultas em operação',
      desc: 'Pacientes da comunidade agendam e realizam consultas por vídeo com médicos de todo o Brasil, com prontuário digital e acompanhamento contínuo.',
      cta: { label: 'Agendar consulta', href: '/consultas' },
    },
  ];

  const criterios = [
    'Municípios com menos de 1 médico por 1.000 habitantes',
    'Comunidades indígenas (Terras Homologadas pela FUNAI)',
    'Populações ribeirinhas em áreas de difícil acesso',
    'Assentamentos rurais e quilombolas',
    'Regiões fronteiriças sem cobertura de saúde',
    'Áreas com IDH abaixo de 0,6 no último censo',
  ];

  const parceiros = [
    { icon: <Building2  size={20} />, title: 'Secretarias de Saúde',  desc: 'Parceria com secretarias municipais e estaduais para integração ao SUS e fluxo de encaminhamentos.' },
    { icon: <Shield     size={20} />, title: 'SESAI / FUNAI',         desc: 'Colaboração com a Secretaria de Saúde Indígena para missões em Terras Indígenas demarcadas.' },
    { icon: <Users      size={20} />, title: 'Universidades Médicas', desc: 'Integração com residências médicas para voluntariado supervisionado em telemedicina rural.' },
    { icon: <Satellite  size={20} />, title: 'Provedores Satelitais', desc: 'Parceria com operadoras de satélite LEO/GEO para infraestrutura de conectividade subsidiada.' },
  ];

  return (
    <main className="font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#050B18]">
        {/* Fundo espacial */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050B18] via-[#0A1A3A] to-[#1A0A2E]" />
        <motion.div
          animate={{ y: [-12, 12, -12], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-[8%] w-64 h-64 rounded-full bg-[#0EA5E9]/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [10, -10, 10], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-24 right-[10%] w-80 h-80 rounded-full bg-violet-500/15 blur-3xl pointer-events-none"
        />
        {/* Anéis orbitais decorativos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#0EA5E9]/6 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#0EA5E9]/8 pointer-events-none" />

        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-5 pt-20 pb-20">

          {/* Chips */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[11px] font-bold px-4 py-2 rounded-full tracking-wide uppercase backdrop-blur-sm">
              <Sparkles size={11} className="text-[#0EA5E9]" /> OrbitalCare
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="inline-flex items-center gap-1.5 bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-sky-200 text-[11px] font-bold px-4 py-2 rounded-full tracking-wide uppercase backdrop-blur-sm"
            >
              🛰️ Cobertura via satélite
            </motion.span>
          </motion.div>

          {/* Título */}
          <div className="max-w-[820px]">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
              className="text-white text-[2.25rem] sm:text-5xl md:text-[3.8rem] font-black leading-[1.1] mb-6 drop-shadow-lg"
            >
              Distância não é mais<br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.4 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-sky-300"
              >
                barreira para a saúde.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="text-white/70 text-lg md:text-[1.15rem] mb-10 leading-[1.75] max-w-[620px] mx-auto"
            >
              As <strong className="text-white">Missões de Saúde</strong> levam terminais satelitais e médicos voluntários às comunidades mais isoladas do Brasil — indígenas, ribeirinhas e rurais.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.38 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/consultas"
                className="bg-[#0EA5E9] text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-sky-600 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.45)] flex items-center gap-2 justify-center"
              >
                <Satellite size={20} /> Agendar teleconsulta
              </Link>
              <Link
                to="/cadastro"
                className="bg-transparent border-2 border-white/40 text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-white/15 hover:border-white/70 transition-all flex items-center gap-2 justify-center"
              >
                <Users size={20} /> Quero ser voluntário
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-5"
            >
              <a href="#o-programa" className="text-white/35 text-sm hover:text-white/65 transition-colors hover:underline underline-offset-2">
                Conheça o programa →
              </a>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-5">
            {[
              { value: '180+',  label: 'regiões atendidas' },
              { value: '12',    label: 'estados cobertos' },
              { value: '100%',  label: 'gratuito' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.55 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-center px-6 py-3 bg-white/8 border border-white/15 rounded-2xl backdrop-blur-sm"
              >
                <p className="text-white font-black text-2xl leading-none">{s.value}</p>
                <p className="text-white/45 text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{ opacity: { delay: 1.1, duration: 0.8 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/25 text-[10px] tracking-[3px] uppercase">role para ver mais</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          O PROGRAMA
      ══════════════════════════════════════════════════════════════ */}
      <section id="o-programa" className="py-28 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-16 items-center">

          <motion.div {...fadeLeft()} className="flex-1">
            <motion.span {...popIn(0.1)} className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              O programa
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.12] mb-6">
              Levar saúde a quem<br />o sistema{' '}
              <span className="text-[#0EA5E9]">esqueceu.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-5">
              As Missões de Saúde combinam logística de campo e telemedicina satelital para atender comunidades que nunca tiveram acesso regular a um médico. Cada missão instala infraestrutura de conectividade e disponibiliza médicos voluntários para teleconsultas contínuas.
            </p>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
              A plataforma <strong className="text-gray-800 dark:text-slate-200">OrbitalCare</strong> garante que após o fim da missão presencial, a comunidade continue tendo acesso a médicos via satélite — transformando uma visita temporária em serviço permanente.
            </p>

            <motion.div {...scaleIn(0.15)} className="bg-sky-50 dark:bg-sky-950/30 border border-[#0EA5E9]/20 dark:border-sky-800/30 rounded-2xl p-5">
              <p className="text-[#0EA5E9] text-xs font-black uppercase tracking-wider mb-2">Por que satélite?</p>
              <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
                Regiões como o Vale do Javari (AM), Terra do Meio (PA) e Alto Rio Negro estão além do alcance de qualquer rede 4G ou fibra. Satélites de órbita baixa (LEO) oferecem latência de 20-40ms — qualidade suficiente para videoconsultas médicas em tempo real.
              </p>
            </motion.div>
          </motion.div>

          <motion.div {...fadeRight(0.1)} className="flex-1 flex flex-col gap-5">

            {/* Citação */}
            <motion.div
              whileHover={{ scale: 1.015, boxShadow: '0 8px 40px rgba(14,165,233,0.12)' }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-[5rem] font-black text-[#0EA5E9]/8 leading-none select-none pointer-events-none">
                "
              </div>
              <p className="text-gray-700 dark:text-slate-200 text-lg leading-relaxed italic relative z-10">
                "Era a primeira vez que alguém da aldeia conseguia falar com um médico sem precisar viajar dois dias de barco."
              </p>
              <p className="text-[#0EA5E9] text-xs mt-4 font-black uppercase tracking-wider">
                — Agente de saúde indígena, Terra Indígena Araweté, PA
              </p>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '180+',      label: 'regiões atendidas' },
                { value: 'AM · PA · RO', label: 'e mais 9 estados' },
                { value: '2.500+',    label: 'consultas realizadas' },
                { value: '2024',      label: 'início do programa' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const } }}
                  whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.35, ease: 'easeOut' as const } }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm text-center cursor-default"
                >
                  <p className="text-2xl font-black leading-none mb-1 text-[#0EA5E9]">{s.value}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-xs">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-28 bg-[#050B18] relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#0EA5E9]/15 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#0EA5E9]/8 blur-3xl pointer-events-none"
        />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <motion.span {...popIn(0.1)} className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Processo
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Da identificação<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-sky-300">
                ao atendimento permanente.
              </span>
            </h2>
            <p className="text-white/45 text-lg mt-5 max-w-md mx-auto">
              Quatro etapas para transformar uma comunidade isolada em ponto de acesso à saúde via satélite.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.12)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
                className="relative flex flex-col"
              >
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                    className="hidden lg:block absolute top-10 left-[calc(100%-12px)] w-6 h-px bg-gradient-to-r from-[#0EA5E9]/50 to-transparent z-10"
                  />
                )}

                <div className="bg-white/5 border border-white/10 hover:border-[#0EA5E9]/40 transition-all rounded-3xl p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-center gap-3">
                    <motion.div
                      {...popIn(0.15 + i * 0.12)}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-sky-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-sky-900/40"
                    >
                      {step.icon}
                    </motion.div>
                    <span className="text-[#0EA5E9]/40 font-black text-2xl leading-none">{step.num}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-black text-base mb-2">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>

                  {step.cta && (
                    <Link
                      to={step.cta.href}
                      className="inline-flex items-center gap-1.5 text-[#0EA5E9] text-xs font-bold hover:underline mt-1"
                    >
                      {step.cta.label} <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.5)} className="text-center mt-14">
            <Link
              to="/regioes"
              className="inline-flex items-center gap-2 bg-[#0EA5E9] text-white px-9 py-4 rounded-full font-bold text-base hover:bg-sky-600 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.40)]"
            >
              <MapPin size={18} /> Ver regiões com missões ativas
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CRITÉRIOS
      ══════════════════════════════════════════════════════════════ */}
      <section id="criterios" className="py-28 px-6 bg-sky-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-[1000px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <motion.span {...popIn(0.1)} className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Elegibilidade
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Quais regiões<br />
              <span className="text-[#0EA5E9]">priorizamos?</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              As missões são direcionadas a comunidades com maior vulnerabilidade e menor acesso a serviços de saúde. Os casos mais críticos têm prioridade.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criterios.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0, transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' as const } }}
                whileHover={{ x: 5, transition: { duration: 0.35, ease: 'easeOut' as const } }}
                viewport={{ once: true }}
                className="flex items-start gap-4 bg-white dark:bg-slate-700 p-5 rounded-2xl border border-[#0EA5E9]/10 dark:border-sky-800/30 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={18} className="text-[#0EA5E9]" />
                </div>
                <span className="text-gray-700 dark:text-slate-200 font-medium text-sm leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } }}
            viewport={{ once: true }}
            className="mt-8 bg-white dark:bg-slate-700 border border-[#0EA5E9]/30 rounded-2xl p-6 flex gap-4 items-start shadow-sm"
          >
            <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-[#0EA5E9]" />
            </div>
            <div>
              <p className="font-black text-gray-800 dark:text-slate-100 text-sm mb-1">Sua comunidade não está na lista?</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                Entre em contato pelo formulário de contato ou cadastre sua comunidade na plataforma. Nossa equipe avalia pedidos de inclusão em novas missões e entra em contato com lideranças locais e secretarias de saúde.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PARCEIROS
      ══════════════════════════════════════════════════════════════ */}
      <section id="parceiros" className="py-28 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-[1100px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <motion.span {...popIn(0.1)} className="text-[#0EA5E9] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Rede de apoio
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Para instituições<br />
              <span className="text-[#0EA5E9]">parceiras.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Secretarias de saúde, universidades e provedores de conectividade podem firmar parceria para expandir o alcance das missões.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {parceiros.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const } }}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.35, ease: 'easeOut' as const } }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm text-center cursor-default"
              >
                <div className="w-12 h-12 bg-sky-50 dark:bg-sky-950/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#0EA5E9]">
                  {p.icon}
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-sm mb-2">{p.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} className="text-center">
            <Link
              to="/FormularioContato"
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-[#0EA5E9] text-[#0EA5E9] px-8 py-4 rounded-full font-bold text-base hover:bg-[#0EA5E9] hover:text-white dark:hover:bg-[#0EA5E9] dark:hover:text-white transition-all shadow-sm"
            >
              <Building2 size={18} /> Quero ser parceiro institucional
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-br from-[#0EA5E9] via-sky-500 to-sky-700 relative overflow-hidden">
        <motion.div
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none blur-sm"
        />
        <motion.div
          animate={{ x: [15, -15, 15], y: [8, -8, 8], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/8 -translate-x-1/4 translate-y-1/4 pointer-events-none blur-sm"
        />

        <div className="max-w-[900px] mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Faça parte desta missão.
            </h2>
            <p className="text-sky-100/75 text-xl max-w-lg mx-auto leading-relaxed">
              Como paciente, médico voluntário ou parceiro — há um lugar para você no OrbitalCare.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.1, ease: 'easeOut' as const } }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' as const } }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-7 flex flex-col items-center text-center shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
            >
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-4 text-[#0EA5E9]">
                <Satellite size={26} />
              </div>
              <h3 className="text-lg font-black text-gray-800 mb-2">Preciso de atendimento</h3>
              <p className="text-gray-500 mb-6 leading-relaxed text-xs flex-1">
                Moro em região remota e preciso de uma teleconsulta médica gratuita.
              </p>
              <Link
                to="/consultas"
                className="block w-full bg-[#0EA5E9] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-sky-600 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.35)]"
              >
                Agendar consulta
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' as const } }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' as const } }}
              viewport={{ once: true }}
              className="bg-white/15 backdrop-blur-sm rounded-3xl p-7 flex flex-col items-center text-center border border-white/25"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-white">
                <Users size={26} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Sou médico voluntário</h3>
              <p className="text-white/60 mb-6 leading-relaxed text-xs flex-1">
                Quero atender pacientes em comunidades remotas via telemedicina satelital.
              </p>
              <Link
                to="/cadastro"
                className="block w-full bg-white text-[#0EA5E9] py-3.5 rounded-2xl font-bold text-sm hover:bg-sky-50 transition-all text-center"
              >
                Cadastrar como médico
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' as const } }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' as const } }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-7 flex flex-col items-center text-center border border-white/15"
            >
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-sky-100">
                <Building2 size={26} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Somos uma instituição</h3>
              <p className="text-white/50 mb-6 leading-relaxed text-xs flex-1">
                Secretaria de saúde, universidade ou provedor — firme parceria conosco.
              </p>
              <Link
                to="/FormularioContato"
                className="block w-full bg-white/20 border border-white/30 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-white/30 transition-all text-center"
              >
                Entrar em contato
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.45)} className="text-center mt-10">
            <Link
              to="/regioes"
              className="inline-flex items-center gap-2 text-sky-100/70 font-semibold hover:text-white transition-colors text-sm group"
            >
              <MapPin size={16} className="group-hover:scale-110 transition-transform" />
              Ver mapa de missões ativas →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
