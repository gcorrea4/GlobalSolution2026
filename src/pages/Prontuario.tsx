import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Activity, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../utils/api';

type EstadoCarga = 'carregando' | 'pronto' | 'erro';

export function Prontuario() {
  // Rota dinamica identificada por ID unico do paciente (/prontuario/:id)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [estado, setEstado] = useState<EstadoCarga>('carregando');

  useEffect(() => {
    if (!id) return; // sem id nao ha o que buscar; tratado em estadoFinal
    let ativo = true;

    apiFetch(`/pacientes/${id}`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => {
        if (!ativo) return;
        if (data?.nome) {
          setNome(data.nome);
          setEstado('pronto');
        } else {
          setEstado('erro');
        }
      })
      .catch(err => {
        console.error(`Erro ao carregar prontuário do paciente ${id}:`, err);
        if (ativo) setEstado('erro');
      });

    return () => { ativo = false; };
  }, [id]);

  // URL sem id valido cai direto no estado de erro, sem setState no efeito.
  const estadoFinal: EstadoCarga = !id ? 'erro' : estado;

  return (
    <main className="min-h-screen bg-slate-950 p-8 pt-[100px] font-sans flex justify-center transition-colors duration-300">
      <div className="bg-slate-900 w-full max-w-2xl p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 dark:text-slate-400 hover:text-sky-500 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>

        {estadoFinal === 'carregando' && (
          <p className="text-slate-400 font-medium animate-pulse">Carregando prontuário…</p>
        )}

        {estadoFinal === 'erro' && (
          <div className="flex items-start gap-4 bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h2 className="text-lg font-bold text-red-300">Prontuário não encontrado</h2>
              <p className="text-sm text-red-200/80 mt-1">
                Não foi possível carregar os dados deste paciente. Verifique o
                identificador ou tente novamente mais tarde.
              </p>
            </div>
          </div>
        )}

        {estadoFinal === 'pronto' && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center font-black text-2xl">
                {nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">{nome}</h2>
                <p className="text-gray-500 dark:text-slate-400 font-medium flex items-center gap-2">
                  <FileText size={16} /> Prontuário Digital Ativo
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/40 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-gray-700 dark:text-slate-200 flex items-center gap-2">
                <Activity size={18} className="text-sky-500" /> Observações Clínicas
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Dados carregados dinamicamente para o paciente <strong>{nome}</strong> (ID {id}).
                Esta tela utiliza o identificador único de rota para localizar o
                beneficiário no banco de dados Java/DDD.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
