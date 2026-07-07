/**
 * Validaciones de datos mexicanos usadas en las fronteras del sistema
 * (importación Excel/CSV, API, timbrado). Zod se usa en los DTOs; estas
 * funciones puras son los bloques que esos esquemas reutilizan.
 */

/**
 * Valida el formato oficial de la CURP (18 caracteres, RENAPO).
 * No verifica contra el registro nacional, solo la estructura:
 * 4 letras, 6 dígitos de fecha, sexo H/M/X, 5 letras de entidad y consonantes,
 * y 2 caracteres de homoclave/dígito verificador.
 * Una CURP inválida bloquea el timbrado del CFDI (sección 8).
 */
const CURP_REGEX =
  /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HMX](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;

export function isValidCurp(curp: string): boolean {
  return CURP_REGEX.test(curp.toUpperCase().trim());
}

/** Valida el formato del RFC (persona física 13 caracteres, moral 12). */
const RFC_REGEX = /^([A-ZÑ&]{3,4})\d{6}[A-Z\d]{3}$/;

export function isValidRfc(rfc: string): boolean {
  return RFC_REGEX.test(rfc.toUpperCase().trim());
}

/**
 * Normaliza un teléfono mexicano a E.164 (sección 6.1).
 * Acepta "442 123 4567", "4421234567", "+52 442 123 4567", "52 4421234567".
 * Devuelve null si no puede normalizarse con confianza.
 */
export function normalizePhoneMxE164(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+52${digits}`;
  if (digits.length === 12 && digits.startsWith('52')) return `+${digits}`;
  // Formato antiguo con "1" tras el 52 (marcación a celular): 521 + 10 dígitos
  if (digits.length === 13 && digits.startsWith('521')) return `+52${digits.slice(3)}`;
  return null;
}

/** Valida una CLABE interbancaria (18 dígitos con dígito verificador). */
export function isValidClabe(clabe: string): boolean {
  const cleaned = clabe.replace(/\s/g, '');
  if (!/^\d{18}$/.test(cleaned)) return false;
  const weights = [3, 7, 1];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += (Number(cleaned[i]) * weights[i % 3]!) % 10;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(cleaned[17]);
}
