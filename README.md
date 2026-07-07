# Plataforma de Pagos Escolares

Sistema de cobranza escolar con conciliación y facturación automáticas para el mercado mexicano. Institución piloto: Instituto JFR, Querétaro. Promesa del producto: el administrador sabe en menos de 5 minutos quién pagó, quién debe y qué requiere atención hoy, sin conciliar pagos manualmente y sin capturar facturas.

## Estado actual

Fase 1, incremento 1 completado: monorepo, esquema de datos completo, motor de estados con pruebas, utilidades financieras mexicanas y seeds del Instituto JFR. Las instrucciones completas del proyecto viven en el documento maestro (instrucciones-proyecto-plataforma-pagos-escolares.md) y son la fuente de verdad para cualquier decisión.

## Requisitos

- Node.js 24 LTS
- pnpm 9 o superior (`npm install -g pnpm`)
- Docker Desktop (para Postgres, Redis y MailHog locales)

## Arranque local paso a paso

```bash
# 1. Instalar dependencias de todo el monorepo
pnpm install

# 2. Copiar variables de entorno
cp .env.example .env
cp .env.example packages/database/.env

# 3. Levantar la infraestructura local (Postgres, Redis, MailHog)
docker compose up -d

# 4. Crear la base de datos y aplicar el esquema
pnpm --filter @plataforma/database migrate:dev --name inicial

# 5. Aplicar los triggers de inmutabilidad del ledger
docker exec -i pagos_postgres psql -U plataforma -d pagos_escolares < packages/database/prisma/sql/immutability.sql

# 6. Sembrar datos del Instituto JFR (15 familias, 24 alumnos, cargos del ciclo 2026-2027)
pnpm db:seed

# 7. Explorar los datos visualmente
pnpm db:studio
```

## Verificación del incremento

```bash
pnpm test          # pruebas del motor de estados y utilidades financieras
pnpm lint          # cero warnings permitidos
pnpm --filter @plataforma/database validate   # esquema Prisma válido
```

Con Prisma Studio abierto puedes verificar: 15 familias con saldo por familia (no por alumno), la Familia García Hernández con tres hijos y un solo expediente, cargos de inscripción y once colegiaturas por alumno, y tres pagos simulados aplicados vía el ledger de aplicaciones sin tocar los cargos directamente.

## Estructura

```
/apps            API NestJS y frontends Next.js (próximos incrementos)
/packages
  /database      Esquema Prisma, migraciones, seeds
  /shared        Máquinas de estados, dinero en centavos, validaciones MX, entorno
  /payments      Interfaz PaymentProvider (adaptador Conekta en Fase 2)
  /invoicing     Interfaz InvoicingProvider para CFDI 4.0 + IEDU (Fase 2)
  /ui            Sistema de diseño compartido
/docs/adr        Decisiones de arquitectura
```

## Reglas que este código ya hace cumplir

- Montos en centavos como BigInt; prohibidos los flotantes para dinero.
- Ningún pago modifica un cargo directamente: todo pasa por payment_applications.
- AuditLog y PaymentApplication son de solo inserción, reforzado con triggers de PostgreSQL.
- Transiciones de estado inválidas lanzan InvalidTransitionError tipado.
- Multitenencia: tenant_id en toda entidad financiera desde el día uno.
- Idempotencia de webhooks preparada: unicidad sobre (provider, provider_event_id).
