# ADR 0003: Becas como porcentaje en puntos base aplicado al generar el cargo

## Contexto

Las instrucciones prohíben flotantes en todo cálculo monetario (sección 6.3) y
Student incluye "beca si aplica" sin definir su representación ni el momento de
aplicarla.

## Decisión

La beca se almacena como entero en puntos base (scholarship_bps, 2500 = 25.00%)
y se aplica AL GENERAR el cargo: el Charge nace ya con el monto neto. El
redondeo del descuento es hacia arriba (a favor de la familia).

## Alternativas descartadas

1. Guardar la beca como monto fijo: no sobrevive a cambios de tarifa.
2. Aplicar la beca al momento de pagar: el saldo mostrado al padre no
   coincidiría con lo que debe, violando la fricción cero.
3. Decimal/float para el porcentaje: prohibido por las reglas del ledger.

## Consecuencias

Cambiar la beca de un alumno no altera cargos ya emitidos; solo afecta cargos
futuros. Ajustes a cargos emitidos se hacen por cancelación y reemisión con
auditoría.

## Estado

PENDIENTE DE VALIDACIÓN con el administrador del Instituto JFR.
