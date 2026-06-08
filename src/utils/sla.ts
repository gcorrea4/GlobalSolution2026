export interface SLAResult {
  horas: number;
  label: string;
  nivel: 'ok' | 'atencao' | 'critico';
  cor: string; // classes Tailwind para badge
}

export function calcularSLA(criadoEm: string): SLAResult {
  const horas = (Date.now() - new Date(criadoEm).getTime()) / 3_600_000;

  if (horas < 48) {
    return { horas, label: formatLabel(horas), nivel: 'ok',      cor: 'bg-green-100  text-green-700  dark:bg-green-950/40  dark:text-green-300'  };
  }
  if (horas <= 96) {
    return { horas, label: formatLabel(horas), nivel: 'atencao', cor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300' };
  }
  return   { horas, label: formatLabel(horas), nivel: 'critico', cor: 'bg-red-100    text-red-700    dark:bg-red-950/40    dark:text-red-300'    };
}

function formatLabel(horas: number): string {
  if (horas < 1) return 'Aberto há menos de 1 hora';
  if (horas < 24) {
    const h = Math.floor(horas);
    return `Aberto há ${h} hora${h !== 1 ? 's' : ''}`;
  }
  const dias = Math.floor(horas / 24);
  return `Aberto há ${dias} dia${dias !== 1 ? 's' : ''}`;
}
