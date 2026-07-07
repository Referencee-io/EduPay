# ADR 0004: Prisma fijado en la versión mayor 6

## Contexto

Al validar el esquema (julio 2026) se detectó que Prisma 7 ya está publicado e
introduce cambios incompatibles: la propiedad `url` del datasource desaparece
del schema.prisma y la configuración de conexión migra a prisma.config.ts.
Las instrucciones del proyecto exigen Prisma con migraciones versionadas pero
no fijan versión mayor.

## Decisión

El proyecto fija `prisma` y `@prisma/client` en `^6.x`. La migración a Prisma 7
se evaluará como tarea explícita al final de la Fase 1, con su propio ADR.

## Alternativas descartadas

Adoptar Prisma 7 desde ahora: el ecosistema de adaptadores y la documentación
de NestJS + Prisma 7 aún están madurando, y arrancar el motor financiero sobre
una versión mayor recién liberada agrega riesgo sin beneficio para el MVP.

## Consecuencias

Al actualizar a Prisma 7 habrá que mover DATABASE_URL a prisma.config.ts y
revisar la instanciación de PrismaClient. El cambio queda acotado al paquete
@plataforma/database porque es el único punto de acceso a Prisma.
