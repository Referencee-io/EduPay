import { describe, it, expect } from 'vitest';
import {
  transitionCharge,
  transitionPayment,
  transitionInvoice,
  canTransitionCharge,
  InvalidTransitionError,
} from '../src/state-machines';
import { formatCentsMXN, parseAmountToCents, applyScholarshipBps } from '../src/money';
import { isValidCurp, isValidRfc, normalizePhoneMxE164, isValidClabe } from '../src/validation';

describe('Máquina de estados: Charge', () => {
  it('permite el flujo feliz scheduled → issued → partially_paid → paid', () => {
    expect(transitionCharge('SCHEDULED', 'ISSUED')).toBe('ISSUED');
    expect(transitionCharge('ISSUED', 'PARTIALLY_PAID')).toBe('PARTIALLY_PAID');
    expect(transitionCharge('PARTIALLY_PAID', 'PAID')).toBe('PAID');
  });

  it('permite que un cargo vencido reciba pagos', () => {
    expect(transitionCharge('OVERDUE', 'PARTIALLY_PAID')).toBe('PARTIALLY_PAID');
    expect(transitionCharge('OVERDUE', 'PAID')).toBe('PAID');
  });

  it('rechaza pagar un cargo cancelado', () => {
    expect(() => transitionCharge('CANCELLED', 'PAID')).toThrow(InvalidTransitionError);
  });

  it('rechaza regresar un cargo pagado a emitido', () => {
    expect(() => transitionCharge('PAID', 'ISSUED')).toThrow(InvalidTransitionError);
    expect(canTransitionCharge('PAID', 'ISSUED')).toBe(false);
  });

  it('rechaza saltar de scheduled directo a paid', () => {
    expect(() => transitionCharge('SCHEDULED', 'PAID')).toThrow(InvalidTransitionError);
  });
});

describe('Máquina de estados: Payment', () => {
  it('permite pending → confirmed → refunded', () => {
    expect(transitionPayment('PENDING', 'CONFIRMED')).toBe('CONFIRMED');
    expect(transitionPayment('CONFIRMED', 'REFUNDED')).toBe('REFUNDED');
  });

  it('rechaza reembolsar un pago no confirmado', () => {
    expect(() => transitionPayment('PENDING', 'REFUNDED')).toThrow(InvalidTransitionError);
  });

  it('rechaza revivir un pago fallido', () => {
    expect(() => transitionPayment('FAILED', 'CONFIRMED')).toThrow(InvalidTransitionError);
  });
});

describe('Máquina de estados: Invoice', () => {
  it('permite reintentar un timbrado fallido', () => {
    expect(transitionInvoice('PENDING', 'FAILED')).toBe('FAILED');
    expect(transitionInvoice('FAILED', 'PENDING')).toBe('PENDING');
    expect(transitionInvoice('PENDING', 'STAMPED')).toBe('STAMPED');
  });

  it('rechaza timbrar una factura cancelada', () => {
    expect(() => transitionInvoice('CANCELLED', 'STAMPED')).toThrow(InvalidTransitionError);
  });
});

describe('Dinero en centavos', () => {
  it('formatea centavos a pesos mexicanos', () => {
    expect(formatCentsMXN(450000n)).toBe('$4,500.00');
    expect(formatCentsMXN(123456789n)).toBe('$1,234,567.89');
    expect(formatCentsMXN(0n)).toBe('$0.00');
    expect(formatCentsMXN(-9950n)).toBe('-$99.50');
  });

  it('parsea capturas humanas a centavos', () => {
    expect(parseAmountToCents('4500')).toBe(450000n);
    expect(parseAmountToCents('$4,500.00')).toBe(450000n);
    expect(parseAmountToCents('4500.5')).toBe(450050n);
  });

  it('rechaza montos con más de dos decimales o basura', () => {
    expect(() => parseAmountToCents('4500.123')).toThrow();
    expect(() => parseAmountToCents('cuatro mil')).toThrow();
    expect(() => parseAmountToCents('')).toThrow();
  });

  it('aplica beca en puntos base redondeando a favor de la familia', () => {
    // 25% de $4,500.00 = $1,125.00 exactos → paga $3,375.00
    expect(applyScholarshipBps(450000n, 2500)).toBe(337500n);
    // 33.33% de $100.00 = $33.33 (techo) → paga $66.67
    expect(applyScholarshipBps(10000n, 3333)).toBe(6667n);
    expect(applyScholarshipBps(450000n, 0)).toBe(450000n);
    expect(applyScholarshipBps(450000n, 10000)).toBe(0n);
  });
});

describe('Validaciones mexicanas', () => {
  it('valida CURP con formato oficial', () => {
    expect(isValidCurp('GAHM850312HQTRRR09')).toBe(true);
    expect(isValidCurp('XXXX000000XXXXXX00')).toBe(false);
    expect(isValidCurp('GAHM850312')).toBe(false);
  });

  it('valida RFC de persona física y moral', () => {
    expect(isValidRfc('GAHM850312AB1')).toBe(true); // física, 13
    expect(isValidRfc('IJF190101AB1')).toBe(true); // moral, 12
    expect(isValidRfc('NOESUNRFC')).toBe(false);
  });

  it('normaliza teléfonos mexicanos a E.164', () => {
    expect(normalizePhoneMxE164('442 123 4567')).toBe('+524421234567');
    expect(normalizePhoneMxE164('+52 442 123 4567')).toBe('+524421234567');
    expect(normalizePhoneMxE164('52 1 442 123 4567')).toBe('+524421234567');
    expect(normalizePhoneMxE164('123')).toBeNull();
  });

  it('valida CLABE con dígito verificador', () => {
    // CLABE de ejemplo con dígito verificador correcto
    expect(isValidClabe('002010077777777771')).toBe(true);
    expect(isValidClabe('002010077777777770')).toBe(false);
    expect(isValidClabe('12345')).toBe(false);
  });
});
