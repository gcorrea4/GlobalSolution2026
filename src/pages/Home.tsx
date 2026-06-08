import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Heart, ShieldCheck, Zap,
  Calculator, Users, MessageCircle, MapPin, Star,
  CheckCircle2, ArrowRight, Smile, Layers, Target, Eye,
} from 'lucide-react';
import turmaDoRemHero from '../img/turma-do-bem-hero.jpg';

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

  // ── Dados ──────────────────────────────────────────────────────────────────

  const impactNumbers = [
    { value: '25.000+', label: 'Jovens atendidos',       icon: <Smile    size={26} /> },
    { value: '6.000+',  label: 'Dentistas voluntários',  icon: <Heart    size={26} /> },
    { value: '600+',    label: 'Cidades alcançadas',      icon: <MapPin   size={26} /> },
    { value: '27',      label: 'Anos de impacto',         icon: <Star     size={26} /> },
  ];

  const checklist = [
    'Atendimento 100% gratuito para jovens de 11–17 anos',
    'Dentistas voluntários verificados e credenciados',
    'Triagem por urgência clínica e situação socioeconômica',
    'Presente em mais de 600 cidades brasileiras',
    'Prontuário digital para continuidade do tratamento',
    'Parcerias com universidades e empresas do setor odontológico',
  ];

  const steps = [
    {
      num: '01',
      title: 'Cadastre-se',
      desc: 'Preencha seu perfil com dados socioeconômicos e informações sobre sua necessidade odontológica.',
      orange: true,
    },
    {
      num: '02',
      title: 'Triagem & Match',
      desc: 'Nosso algoritmo avalia urgência, renda e localização para conectar você ao dentista voluntário ideal.',
      orange: false,
    },
    {
      num: '03',
      title: 'Receba Atendimento',
      desc: 'Confirme o horário, compareça à consulta e receba cuidado odontológico gratuito e de qualidade.',
      orange: true,
    },
  ];

  const cards = [
    { num: '1°', icon: <Calculator  size={32} />, title: 'Triagem Inteligente',  desc: 'Algoritmo de priorização para jovens em situação de vulnerabilidade com base em métricas socioeconômicas.', color: 'orange' },
    { num: '2°', icon: <ShieldCheck size={32} />, title: 'Prontuário Digital',   desc: 'Histórico clínico completo e seguro, garantindo que cada atendimento seja registrado e acompanhado.',        color: 'green'  },
    { num: '3°', icon: <Zap         size={32} />, title: 'Match Geográfico',     desc: 'Conectamos dentistas voluntários aos pacientes mais próximos através de mapas de calor reais.',                color: 'orange' },
    { num: '4°', icon: <Heart       size={32} />, title: 'Impacto Direto',       desc: 'Sua doação via PIX financia kits de higiene e tratamentos complexos como canais e próteses.',                  color: 'green'  },
    { num: '5°', icon: <Users       size={32} />, title: 'Rede de Voluntariado', desc: 'Faça parte da maior rede de voluntariado especializado do mundo, presente em todo o Brasil.',                   color: 'orange' },
    { num: '6°', icon: <MessageCircle size={32} />, title: 'Suporte e Contato', desc: 'Canais diretos de comunicação com a sede da TdB em São Paulo para tirar dúvidas em tempo real.',              color: 'green'  },
  ];

  // ── Animações reutilizáveis ─────────────────────────────────────────────────
  const fadeUp   = (delay = 0) => ({ initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });
  const fadeLeft = (delay = 0) => ({ initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });
  const fadeRight= (delay = 0) => ({ initial: { opacity: 0, x:  30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } });

  return (
    <main className="bg-[#F5F5DC] dark:bg-slate-900 text-[#333333] dark:text-slate-100 font-sans overflow-x-hidden transition-colors duration-300">

      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-slow { 0%,100%{opacity:.15} 50%{opacity:.3} }
        .pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-screen flex flex-col justify-center items-center text-center pt-20 box-border bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.52), rgba(0,0,0,0.82)), url('${turmaDoRemHero}')` }}
      >
        {/* Badge de credibilidade */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-[11px] font-bold px-4 py-2 rounded-full tracking-wide uppercase text-center">
            🏆 Maior rede de voluntariado especializado do mundo
          </span>
        </motion.div>

        <div className="relative z-10 max-w-[860px] px-5 pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            className="text-white text-[2.25rem] sm:text-5xl md:text-[3.8rem] font-black leading-[1.1] mb-6"
          >
            Todo jovem merece<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#FFD700]">
              um sorriso saudável.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="text-[#E0E0E0] text-lg md:text-[1.2rem] mb-10 leading-[1.75] max-w-[660px] mx-auto"
          >
            Conectamos jovens de <strong className="text-white">11 a 17 anos</strong> em vulnerabilidade social a
            dentistas voluntários — de forma gratuita, ágil e inteligente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.38 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/cadastro"
              className="bg-[#FF8C00] text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-[#E67E22] transition-all shadow-[0_4px_24px_rgba(255,140,0,0.45)] flex items-center gap-2 justify-center"
            >
              <Heart size={20} /> Preciso de Atendimento
            </Link>
            <Link
              to="/cadastro"
              className="bg-transparent border-2 border-white text-white px-8 py-4 text-lg font-bold rounded-full hover:bg-white hover:text-[#333] transition-all flex items-center gap-2 justify-center"
            >
              <Users size={20} /> Sou Dentista Voluntário
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-5"
          >
            <Link to="/sobre" className="text-white/45 text-sm hover:text-white/75 transition-colors hover:underline underline-offset-2">
              Conheça o projeto →
            </Link>
          </motion.div>
        </div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/35 text-[10px] tracking-[3px] uppercase">role para ver mais</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          NÚMEROS DE IMPACTO  (fundo preto)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0B090B] py-16">
        {/* linha dourada decorativa */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#FFAF00]/50 to-transparent mb-16" />

        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {impactNumbers.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FF8C00]/10 flex items-center justify-center text-[#FF8C00]">
                {item.icon}
              </div>
              <span className="text-white text-4xl font-black leading-none">{item.value}</span>
              <span className="text-white/45 text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#FFAF00]/30 to-transparent mt-16" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MISSÃO  (fundo bege)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-[1150px] mx-auto flex flex-col lg:flex-row gap-20 items-center">

          {/* Texto */}
          <motion.div {...fadeLeft()} className="flex-1">
            <span className="text-[#FF8C00] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Nossa missão
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.12] mb-6">
              Saúde bucal não pode<br /> ser{' '}
              <span className="text-[#FF8C00]">privilégio.</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-5">
              No Brasil, milhões de jovens de baixa renda <strong className="text-gray-700 dark:text-slate-200">nunca visitaram um dentista</strong>. Cáries, dores e infecções comprometem não só o sorriso — mas a autoestima, o aprendizado e o futuro.
            </p>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-9">
              A <strong className="text-gray-800 dark:text-slate-200">Turma do Bem</strong> conecta esses jovens (11–17 anos) a dentistas voluntários de forma gratuita, usando tecnologia para priorizar os casos mais urgentes.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-[#FF8C00] font-bold text-lg group"
            >
              Entenda o projeto
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Checklist */}
          <motion.div {...fadeRight(0.1)} className="flex-1 flex flex-col gap-3">
            {checklist.map((item, i) => (
              <motion.div
                key={i}
                {...fadeRight(i * 0.07)}
                className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-orange-100 dark:hover:border-orange-800/60 transition-all"
              >
                <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                <span className="text-gray-700 dark:text-slate-200 font-medium text-sm md:text-base">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COMO FUNCIONA  (fundo preto)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#0B090B] relative overflow-hidden">
        {/* Orbs decorativos */}
        <div className="pulse-slow absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FF8C00]/8" />
        <div className="pulse-slow absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FF8C00]/5" />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <span className="text-[#FF8C00] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Simples assim
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Do cadastro ao atendimento<br />
              <span className="text-[#FF8C00]">em 3 passos.</span>
            </h2>
            <p className="text-white/45 text-lg mt-5 max-w-md mx-auto">
              Sem burocracia. Sem custo. Com tecnologia para chegar a quem mais precisa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-10 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px bg-gradient-to-r from-[#FF8C00]/20 via-[#FF8C00] to-[#FF8C00]/20" />

            {steps.map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.15)} className="relative flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-7 relative z-10 transition-all
                  ${step.orange
                    ? 'bg-[#FF8C00] text-white shadow-[0_0_30px_rgba(255,140,0,0.35)]'
                    : 'bg-white/8 text-white border-2 border-[#FF8C00]/40'
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
              to="/cadastro"
              className="inline-flex items-center gap-2 bg-[#FF8C00] text-white px-9 py-4 rounded-full font-bold text-lg hover:bg-[#E67E22] transition-all shadow-[0_4px_24px_rgba(255,140,0,0.35)]"
            >
              Começar agora <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CARROSSEL  (fundo bege)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 mb-14 gap-6">
          <motion.div {...fadeLeft()} className="max-w-2xl">
            <span className="text-[#FF8C00] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              A plataforma
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white tracking-tight">
              O que entregamos{' '}
              <span className="text-[#FF8C00]">de verdade.</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">
              Nossa plataforma automatiza processos complexos para focar no que importa: o sorriso dos jovens.
            </p>
          </motion.div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all bg-white dark:bg-slate-800 shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all bg-white dark:bg-slate-800 shadow-sm"
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
              className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[32px] min-w-[320px] md:min-w-[420px] snap-start border border-gray-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-orange-200 dark:hover:border-orange-700/60 hover:shadow-[0_8px_30px_rgba(255,140,0,0.10)] transition-all duration-300"
            >
              {/* Número fantasma */}
              <div className="absolute -right-4 -top-8 text-[8rem] font-black text-gray-50 dark:text-slate-700 group-hover:scale-110 transition-transform pointer-events-none select-none">
                {card.num.replace('°', '')}
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-colors ${card.color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
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
          NOSSOS PROGRAMAS  (fundo bege)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F5F5DC] dark:bg-slate-900">
        <div className="max-w-[1100px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-[#FF8C00] text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Nossas iniciativas
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Nossos <span className="text-[#FF8C00]">Programas</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Dentista do Bem */}
            <motion.div
              {...fadeLeft(0.1)}
              className="bg-white dark:bg-slate-800 rounded-[32px] p-10 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-[0_8px_30px_rgba(255,140,0,0.12)] hover:border-orange-200 dark:hover:border-orange-700/60 transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-6 text-[#FF8C00]">
                <Heart size={28} />
              </div>
              <span className="text-[#FF8C00] text-xs font-bold uppercase tracking-[2px] mb-2">Jovens de 11 a 17 anos</span>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4">Dentista do Bem</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-base flex-1">
                Atendimento odontológico voluntário para jovens em situação de vulnerabilidade social, garantindo continuidade do tratamento até os 18 anos no consultório particular do dentista voluntário.
              </p>
              <Link
                to="/sobre"
                className="mt-8 inline-flex items-center gap-2 text-[#FF8C00] font-bold group"
              >
                Saiba mais <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Card Apolônias do Bem */}
            <motion.div
              {...fadeRight(0.1)}
              className="bg-white dark:bg-slate-800 rounded-[32px] p-10 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] hover:border-violet-200 dark:hover:border-violet-700/60 transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-6 text-violet-600 dark:text-violet-400">
                <ShieldCheck size={28} />
              </div>
              <span className="text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-[2px] mb-2">Mulheres em Situação de Vulnerabilidade</span>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4">Apolônias do Bem</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-base flex-1">
                Tratamento completo e gratuito para mulheres vítimas de violência doméstica que tiveram a dentição afetada por agressões, devolvendo dignidade e empregabilidade.
              </p>
              <Link
                to="/apolonias"
                className="mt-8 inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold group"
              >
                Saiba mais <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TECNOLOGIA QUE CENTRALIZA  (fundo preto)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#0B090B] relative overflow-hidden">
        <div className="pulse-slow absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-500/5" />
        <div className="pulse-slow absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#FF8C00]/5" />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-violet-400 text-xs font-bold uppercase tracking-[3px] mb-5 block">
              Diferencial técnico
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Fila de Triagem <span className="text-violet-400">Inteligente</span>
            </h2>
            <p className="text-white/50 text-lg max-w-[640px] mx-auto leading-relaxed">
              Substituímos a triagem manual fragmentada por WhatsApp e e-mail por um sistema de tickets rastreáveis com priorização automatizada por gravidade, idade e vulnerabilidade.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Layers size={28} />, title: 'Gateway Centralizado', desc: 'Um único ponto de entrada para todos os canais de solicitação, eliminando fragmentação.' },
              { icon: <Target size={28} />, title: 'Score TdB Determinístico', desc: 'Algoritmo que pontua casos por gravidade clínica, faixa etária e índice de vulnerabilidade.' },
              { icon: <Eye   size={28} />, title: 'Timeline Pública',       desc: 'Paciente acompanha cada etapa do atendimento em tempo real, sem depender de ligações.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.12)}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-violet-400/40 hover:bg-violet-500/5 transition-all duration-300 flex flex-col items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
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
          CTA DUPLO  (gradiente laranja)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-br from-[#FF8C00] via-[#F07A00] to-[#E67E22] relative overflow-hidden">
        {/* Orbs decorativos */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/8 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-[1000px] mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Faça parte dessa história.
            </h2>
            <p className="text-white/75 text-xl max-w-lg mx-auto leading-relaxed">
              Seja como paciente ou como voluntário, você pode transformar vidas — incluindo a sua.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Card paciente */}
            <motion.div
              {...fadeLeft(0.1)}
              className="bg-white rounded-3xl p-9 flex flex-col items-center text-center shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 text-[#FF8C00]">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Preciso de atendimento</h3>
              <p className="text-gray-500 mb-7 leading-relaxed text-sm">
                Tenho entre 11 e 17 anos e preciso de cuidado odontológico gratuito e de qualidade.
              </p>
              <Link
                to="/cadastro"
                className="block w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#E67E22] transition-all shadow-[0_4px_15px_rgba(255,140,0,0.3)]"
              >
                Quero me cadastrar
              </Link>
            </motion.div>

            {/* Card dentista */}
            <motion.div
              {...fadeRight(0.1)}
              className="bg-white/15 backdrop-blur-sm rounded-3xl p-9 flex flex-col items-center text-center border border-white/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-5 text-white">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Sou dentista voluntário</h3>
              <p className="text-white/65 mb-7 leading-relaxed text-sm">
                Quero usar minha expertise para impactar jovens vulneráveis e fazer parte da maior rede do mundo.
              </p>
              <Link
                to="/cadastro"
                className="block w-full bg-white text-[#FF8C00] py-4 rounded-2xl font-bold text-base hover:bg-orange-50 transition-all"
              >
                Quero ser voluntário
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.25)} className="text-center">
            <Link
              to="/doador"
              className="inline-flex items-center gap-2 text-white/70 font-semibold hover:text-white transition-colors text-base group"
            >
              <Heart size={18} className="group-hover:scale-110 transition-transform" />
              Ou apoie como doador →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
