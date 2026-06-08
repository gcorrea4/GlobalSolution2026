import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#0B090B] pt-[60px] px-[5%] pb-[20px] relative text-white font-sans mt-auto w-full box-border">

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0EA5E9]/60 via-30% via-sky-400/40 via-50% via-[#0EA5E9]/60 via-70% to-transparent opacity-70"></div>

      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[40px]">

        {/* 1. OrbitalCare */}
        <div className="flex flex-col items-start">
          <h3 className="text-[#0EA5E9] text-[1.3rem] mt-0 mb-[15px] font-bold">
            OrbitalCare
          </h3>
          <p className="text-white/60 leading-[1.6] text-[0.9rem] m-0">
            Conectando médicos e pacientes em regiões remotas via telemedicina por satélite.
          </p>
          <Link
            to="/consultas"
            className="mt-[20px] text-[#0EA5E9] text-[0.95rem] font-bold tracking-[0.5px] transition-colors hover:text-sky-400 hover:underline"
          >
            Agendar consulta →
          </Link>
        </div>

        {/* 2. Navegação */}
        <div className="flex flex-col items-start">
          <h4 className="text-white text-[1.1rem] mt-0 mb-[20px] uppercase tracking-[1px] font-bold">Navegação</h4>
          <ul className="flex flex-col gap-[12px] p-0 m-0 list-none text-left">
            <li><Link to="/"            className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Início</Link></li>
            <li><Link to="/sobre"       className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Sobre o Projeto</Link></li>
            <li><Link to="/integrantes" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Integrantes</Link></li>
            <li><Link to="/apolonias"   className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Missões de Saúde</Link></li>
            <li><Link to="/consultas"   className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Consultas</Link></li>
            <li><Link to="/regioes"     className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Regiões Atendidas</Link></li>
            <li><Link to="/faq"         className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">FAQ</Link></li>
            <li><Link to="/contato"     className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Contato</Link></li>
            <li><Link to="/login"       className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Login</Link></li>
          </ul>
        </div>

        {/* 3. Legal */}
        <div className="flex flex-col items-start">
          <h4 className="text-white text-[1.1rem] mt-0 mb-[20px] uppercase tracking-[1px] font-bold">Legal</h4>
          <ul className="flex flex-col gap-[12px] p-0 m-0 list-none text-left">
            <li><a href="#" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Termos de Uso</a></li>
            <li><a href="#" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Política de Privacidade</a></li>
          </ul>
        </div>

        {/* 4. Links */}
        <div className="flex flex-col items-start">
          <h4 className="text-white text-[1.1rem] mt-0 mb-[20px] uppercase tracking-[1px] font-bold">Links</h4>
          <ul className="flex flex-col gap-[12px] p-0 m-0 list-none text-left">
            <li><a href="https://www.fiap.com.br" target="_blank" rel="noreferrer" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">FIAP</a></li>
            <li><Link to="/integrantes" className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Equipe do Projeto</Link></li>
            <li><Link to="/cadastro"    className="text-white/60 text-[0.95rem] transition-colors hover:text-[#0EA5E9]">Cadastro</Link></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/10 pt-[20px] text-center text-white/40 text-[0.85rem]">
        <p className="m-0">&copy; 2026 OrbitalCare — Global Solution FIAP 2026/1. Projeto acadêmico sem fins lucrativos.</p>
      </div>
    </footer>
  );
}
