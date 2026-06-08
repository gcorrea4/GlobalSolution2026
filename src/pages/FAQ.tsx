import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [aberto, setAberto] = useState<number | null>(0);

  const perguntas = [
    {
      pergunta: 'O que é o OrbitalCare?',
      resposta:
        'O OrbitalCare é um projeto acadêmico desenvolvido por alunos de Análise e Desenvolvimento de Sistemas da FIAP para a Global Solution 2026/1. A plataforma conecta médicos voluntários a pacientes em regiões remotas do Brasil via telemedicina por satélite, eliminando a barreira geográfica no acesso à saúde.',
    },
    {
      pergunta: 'Qual problema ele resolve?',
      resposta:
        'Mais de 33 milhões de brasileiros vivem em municípios com déficit crítico de médicos. Em regiões rurais, indígenas e ribeirinhas, consultas médicas exigem deslocamentos de centenas de quilômetros. O OrbitalCare usa conectividade via satélite para levar teleconsultas diretamente a essas comunidades, de forma gratuita e acessível.',
    },
    {
      pergunta: 'Como funciona a conexão via satélite?',
      resposta:
        'A plataforma se integra com infraestrutura de conectividade satelital (LEO/GEO) para garantir acesso à internet em regiões sem cobertura 3G/4G ou fibra. Terminais satelitais compactos são instalados nas comunidades, permitindo videochamadas com qualidade suficiente para teleconsultas médicas mesmo em áreas remotas.',
    },
    {
      pergunta: 'Quais tecnologias foram utilizadas?',
      resposta:
        'O OrbitalCare usa React + TypeScript no frontend, Java/Quarkus no backend, Oracle Database para persistência e integração com a API Gemini para triagem inteligente. O mapa de regiões usa Leaflet.js e a autenticação é baseada em JWT com controle de roles (admin, médico, paciente).',
    },
    {
      pergunta: 'O sistema já está em operação?',
      resposta:
        'Atualmente o OrbitalCare é um MVP funcional desenvolvido para a Global Solution FIAP 2026/1. Ele serve como prova de conceito e demonstra como a tecnologia espacial e a telemedicina podem ser combinadas para resolver um problema real de saúde pública no Brasil.',
    },
    {
      pergunta: 'Como posso me cadastrar como médico voluntário?',
      resposta:
        'Acesse a página de Cadastro, selecione o perfil "Médico" e preencha seus dados profissionais, incluindo CRM e especialidade. Após a validação das credenciais pela equipe, você terá acesso ao painel de médico para aceitar teleconsultas de pacientes em regiões remotas.',
    },
    {
      pergunta: 'Pacientes de qualquer região podem usar o serviço?',
      resposta:
        'Sim, o serviço é voltado prioritariamente para pacientes em municípios com baixa cobertura de serviços de saúde, especialmente zonas rurais, comunidades indígenas e áreas ribeirinhas. O algoritmo de triagem prioriza automaticamente regiões com maior déficit de acesso.',
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#0EA5E9] via-sky-500 to-sky-700 pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <HelpCircle size={15} /> Perguntas Frequentes
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Como podemos ajudar?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sky-100 text-lg max-w-xl mx-auto"
          >
            Tudo que você precisa saber sobre o OrbitalCare e a telemedicina via satélite.
          </motion.p>
        </div>
      </div>

      {/* ── Accordion ── */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-3">
          {perguntas.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setAberto(aberto === index ? null : index)}
                className={`w-full text-left px-6 py-5 font-bold flex items-center justify-between gap-4 transition-all duration-200 ${
                  aberto === index
                    ? 'bg-[#0EA5E9] text-white shadow-lg shadow-sky-200'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700'
                } rounded-2xl`}
              >
                <span className="text-base leading-snug flex items-center gap-3">
                  <span className={`text-sm font-black opacity-50 w-5 flex-shrink-0 ${aberto === index ? 'text-white' : 'text-sky-500'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.pergunta}
                </span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 transition-transform duration-300 ${aberto === index ? 'rotate-180 text-white' : 'text-gray-400 dark:text-slate-500'}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {aberto === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 bg-sky-50 dark:bg-sky-950/30 rounded-b-2xl border-x border-b border-sky-100 dark:border-sky-900/40 text-gray-600 dark:text-slate-300 leading-relaxed text-[15px]">
                      {item.resposta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center bg-gradient-to-br from-gray-50 dark:from-slate-800 to-sky-50/40 dark:to-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl p-10"
        >
          <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/40 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ainda tem dúvidas?</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Nossa equipe está pronta para ajudar você.</p>
          <a
            href="/contato"
            className="inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-sky-600 text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-md shadow-sky-200"
          >
            Fale com o suporte
          </a>
        </motion.div>
      </div>
    </main>
  );
}
