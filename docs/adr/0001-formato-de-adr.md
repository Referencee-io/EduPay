# ADR 0001: Formato de registro de decisiones de arquitectura

## Contexto

Las instrucciones del proyecto (sección 13) exigen documentar cada decisión de
arquitectura relevante como ADR en /docs/adr/.

## Decisión

Cada ADR se numera secuencialmente y sigue el formato: contexto, decisión,
alternativas descartadas, consecuencias. Los ADR nunca se borran; si una
decisión cambia, un nuevo ADR la reemplaza y referencia al anterior.

## Alternativas descartadas

Documentación informal en README o comentarios: se descarta porque no deja
rastro de las alternativas evaluadas ni del momento de la decisión.

## Consecuencias

Cualquier programadora que se incorpore puede reconstruir el porqué de cada
decisión sin preguntar al equipo original.
