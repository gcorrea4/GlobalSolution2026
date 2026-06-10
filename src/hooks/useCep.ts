import { useState, useEffect } from 'react';

interface CepDados {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface UseCepReturn {
  dados: CepDados | null;
  loading: boolean;
  erro: string;
}

interface ResultadoCep {
  cep: string;
  dados: CepDados | null;
  erro: string;
}

export function useCep(cep: string): UseCepReturn {
  const cepLimpo = cep.replace(/\D/g, '');
  const cepValido = cepLimpo.length === 8;

  const [resultado, setResultado] = useState<ResultadoCep | null>(null);

  useEffect(() => {
    if (!cepValido) return;
    let cancelado = false;

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .then(res => res.json())
      .then(data => {
        if (cancelado) return;
        if (data.erro) {
          setResultado({ cep: cepLimpo, dados: null, erro: 'CEP não encontrado.' });
        } else {
          setResultado({
            cep: cepLimpo,
            dados: { logradouro: data.logradouro, bairro: data.bairro, localidade: data.localidade, uf: data.uf },
            erro: '',
          });
        }
      })
      .catch(() => {
        if (!cancelado) setResultado({ cep: cepLimpo, dados: null, erro: 'Erro ao buscar o CEP. Verifique sua conexão.' });
      });

    return () => { cancelado = true; };
  }, [cepLimpo, cepValido]);

  // Estado derivado em vez de setState sincrono no efeito (evita cascading
  // renders). Comportamento identico ao anterior: enquanto um CEP valido nao
  // tiver resultado proprio, loading=true; CEP incompleto nao expoe resultado
  // anterior (dados=null, erro=''). A flag `cancelado` ainda descarta respostas
  // de CEPs antigos quando o usuario continua digitando.
  const resolvido = cepValido && resultado?.cep === cepLimpo ? resultado : null;

  return {
    dados: resolvido ? resolvido.dados : null,
    loading: cepValido && !resolvido,
    erro: resolvido ? resolvido.erro : '',
  };
}
