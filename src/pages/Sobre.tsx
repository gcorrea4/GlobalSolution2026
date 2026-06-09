import { Zap, Database, Globe, Bot, Layers, Satellite, Signal, Activity, Shield } from 'lucide-react';
import fiap from '../img/fiap.jpeg';

export function Sobre() {
  const tecnologias = [
    { icon: <Zap size={18} />,        titulo: 'React + TypeScript',       desc: 'Interface moderna, responsiva e tipada com Tailwind CSS v4.' },
    { icon: <Layers size={18} />,     titulo: 'Java / Quarkus',           desc: 'Backend robusto com API REST, transações atômicas e Oracle JDBC.' },
    { icon: <Database size={18} />,   titulo: 'Oracle Database',          desc: 'Banco relacional na nuvem com soft-delete e histórico de atendimentos.' },
    { icon: <Bot size={18} />,        titulo: 'Gemini AI',                desc: 'Integração com Gemini para triagem inteligente e assistência clínica.' },
    { icon: <Globe size={18} />,      titulo: 'Azure + Vercel',           desc: 'Backend no Azure, frontend publicado na Vercel via GitHub Actions.' },
    { icon: <Satellite size={18} />,  titulo: 'Conectividade Satelital',  desc: 'Comunicação via satélite para regiões sem acesso à internet convencional.' },
  ];

  const diferenciais = [
    {
      icon: <Signal size={20} />,
      titulo: 'Cobertura Universal',
      desc: 'Funciona em qualquer região do Brasil, mesmo sem 4G ou fibra óptica, usando conectividade via satélite de baixa latência.',
    },
    {
      icon: <Activity size={20} />,
      titulo: 'Triagem por IA',
      desc: 'Algoritmo que prioriza casos por urgência clínica, distância do serviço de saúde e disponibilidade de médicos voluntários.',
    },
    {
      icon: <Shield size={20} />,
      titulo: 'Dados Seguros',
      desc: 'Prontuário digital criptografado, em conformidade com a LGPD e padrões do CFM para telemedicina.',
    },
  ];

  const ods = [
    { num: '02', label: 'Fome Zero e Agricultura' },
    { num: '03', label: 'Saúde e Bem-Estar' },
    { num: '08', label: 'Trabalho Decente e Crescimento' },
    { num: '09', label: 'Indústria, Inovação e Infraestrutura' },
    { num: '11', label: 'Cidades e Comunidades Sustentáveis' },
  ];

  const roadmap = [
    { num: '1', titulo: 'Fase 1 — Concepção',        desc: 'Definição do problema, pesquisa sobre telemedicina satelital no Brasil e planejamento da arquitetura.' },
    { num: '2', titulo: 'Fase 2 — Backend',           desc: 'Desenvolvimento em Java/Quarkus, modelagem do banco Oracle e implementação das regras de negócio.' },
    { num: '3', titulo: 'Fase 3 — Frontend',          desc: 'Interface React + TypeScript, integração com a API e mapa de regiões remotas com Leaflet.' },
    { num: '4', titulo: 'Fase 4 — Integração (Atual)', desc: 'Integração completa frontend-backend, IA de triagem e preparação para apresentação final da GS 2026.', atual: true },
  ];

  return (
    <main className="bg-[#030712] text-white font-sans">

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: '60vh' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1920&q=80&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-black/60 to-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pb-16 pt-36 w-full text-center">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[5px] mb-5">
            Sobre o Projeto
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-5">
            OrbitalCare
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Uma plataforma de telemedicina via satélite para conectar médicos voluntários a pacientes em regiões remotas do Brasil — desenvolvida na FIAP por alunos de ADS.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          IDEIA + DADOS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#030712] py-24 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Coluna esquerda — texto editorial */}
          <div>
            <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-8">
              A Ideia
            </p>
            <div className="border-l-2 border-sky-500 pl-6 space-y-5">
              <p className="text-slate-200 text-lg leading-relaxed">
                Mais de <span className="text-white font-bold">33 milhões de brasileiros</span> vivem em municípios com menos de um médico por mil habitantes.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Em regiões remotas, ribeirinhas e indígenas, o acesso a qualquer serviço de saúde exige deslocamentos de centenas de quilômetros. O OrbitalCare nasce para eliminar essa barreira geográfica usando conectividade satelital e telemedicina como pilares tecnológicos.
              </p>
            </div>

            <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mt-14 mb-8">
              O Projeto
            </p>
            <div className="border-l-2 border-slate-700 pl-6 space-y-5">
              <p className="text-slate-400 leading-relaxed">
                Nossa plataforma é um web app de triagem e gestão de teleconsultas. Um algoritmo de priorização conecta pacientes remotos a médicos voluntários disponíveis, considerando urgência clínica e cobertura satelital.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Os médicos recebem uma fila ordenada e realizam consultas por vídeo em tempo real — integrado com IA para suporte clínico e prontuário digital.
              </p>
            </div>
          </div>

          {/* Coluna direita — fatos */}
          <div className="space-y-4">
            {[
              { label: 'Problema',    value: '33M+ brasileiros sem acesso adequado a médicos' },
              { label: 'Solução',     value: 'Teleconsultas via satélite priorizadas por urgência clínica' },
              { label: 'Tecnologia',  value: 'React + Java/Quarkus + Oracle + Gemini AI' },
              { label: 'Alcance',     value: '180+ regiões mapeadas, 12 estados com cobertura' },
              { label: 'Modelo',      value: '100% gratuito para pacientes em regiões remotas' },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-slate-800 rounded-xl p-5 bg-[#0a0f1e]"
              >
                <p className="text-sky-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-slate-200 text-sm font-semibold leading-snug">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DIFERENCIAIS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#0a0f1e] py-24 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-3">Inovação</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-14">
            Diferenciais da Solução
          </h2>

          <div className="divide-y divide-slate-800">
            {diferenciais.map((d, i) => (
              <div key={i} className="flex items-start gap-6 py-8 first:pt-0 last:pb-0">
                <div className="text-sky-500 flex-shrink-0 mt-0.5">{d.icon}</div>
                <div>
                  <h3 className="text-white font-black text-base mb-2">{d.titulo}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TECNOLOGIAS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#030712] py-24 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-3">Stack</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-14">
            Tecnologias Utilizadas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800">
            {tecnologias.map((tech, i) => (
              <div
                key={i}
                className="bg-[#030712] p-7 flex items-start gap-4 hover:bg-[#0a0f1e] transition-colors"
              >
                <div className="text-sky-500 flex-shrink-0 mt-0.5">{tech.icon}</div>
                <div>
                  <h3 className="text-white font-black text-sm mb-1">{tech.titulo}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ROADMAP
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#0a0f1e] py-24 px-6 border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-3">Desenvolvimento</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-14">
            Roadmap da Global Solution
          </h2>

          <div className="relative pl-8 border-l border-slate-800 space-y-0">
            {roadmap.map((fase, i) => (
              <div key={i} className="relative pb-10 last:pb-0">
                {/* Dot */}
                <div className={`absolute -left-[21px] w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                  fase.atual
                    ? 'bg-sky-500 border-sky-500 text-white'
                    : 'bg-[#0a0f1e] border-slate-700 text-slate-500'
                }`}>
                  {fase.num}
                </div>

                <div className={`ml-6 border rounded-xl p-5 ${
                  fase.atual
                    ? 'border-sky-500/30 bg-sky-500/5'
                    : 'border-slate-800 bg-transparent'
                }`}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <p className={`font-black text-sm ${fase.atual ? 'text-sky-400' : 'text-slate-300'}`}>
                      {fase.titulo}
                    </p>
                    {fase.atual && (
                      <span className="text-[9px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{fase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ODS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#030712] py-24 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-500 text-[11px] font-bold uppercase tracking-[4px] mb-3">
            Agenda 2030 — ONU
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            ODS Relacionados
          </h2>
          <p className="text-slate-400 text-sm mb-10 max-w-xl">
            O OrbitalCare contribui diretamente para os Objetivos de Desenvolvimento Sustentável da ONU.
          </p>

          <div className="flex flex-wrap gap-3">
            {ods.map((o) => (
              <div
                key={o.num}
                className="flex items-center gap-3 border border-slate-700 bg-slate-900 rounded-lg px-4 py-3"
              >
                <span className="text-sky-500 font-black text-sm tabular-nums">ODS {o.num}</span>
                <span className="text-slate-300 text-sm">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FIAP
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#0a0f1e] py-20 px-6 text-center">
        <div className="max-w-md mx-auto">
          <img
            src={fiap}
            alt="Logo FIAP"
            className="w-full rounded-xl border border-slate-800 mb-5 opacity-90"
          />
          <p className="text-slate-500 text-sm">
            Projeto desenvolvido para a Global Solution FIAP 2026/1 — Análise e Desenvolvimento de Sistemas
          </p>
        </div>
      </section>

    </main>
  );
}
