import { describe, it, expect } from 'vitest';
import { calcularSLA } from '../utils/sla';

function horasAtras(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

describe('calcularSLA — faixas de nível', () => {
  it('24h → ok (verde)', () => {
    const r = calcularSLA(horasAtras(24));
    expect(r.nivel).toBe('ok');
    expect(r.cor).toContain('green');
  });

  it('47h → ok (borda inferior de atenção)', () => {
    expect(calcularSLA(horasAtras(47)).nivel).toBe('ok');
  });

  it('49h → atencao (logo acima de 48h)', () => {
    const r = calcularSLA(horasAtras(49));
    expect(r.nivel).toBe('atencao');
    expect(r.cor).toContain('yellow');
  });

  it('72h → atencao (meio da faixa)', () => {
    expect(calcularSLA(horasAtras(72)).nivel).toBe('atencao');
  });

  it('95h → atencao (borda superior de atenção)', () => {
    expect(calcularSLA(horasAtras(95)).nivel).toBe('atencao');
  });

  it('97h → critico (logo acima de 96h)', () => {
    const r = calcularSLA(horasAtras(97));
    expect(r.nivel).toBe('critico');
    expect(r.cor).toContain('red');
  });

  it('120h → critico', () => {
    expect(calcularSLA(horasAtras(120)).nivel).toBe('critico');
  });
});

describe('calcularSLA — labels', () => {
  it('< 1h → "Aberto há menos de 1 hora"', () => {
    expect(calcularSLA(horasAtras(0)).label).toBe('Aberto há menos de 1 hora');
  });

  it('1.5h → "Aberto há 1 hora" (singular)', () => {
    expect(calcularSLA(horasAtras(1.5)).label).toBe('Aberto há 1 hora');
  });

  it('3h → "Aberto há 3 horas" (plural)', () => {
    expect(calcularSLA(horasAtras(3)).label).toBe('Aberto há 3 horas');
  });

  it('72h → "Aberto há 3 dias" (plural)', () => {
    expect(calcularSLA(horasAtras(72)).label).toBe('Aberto há 3 dias');
  });

  it('24h → "Aberto há 1 dia" (singular)', () => {
    expect(calcularSLA(horasAtras(24)).label).toBe('Aberto há 1 dia');
  });
});
