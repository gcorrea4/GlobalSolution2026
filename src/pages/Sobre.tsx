import { motion } from 'framer-motion';
import { Zap, Database, Globe, Bot, Layers, Satellite, Signal, Activity, Shield } from 'lucide-react';
import fiap from '../img/fiap.jpeg';

export function Sobre() {
  const tecnologias = [
    { icon: <Zap size={22} />,      titulo: 'React + TypeScript',  desc: 'Interface moderna, responsiva e tipada com Tailwind CSS v4 e Framer Motion.' },
    { icon: <Layers size={22} />,   titulo: 'Java / Quarkus',      desc: 'Backend robusto com API REST, transações atômicas e Oracle JDBC.' },
    { icon: <Database size={22} />, titulo: 'Oracle Database',      desc: 'Banco relacional na nuvem com soft-delete e histórico de atendimentos.' },
    { icon: <Bot size={22} />,      titulo: 'Gemini AI',            desc: 'Integração com Gemini para triagem inteligente e assistência clínica.' },
    { icon: <Globe size={22} />,    titulo: 'Azure + Vercel',       desc: 'Backend hospedado no Azure, frontend publicado na Vercel via GitHub Actions.' },
    { icon: <Satellite size={22} />, titulo: 'Conectividade Satelital', desc: 'Infraestrutura de comunicação via satélite para regiões sem acesso a internet convencional.' },
  ];

  const diferenciais = [
    { icon: <Signal size={22} />,   titulo: 'Cobertura Universal',  desc: 'Funciona em qualquer região do Brasil, mesmo sem 4G ou fibra óptica, usando conectividade via satélite de baixa latência.' },
    { icon: <Activity size={22} />, titulo: 'Triagem por IA',       desc: 'Algoritmo que prioriza casos por urgência clínica, distância do serviço de saúde e disponibilidade de médicos voluntários.' },
    { icon: <Shield size={22} />,   titulo: 'Dados Seguros',        desc: 'Prontuário digital criptografado, em conformidade com a LGPD e padrões do CFM para telemedicina.' },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0A1628] pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0EA5E9]/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0EA5E9]/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#0EA5E9]/20 text-[#0EA5E9] text-sm font-bold px-4 py-2 rounded-full mb-6 border border-[#0EA5E9]/20"
          >
            <Layers size={15} /> Sobre o Projeto
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            OrbitalCare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Uma plataforma de telemedicina via satélite para conectar médicos voluntários a pacientes em regiões remotas do Brasil — desenvolvida na FIAP por alunos de ADS.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* ── Ideia + Projeto ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              emoji: '💡',
              titulo: 'A Ideia',
              texto: 'Mais de 33 milhões de brasileiros vivem em municípios com menos de um médico por mil habitantes. Em regiões remotas, ribeirinhas e indígenas, o acesso a qualquer serviço de saúde exige deslocamentos de centenas de quilômetros. O OrbitalCare nasce para eliminar essa barreira geográfica usando conectividade satelital e telemedicina como pilares tecnológicos.',
            },
            {
              emoji: '🚀',
              titulo: 'O Projeto',
              texto: 'Nossa plataforma é um web app de triagem e gestão de teleconsultas. Um algoritmo de priorização conecta pacientes remotos a médicos voluntários disponíveis, considerando urgência clínica e cobertura satelital. Os médicos recebem uma fila ordenada e realizam consultas por vídeo em tempo real — integrado com IA para suporte clínico e prontuário digital.',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 border-t-4 border-t-sky-500"
            >
              <span className="text-3xl mb-4 block">{card.emoji}</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{card.titulo}</h3>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm">{card.texto}</p>
            </motion.div>
          ))}
        </section>

        {/* ── Diferenciais ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-black text-sky-500 uppercase tracking-widest">Inovação</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">Diferenciais da Solução</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {diferenciais.map((d, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-sky-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex gap-4 items-start"
              >
                <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/30 text-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  {d.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">{d.titulo}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Tecnologias ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-black text-sky-500 uppercase tracking-widest">Stack</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">Tecnologias Utilizadas</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tecnologias.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-sky-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex gap-4 items-start"
              >
                <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/30 text-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">{tech.titulo}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Roadmap ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-black text-sky-500 uppercase tracking-widest">Desenvolvimento</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">Roadmap da Global Solution</h2>
          </motion.div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-slate-700" />
            <div className="space-y-5">
              {[
                { num: '1', titulo: 'Fase 1 — Concepção', desc: 'Definição do problema, pesquisa sobre telemedicina satelital no Brasil e planejamento da arquitetura da solução.' },
                { num: '2', titulo: 'Fase 2 — Backend', desc: 'Desenvolvimento do backend em Java/Quarkus, modelagem do banco Oracle e implementação das regras de negócio para teleconsultas.' },
                { num: '3', titulo: 'Fase 3 — Frontend', desc: 'Construção da interface React com TypeScript, integração com a API e implementação do mapa de regiões remotas com Leaflet.' },
                { num: '4', titulo: 'Fase 4 — Integração (Atual)', desc: 'Integração completa frontend-backend, testes, IA de triagem e preparação da solução para apresentação final da GS 2026.', atual: true },
              ].map((sprint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative flex gap-6"
                >
                  <div className={`relative z-10 w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm shadow-sm ${
                    sprint.atual ? 'bg-sky-500 text-white shadow-sky-200' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400'
                  }`}>
                    {sprint.num}
                  </div>
                  <div className={`flex-1 p-5 rounded-2xl border mb-1 ${
                    sprint.atual
                      ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/50'
                      : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
                  }`}>
                    <p className={`font-black text-sm mb-1 ${sprint.atual ? 'text-sky-700 dark:text-sky-400' : 'text-gray-700 dark:text-slate-200'}`}>
                      {sprint.titulo}
                    </p>
                    <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{sprint.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FIAP Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <img
            src={fiap}
            alt="Logo FIAP"
            className="w-full max-w-[400px] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
          />
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-4 text-center">Projeto desenvolvido para a Global Solution FIAP 2026/1</p>
        </motion.div>

      </div>
    </main>
  );
}
