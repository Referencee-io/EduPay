/**
 * Capa de abstracción de procesadores de pago (instrucciones sección 7.1).
 * El resto del sistema SOLO conoce esta interfaz; jamás el SDK del procesador.
 * Los adaptadores (Conekta primero; stubs de Openpay y STP) se implementan en Fase 2,
 * consultando la documentación oficial vigente antes de codificar (sección 16).
 */

export interface VirtualClabe {
  clabe: string;
  bankName: string;
  providerReference: string;
}

export interface CheckoutRequest {
  familyId: string;
  amountCents: bigint;
  currency: string;
  description: string;
  successUrl: string;
  failureUrl: string;
}

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  expiresAt: Date;
}

export interface CashRequest {
  familyId: string;
  amountCents: bigint;
  currency: string;
  description: string;
}

export interface CashReference {
  reference: string;
  barcodeUrl: string | null;
  expiresAt: Date;
}

export type ProviderPaymentState = 'pending' | 'paid' | 'failed' | 'refunded' | 'expired';

export interface ProviderPaymentStatus {
  providerPaymentId: string;
  state: ProviderPaymentState;
  amountCents: bigint;
  currency: string;
  paidAt: Date | null;
}

export interface RefundRequest {
  providerPaymentId: string;
  amountCents: bigint;
  reason: string;
}

export interface RefundResult {
  refundId: string;
  state: 'pending' | 'completed' | 'failed';
}

export interface VerifiedEvent {
  provider: string;
  providerEventId: string;
  eventType: string;
  payload: unknown;
}

export class WebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookVerificationError';
  }
}

export interface PaymentProvider {
  createFamilyClabe(familyId: string): Promise<VirtualClabe>;
  createCardCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
  createCashReference(request: CashRequest): Promise<CashReference>;
  getPayment(providerPaymentId: string): Promise<ProviderPaymentStatus>;
  refund(request: RefundRequest): Promise<RefundResult>;
  /** Valida la firma del webhook. Lanza WebhookVerificationError si es inválida. */
  verifyWebhook(payload: unknown, signature: string): VerifiedEvent;
}
