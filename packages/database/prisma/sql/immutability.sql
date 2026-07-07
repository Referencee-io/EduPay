-- Refuerzo de inmutabilidad a nivel de base de datos (instrucciones secciones 3 y 6).
-- Este script se incorpora a la primera migración generada con prisma migrate dev.
-- AuditLog y PaymentApplication son de solo inserción: cualquier UPDATE o DELETE falla.

CREATE OR REPLACE FUNCTION reject_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'La tabla % es de solo inserción (ledger inmutable)', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_logs_immutable ON audit_logs;
CREATE TRIGGER audit_logs_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();

DROP TRIGGER IF EXISTS payment_applications_immutable ON payment_applications;
CREATE TRIGGER payment_applications_immutable
  BEFORE UPDATE OR DELETE ON payment_applications
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();
