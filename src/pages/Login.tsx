import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { Eye, EyeOff, ArrowRight, Loader2, Satellite } from 'lucide-react';

interface LoginFormData {
  email?: string;
  senha?: string;
}

export function Login() {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginFormData>();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [mostrarRedefinicao, setMostrarRedefinicao] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [enviandoRedefinicao, setEnviandoRedefinicao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();
  const jaLogouAntes = sessionStorage.getItem('jaLogouAntes');

  const handleEsqueciSenha = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailDigitado = getValues('email');
    if (!emailDigitado) {
      setMensagem({ texto: 'Digite seu e-mail no campo acima antes de redefinir a senha.', tipo: 'erro' });
      return;
    }
    setMensagem({ texto: '', tipo: '' });
    setNovaSenha('');
    setConfirmarSenha('');
    setMostrarRedefinicao(prev => !prev);
  };

  const handleRedefinirSenha = async () => {
    if (novaSenha.length < 6) {
      setMensagem({ texto: 'A senha deve ter no mínimo 6 caracteres.', tipo: 'erro' });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' });
      return;
    }
    setEnviandoRedefinicao(true);
    try {
      const res = await fetch(`${API_URL}/pacientes/redefinir-senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: getValues('email'), novaSenha }),
      });
      if (res.ok) {
        setMensagem({ texto: 'Senha redefinida com sucesso! Faça login com a nova senha.', tipo: 'sucesso' });
        setMostrarRedefinicao(false);
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        const err = await res.json().catch(() => null);
        setMensagem({ texto: err?.erro || 'Erro ao redefinir senha. Tente novamente.', tipo: 'erro' });
      }
    } catch {
      setMensagem({ texto: 'Erro ao conectar com o servidor.', tipo: 'erro' });
    } finally {
      setEnviandoRedefinicao(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setCarregando(true);
    setMensagem({ texto: '', tipo: '' });
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      });

      if (response.ok) {
        const usuario = await response.json();

        sessionStorage.setItem('userRole', usuario.tipo || 'paciente');
        sessionStorage.setItem('usuarioLogado', usuario.nome);
        sessionStorage.setItem('userId', String(usuario.id || ''));
        if (usuario.token) sessionStorage.setItem('authToken', usuario.token);

        if ((usuario.tipo === 'dentista' || usuario.tipo === 'medico') && usuario.cidade && usuario.cidade !== 'N/A') {
          sessionStorage.setItem('dentistaCidade', usuario.cidade);
          sessionStorage.setItem('medicoCidade', usuario.cidade);
        }

        sessionStorage.setItem('jaLogouAntes', '1');
        setMensagem({ texto: `Bem-vindo(a), ${usuario.nome}!`, tipo: 'sucesso' });

        setTimeout(() => {
          if (usuario.tipo === 'admin') navigate('/dashboard/admin');
          else if (usuario.tipo === 'dentista' || usuario.tipo === 'medico' || usuario.tipo === 'dev') navigate('/dashboard/medico');
          else if (usuario.tipo === 'paciente') navigate('/dashboard/paciente');
          else navigate('/');
        }, 1000);
      } else {
        setMensagem({ texto: 'E-mail ou senha incorretos. Verifique e tente novamente.', tipo: 'erro' });
        setCarregando(false);
      }
    } catch {
      setMensagem({ texto: 'Erro ao conectar com o servidor. Verifique sua conexão.', tipo: 'erro' });
      setCarregando(false);
    }
  };

  const inputBase =
    'w-full px-4 py-3.5 bg-slate-800 border rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors';
  const inputOk  = `${inputBase} border-slate-700 focus:border-sky-500`;
  const inputErr = `${inputBase} border-red-500 focus:border-red-400`;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-20 relative font-sans"
      style={{ background: '#030712' }}
    >
      {/* Fundo espacial */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=60&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-transparent to-[#030712]/80" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-slate-900/95 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Satellite size={20} className="text-sky-500" />
          <span className="font-black text-white text-lg tracking-tight">OrbitalCare</span>
          <span className="text-slate-600 text-sm ml-auto">Telemedicina</span>
        </div>

        {/* Título */}
        <div className="mb-7">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {jaLogouAntes ? 'Bem-vindo de volta!' : 'Acessar conta'}
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Entre para acessar o painel OrbitalCare.
          </p>
        </div>

        {/* Feedback */}
        {mensagem.texto && (
          <div className={`flex items-start gap-3 p-4 rounded-xl mb-6 text-sm font-semibold border ${
            mensagem.tipo === 'erro'
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
          }`}>
            <span className="text-base leading-none">{mensagem.tipo === 'erro' ? '⚠' : '✓'}</span>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* E-mail */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              className={errors.email ? inputErr : inputOk}
              {...register('email', { required: 'O e-mail é obrigatório' })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-300">Senha</label>
              <button
                type="button"
                onClick={handleEsqueciSenha}
                className="text-xs text-sky-500 font-semibold hover:text-sky-400 transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                autoComplete="current-password"
                className={`${errors.senha ? inputErr : inputOk} pr-12`}
                {...register('senha', { required: 'A senha é obrigatória' })}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.senha && (
              <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.senha.message}</p>
            )}
          </div>

          {/* Redefinição de senha */}
          {mostrarRedefinicao && (
            <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl space-y-4">
              <p className="text-sm font-bold text-white">Redefinir senha</p>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Nova Senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={`${inputBase} border-slate-600 focus:border-sky-500`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Confirme a Nova Senha</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={e => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
                  className={`${inputBase} border-slate-600 focus:border-sky-500`}
                />
              </div>
              <button
                type="button"
                onClick={handleRedefinirSenha}
                disabled={enviandoRedefinicao}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {enviandoRedefinicao && <Loader2 size={16} className="animate-spin" />}
                {enviandoRedefinicao ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </div>
          )}

          {/* Botão entrar */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-70 text-white font-bold py-4 rounded-xl text-base transition-colors mt-2"
          >
            {carregando ? (
              <><Loader2 size={20} className="animate-spin" /> Entrando...</>
            ) : (
              <>Entrar <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Links secundários */}
        <div className="mt-7 space-y-3 text-center">
          <p className="text-sm text-slate-500">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-sky-500 font-bold hover:text-sky-400 transition-colors">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
