# ADR 0002: Un tutor pertenece a exactamente una familia

## Contexto

Las instrucciones definen Guardian con "relación con alumnos" sin precisar si
un tutor puede pertenecer a varias familias (caso real: padres divorciados con
hijos en familias de cobro distintas). Ante ambigüedad de regla de negocio, el
protocolo (sección 16) indica implementar la opción más simple y documentarla.

## Decisión

En el MVP, Guardian tiene una relación directa con UNA Family (family_id).
La relación con los alumnos es implícita a través de la familia.

## Alternativas descartadas

Tabla puente Guardian-Family (muchos a muchos): más flexible pero agrega
complejidad a la liga mágica, al consolidado de saldo y a la importación por
Excel sin un caso confirmado que lo requiera.

## Consecuencias

Si el Instituto JFR confirma casos de tutores con hijos en familias separadas,
se migrará a tabla puente con una migración reversible.

## Estado

PENDIENTE DE VALIDACIÓN con el administrador del Instituto JFR.
