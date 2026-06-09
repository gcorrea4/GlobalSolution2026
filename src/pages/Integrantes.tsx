import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Users } from 'lucide-react';
import fotoCorrea from '../img/foto-correa.jpg';
import fotoEric from '../img/foto-eric.jpg';
import fotoKay from '../img/foto-kay.jpg';

interface Integrante {
  nome: string;
  foto: string;
  objectPosition: string;
  rm: string;
  turma: string;
  github: string;
  linkedin: string;
  papel: string;
}

const integrantes: Integrante[] = [
  {
    nome: 'Gabriel Correa Souza',
    foto: fotoCorrea,
    objectPosition: 'center 45%',
    rm: 'RM567903',
    turma: '1TDSPB',
    github: 'https://github.com/gcorrea4/',
    linkedin: 'https://www.linkedin.com/in/gabriel-correa-souza-763135271/',
    papel: 'Frontend & IA',
  },
  {
    nome: 'Eric Maciel Martins',
    foto: fotoEric,
    objectPosition: 'center 18%',
    rm: 'RM567398',
    turma: '1TDSPB',
    github: 'https://github.com/Eric-devops-tech',
    linkedin: 'https://www.linkedin.com/in/eric-maciel-144058389//',
    papel: 'Python & Banco de Dados',
  },
  {
    nome: 'Kayque Duarte',
    foto: fotoKay,
    objectPosition: 'center 25%',
    rm: 'RM567980',
    turma: '1TDSPB',
    github: 'https://github.com/Kayque2012',
    linkedin: 'https://www.linkedin.com/in/kayque-duarte-b24313361/',
    papel: 'Java & Business Model',
  },
];

export function Integrantes() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0A1628] pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0EA5E9]/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#0EA5E9]/20 text-[#0EA5E9] text-sm font-bold px-4 py-2 rounded-full mb-6 border border-[#0EA5E9]/20"
          >
            <Users size={15} /> Equipe do Projeto
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Integrantes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Conheça a equipe responsável pelo desenvolvimento do OrbitalCare — Global Solution FIAP 2026/1.
          </motion.p>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrantes.map((integrante, index) => (
            <motion.div
              key={integrante.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-sky-200 dark:hover:border-sky-700/60 transition-all duration-300 overflow-hidden group"
            >
              {/* Foto */}
              <div className="relative h-72 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                <img
                  src={integrante.foto}
                  alt={`Foto de ${integrante.nome}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: integrante.objectPosition }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-[#0EA5E9]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  {integrante.papel}
                </span>
              </div>

              {/* Info compacta */}
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight truncate">
                    {integrante.nome}
                  </h3>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 font-medium">
                    {integrante.rm} · {integrante.turma}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={integrante.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`GitHub de ${integrante.nome}`}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900 dark:bg-slate-700 text-white hover:bg-gray-700 dark:hover:bg-slate-600 transition-colors"
                  >
                    <GitBranch size={15} />
                  </a>
                  <a
                    href={integrante.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`LinkedIn de ${integrante.nome}`}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0077B5] text-white hover:bg-[#006097] transition-colors"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nota de projeto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 rounded-3xl p-10"
        >
          <p className="text-sky-700 dark:text-sky-400 font-bold text-lg mb-2">Global Solution FIAP 2026/1</p>
          <p className="text-gray-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Projeto desenvolvido no curso de Análise e Desenvolvimento de Sistemas. Tema: <strong>Economia Espacial — Telemedicina e Saúde em Regiões Isoladas via Satélite.</strong>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
