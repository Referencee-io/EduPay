/**
 * Máquinas de estados del dominio financiero (instrucciones sección 6.2).
 * Las transiciones inválidas lanzan InvalidTransitionError y deben registrarse
 * en AuditLog por la capa de servicio que las invoque.
 */

export type ChargeStatus =
  'SCHEDULED' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';

export type InvoiceStatus = 'PENDING' | 'STAMPED' | 'FAILED' | 'CANCELLED';

/** Error de dominio tipado (sección 13): nunca strings sueltos. */
export class InvalidTransitionError extends Error {
  public readonly entity: string;
  public readonly from: string;
  public readonly to: string;

  constructor(entity: string, from: string, to: string) {
    super(`Transición inválida en ${entity}: ${from} → ${to}`);
    this.name = 'InvalidTransitionError';
    this.entity = entity;
    this.from = from;
    this.to = to;
  }
}

/**
 * Charge: scheduled → issued → (partially_paid) → paid,
 * con ramas a overdue y cancelled.
 */
const CHARGE_TRANSITIONS: Record<ChargeStatus, readonly ChargeStatus[]> = {
  SCHEDULED: ['ISSUED', 'CANCELLED'],
  ISSUED: ['PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'],
  PARTIALLY_PAID: ['PAID', 'OVERDUE', 'CANCELLED'],
  // Un cargo vencido puede recibir pagos (parcial o total) o condonarse.
  OVERDUE: ['PARTIALLY_PAID', 'PAID', 'CANCELLED'],
  PAID: [],
  CANCELLED: [],
};

/** Payment: pending → confirmed, con ramas a failed y refunded. */
const PAYMENT_TRANSITIONS: Record<PaymentStatus, readonly PaymentStatus[]> = {
  PENDING: ['CONFIRMED', 'FAILED'],
  CONFIRMED: ['REFUNDED'],
  FAILED: [],
  REFUNDED: [],
};

/** Invoice: pending → stamped, con ramas a failed y cancelled. */
const INVOICE_TRANSITIONS: Record<InvoiceStatus, readonly InvoiceStatus[]> = {
  PENDING: ['STAMPED', 'FAILED', 'CANCELLED'],
  // Un timbrado fallido puede reintentarse (vuelve a PENDING) o cancelarse.
  FAILED: ['PENDING', 'CANCELLED'],
  STAMPED: ['CANCELLED'],
  CANCELLED: [],
};

function assertTransition<S extends string>(
  entity: string,
  table: Record<S, readonly S[]>,
  from: S,
  to: S,
): S {
  const allowed = table[from];
  if (!allowed || !allowed.includes(to)) {
    throw new InvalidTransitionError(entity, from, to);
  }
  return to;
}

export function transitionCharge(from: ChargeStatus, to: ChargeStatus): ChargeStatus {
  return assertTransition('Charge', CHARGE_TRANSITIONS, from, to);
}

export function transitionPayment(from: PaymentStatus, to: PaymentStatus): PaymentStatus {
  return assertTransition('Payment', PAYMENT_TRANSITIONS, from, to);
}

export function transitionInvoice(from: InvoiceStatus, to: InvoiceStatus): InvoiceStatus {
  return assertTransition('Invoice', INVOICE_TRANSITIONS, from, to);
}

export function canTransitionCharge(from: ChargeStatus, to: ChargeStatus): boolean {
  return CHARGE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  return PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionInvoice(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return INVOICE_TRANSITIONS[from]?.includes(to) ?? false;
}
