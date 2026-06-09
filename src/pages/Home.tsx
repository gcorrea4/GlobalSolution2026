import { Link } from 'react-router-dom';
import { Activity, Users, MapPin, ArrowRight, Satellite, ChevronDown } from 'lucide-react';

export function Home() {
  const metrics = [
    { value: '2.500+', label: 'Teleconsultas realizadas', icon: <Activity size={20} /> },
    { value: '350+',   label: 'Médicos voluntários',     icon: <Users    size={20} /> },
    { value: '180+',   label: 'Regiões atendidas',       icon: <MapPin   size={20} /> },
  ];

  const steps = [
    {
      num: '01',
      title: 'Cadastre-se',
      desc: 'Informe sua localização e necessidade clínica. O sistema identifica sua região de cobertura satelital automaticamente.',
    },
    {
      num: '02',
      title: 'Triagem & Conexão',
      desc: 'O algoritmo avalia urgência clínica e disponibilidade para conectar você ao médico voluntário mais adequado.',
    },
    {
      num: '03',
      title: 'Teleconsulta',
      desc: 'Realize a consulta por vídeo via satélite, direto do seu município — sem precisar viajar centenas de quilômetros.',
    },
  ];

  return (
    <main className="bg-[#030712] text-white font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-20 w-full">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[5px] mb-8 flex items-center gap-2">
            <Satellite size={13} /> Telemedicina via Satélite
          </p>

          <h1
            className="font-black tracking-tight leading-[0.92] mb-8"
            style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
          >
            <span className="block text-white">Saúde onde</span>
            <span className="block text-sky-500">o sinal chega.</span>
          </h1>

          <p className="text-slate-300 text-xl max-w-lg mb-10 leading-relaxed">
            Conectamos médicos voluntários a pacientes em regiões remotas via telemedicina por satélite — gratuito, ágil e inteligente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/cadastro"
              className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-4 rounded-lg text-base transition-colors"
            >
              <Activity size={18} /> Preciso de Atendimento
            </Link>
            <Link
              to="/cadastro"
              className="inline-flex items-center justify-center gap-2 border border-white/40 hover:border-white text-white font-bold px-8 py-4 rounded-lg text-base transition-colors hover:bg-white/5"
            >
              <Users size={18} /> Sou Médico Voluntário
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/25 pointer-events-none">
          <span className="text-[9px] tracking-[4px] uppercase">Explorar</span>
          <ChevronDown size={15} className="animate-bounce" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MÉTRICAS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#0a0f1e] border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center text-center py-8 md:py-0 relative w-full"
            >
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-slate-700" />
              )}
              <div className="text-sky-500 mb-3">{m.icon}</div>
              <p className="text-5xl font-black text-white tracking-tight mb-1">{m.value}</p>
              <p className="text-slate-400 text-sm font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          COMO FUNCIONA
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#030712] py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-4">
            Simples assim
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-20 max-w-lg">
            Do cadastro à teleconsulta em 3 passos.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-slate-800">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 border-slate-800 last:border-b-0"
              >
                {/* Watermark */}
                <p className="text-[6rem] font-black text-sky-500/[0.06] leading-none select-none absolute -top-2 right-0 md:right-4">
                  {step.num}
                </p>
                <div className="relative z-10">
                  <p className="text-sky-500 text-xs font-black uppercase tracking-widest mb-5">
                    {step.num}
                  </p>
                  <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t border-slate-800 text-center">
            <Link
              to="/consultas"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Agendar teleconsulta <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DEPOIMENTO
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#0a0f1e] border-y border-slate-800 py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sky-500 font-black text-7xl leading-none mb-6 select-none">"</p>
          <p className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-8">
            A teleconsulta via OrbitalCare foi a única forma de eu ter acesso a um médico aqui no interior.
          </p>
          <div className="w-12 h-px bg-slate-700 mx-auto mb-5" />
          <p className="text-slate-400 text-sm font-semibold tracking-wide">
            Maria, 43 anos — Marabá, PA
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#030712] py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-6">
            Faça parte
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Saúde não pode ser<br />
            <span className="text-sky-500">privilégio geográfico.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Seja como paciente ou médico voluntário, você pode transformar vidas em regiões onde a saúde ainda é distante.
          </p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-10 py-4 rounded-lg text-lg transition-colors"
          >
            Começar agora <ArrowRight size={20} />
          </Link>
          <div className="mt-8">
            <Link
              to="/sobre"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Conheça o projeto →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
