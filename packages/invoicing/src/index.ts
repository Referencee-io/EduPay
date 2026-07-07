/**
 * Capa de abstracción de PAC para timbrado CFDI 4.0 con complemento IEDU
 * (instrucciones sección 8). El adaptador concreto (Facturama, FiscalCloud,
 * SW Sapien o equivalente) se implementa en Fase 2, verificando en la web
 * los catálogos y validaciones vigentes del SAT antes de codificar.
 */

export interface IeduData {
  studentFullName: string;
  curp: string;
  educationLevel: string;
  rvoe: string;
  /** RFC del pagador real cuando difiera del receptor (campo rfcPago) */
  payerRfc?: string;
}

export interface StampRequest {
  paymentId: string;
  receiverRfc: string;
  receiverName: string;
  receiverTaxRegime: string;
  receiverZipCode: string;
  cfdiUse: string; // "D10" para colegiaturas
  paymentForm: string; // "03" transferencia, "04" TDC, "28" TDD
  concepts: Array<{
    description: string; // ej. "Colegiatura Septiembre 2026, 3º de Primaria"
    amountCents: bigint;
    iedu?: IeduData;
  }>;
}

export interface StampResult {
  fiscalUuid: string;
  xmlBase64: string;
  pdfBase64: string | null;
}

export interface CancelResult {
  status: 'cancelled' | 'pending' | 'rejected';
}

export interface InvoicingProvider {
  stamp(request: StampRequest): Promise<StampResult>;
  cancel(fiscalUuid: string, reason: string): Promise<CancelResult>;
}
