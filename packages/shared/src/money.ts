/**
 * Utilidades monetarias. Montos SIEMPRE en centavos como enteros (sección 6.3).
 * Prohibido usar flotantes para dinero en cualquier punto del sistema.
 */

export class InvalidAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAmountError';
  }
}

/** Convierte centavos (bigint) a texto formateado en pesos, ej. 450000n → "$4,500.00" */
export function formatCentsMXN(amountCents: bigint): string {
  const negative = amountCents < 0n;
  const abs = negative ? -amountCents : amountCents;
  const pesos = abs / 100n;
  const cents = abs % 100n;
  const pesosStr = pesos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}$${pesosStr}.${cents.toString().padStart(2, '0')}`;
}

/**
 * Parsea una cantidad capturada por humanos ("4500", "4,500.00", "$4500.5")
 * a centavos. Rechaza más de 2 decimales y valores no numéricos.
 * Útil en la importación por Excel/CSV (sección 11).
 */
export function parseAmountToCents(input: string): bigint {
  const cleaned = input.trim().replace(/[$,\s]/g, '');
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new InvalidAmountError(`Monto inválido: "${input}"`);
  }
  const [wholePart, decimalPart = ''] = cleaned.split('.');
  const cents = decimalPart.padEnd(2, '0');
  const sign = wholePart!.startsWith('-') ? -1n : 1n;
  const whole = wholePart!.replace('-', '');
  return sign * (BigInt(whole) * 100n + BigInt(cents));
}

/** Aplica una beca expresada en puntos base (2500 = 25.00%) redondeando a favor de la familia. */
export function applyScholarshipBps(amountCents: bigint, scholarshipBps: number): bigint {
  if (scholarshipBps < 0 || scholarshipBps > 10000 || !Number.isInteger(scholarshipBps)) {
    throw new InvalidAmountError(`Beca inválida en puntos base: ${scholarshipBps}`);
  }
  const discount = (amountCents * BigInt(scholarshipBps) + 9999n) / 10000n; // techo del descuento
  return amountCents - discount;
}
