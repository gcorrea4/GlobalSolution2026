import { useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

type ToastTipo = 'sucesso' | 'erro';

interface ToastState {
  texto: string;
  tipo: ToastTipo;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const mostrar = useCallback((texto: string, tipo: ToastTipo = 'sucesso', ms = 4000) => {
    setToast({ texto, tipo });
    setTimeout(() => setToast(null), ms);
  }, []);

  const ToastNode = toast ? (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 w-max max-w-[90vw] animate-fade-in ${
        toast.tipo === 'erro'
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-green-50 text-green-700 border border-green-200'
      }`}
    >
      {toast.tipo === 'erro'
        ? <AlertTriangle size={20} />
        : <CheckCircle2 size={20} />}
      {toast.texto}
    </div>
  ) : null;

  return { mostrar, ToastNode };
}
