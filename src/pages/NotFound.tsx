import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 py-20 text-center bg-white dark:bg-slate-900">
      <div className="w-24 h-24 rounded-3xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
        <Compass size={56} className="animate-pulse" />
      </div>

      <h1 className="text-7xl font-black text-gray-800 dark:text-white">404</h1>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-slate-200">
          O sinal não chegou até aqui
        </h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
          A página que você procura não existe, foi movida ou está fora da
          área de cobertura orbital. Verifique o endereço e tente novamente.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-2xl transition-colors"
      >
        <Home size={18} /> Voltar ao início
      </Link>
    </main>
  );
}
