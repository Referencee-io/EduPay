/**
 * Seed de datos realistas para desarrollo (Fase 1).
 * Crea el tenant Instituto JFR, 15 familias con tutores y alumnos ficticios,
 * los cargos del ciclo 2026-2027 (inscripción + colegiaturas de agosto a junio)
 * y algunos pagos SIMULADOS con sus aplicaciones para poder probar
 * el estado de cuenta y el dashboard sin dinero real.
 *
 * Todos los nombres, CURP y teléfonos son ficticios.
 * Ejecutar con: pnpm --filter @plataforma/database seed
 */
import { PrismaClient, EducationLevel, GuardianRelationship } from '@prisma/client';

const prisma = new PrismaClient();

// Tarifas mensuales de colegiatura por nivel, en centavos.
const TUITION_BY_LEVEL: Record<EducationLevel, bigint> = {
  PRESCHOOL: 380000n, // $3,800.00
  PRIMARY: 450000n, // $4,500.00
  SECONDARY: 520000n, // $5,200.00
  HIGH_SCHOOL: 590000n, // $5,900.00
};

const ENROLLMENT_BY_LEVEL: Record<EducationLevel, bigint> = {
  PRESCHOOL: 550000n,
  PRIMARY: 650000n,
  SECONDARY: 750000n,
  HIGH_SCHOOL: 850000n,
};

// Ciclo escolar 2026-2027: colegiaturas de agosto 2026 a junio 2027, vencen el día 10.
const CYCLE_MONTHS = [
  '2026-08',
  '2026-09',
  '2026-10',
  '2026-11',
  '2026-12',
  '2027-01',
  '2027-02',
  '2027-03',
  '2027-04',
  '2027-05',
  '2027-06',
] as const;

const MONTH_NAMES: Record<string, string> = {
  '01': 'Enero',
  '02': 'Febrero',
  '03': 'Marzo',
  '04': 'Abril',
  '05': 'Mayo',
  '06': 'Junio',
  '08': 'Agosto',
  '09': 'Septiembre',
  '10': 'Octubre',
  '11': 'Noviembre',
  '12': 'Diciembre',
};

const LEVEL_LABEL: Record<EducationLevel, string> = {
  PRESCHOOL: 'Preescolar',
  PRIMARY: 'Primaria',
  SECONDARY: 'Secundaria',
  HIGH_SCHOOL: 'Preparatoria',
};

interface SeedStudent {
  firstName: string;
  lastName: string;
  level: EducationLevel;
  grade: string;
  group: string;
  scholarshipBps?: number;
}

interface SeedFamily {
  displayName: string;
  guardians: Array<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    relationship: GuardianRelationship;
    isPrimary: boolean;
    rfc?: string;
  }>;
  students: SeedStudent[];
}

// 15 familias ficticias con distribución realista: la mayoría con 1-2 hijos,
// algunas con 3 (caso clave: saldo consolidado y pago que cubre a hermanos).
const FAMILIES: SeedFamily[] = [
  {
    displayName: 'Familia García Hernández',
    guardians: [
      {
        firstName: 'María Fernanda',
        lastName: 'Hernández López',
        phone: '442 111 0001',
        email: 'mafer.hdz@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
        rfc: 'HELM850312AB1',
      },
      {
        firstName: 'Jorge',
        lastName: 'García Ramírez',
        phone: '442 111 0002',
        email: 'jorge.garcia@example.com',
        relationship: 'FATHER',
        isPrimary: false,
      },
    ],
    students: [
      {
        firstName: 'Santiago',
        lastName: 'García Hernández',
        level: 'PRIMARY',
        grade: '3',
        group: 'A',
      },
      {
        firstName: 'Valentina',
        lastName: 'García Hernández',
        level: 'PRIMARY',
        grade: '1',
        group: 'B',
      },
      {
        firstName: 'Emilio',
        lastName: 'García Hernández',
        level: 'PRESCHOOL',
        grade: '2',
        group: 'A',
      },
    ],
  },
  {
    displayName: 'Familia Martínez Torres',
    guardians: [
      {
        firstName: 'Alejandra',
        lastName: 'Torres Méndez',
        phone: '442 111 0003',
        email: 'ale.torres@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
    ],
    students: [
      {
        firstName: 'Regina',
        lastName: 'Martínez Torres',
        level: 'SECONDARY',
        grade: '2',
        group: 'A',
        scholarshipBps: 2500,
      },
    ],
  },
  {
    displayName: 'Familia López Suárez',
    guardians: [
      {
        firstName: 'Ricardo',
        lastName: 'López Cano',
        phone: '442 111 0004',
        email: 'ricardo.lopez@example.com',
        relationship: 'FATHER',
        isPrimary: true,
        rfc: 'LOCR790620XY9',
      },
      {
        firstName: 'Daniela',
        lastName: 'Suárez Ortiz',
        phone: '442 111 0005',
        email: 'dani.suarez@example.com',
        relationship: 'MOTHER',
        isPrimary: false,
      },
    ],
    students: [
      {
        firstName: 'Mateo',
        lastName: 'López Suárez',
        level: 'HIGH_SCHOOL',
        grade: '1',
        group: 'A',
      },
      { firstName: 'Camila', lastName: 'López Suárez', level: 'SECONDARY', grade: '3', group: 'B' },
    ],
  },
  {
    displayName: 'Familia Ramírez Peña',
    guardians: [
      {
        firstName: 'Gabriela',
        lastName: 'Peña Villegas',
        phone: '442 111 0006',
        email: 'gaby.pena@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
    ],
    students: [
      { firstName: 'Leonardo', lastName: 'Ramírez Peña', level: 'PRIMARY', grade: '5', group: 'A' },
    ],
  },
  {
    displayName: 'Familia Sánchez Ibarra',
    guardians: [
      {
        firstName: 'Héctor',
        lastName: 'Sánchez Mora',
        phone: '442 111 0007',
        email: 'hector.sanchez@example.com',
        relationship: 'FATHER',
        isPrimary: true,
      },
      {
        firstName: 'Lucía',
        lastName: 'Ibarra Fuentes',
        phone: '442 111 0008',
        email: 'lucia.ibarra@example.com',
        relationship: 'MOTHER',
        isPrimary: false,
      },
    ],
    students: [
      {
        firstName: 'Renata',
        lastName: 'Sánchez Ibarra',
        level: 'PRESCHOOL',
        grade: '3',
        group: 'B',
      },
      { firstName: 'Diego', lastName: 'Sánchez Ibarra', level: 'PRIMARY', grade: '2', group: 'A' },
    ],
  },
  {
    displayName: 'Familia Flores Cabrera',
    guardians: [
      {
        firstName: 'Patricia',
        lastName: 'Cabrera Núñez',
        phone: '442 111 0009',
        email: 'paty.cabrera@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
    ],
    students: [
      {
        firstName: 'Sofía',
        lastName: 'Flores Cabrera',
        level: 'SECONDARY',
        grade: '1',
        group: 'A',
      },
      { firstName: 'Andrés', lastName: 'Flores Cabrera', level: 'PRIMARY', grade: '6', group: 'B' },
    ],
  },
  {
    displayName: 'Familia Gutiérrez Salas',
    guardians: [
      {
        firstName: 'Fernando',
        lastName: 'Gutiérrez Ríos',
        phone: '442 111 0010',
        email: 'fer.gutierrez@example.com',
        relationship: 'FATHER',
        isPrimary: true,
      },
    ],
    students: [
      {
        firstName: 'Ximena',
        lastName: 'Gutiérrez Salas',
        level: 'HIGH_SCHOOL',
        grade: '3',
        group: 'A',
        scholarshipBps: 5000,
      },
    ],
  },
  {
    displayName: 'Familia Domínguez Vega',
    guardians: [
      {
        firstName: 'Carolina',
        lastName: 'Vega Rueda',
        phone: '442 111 0011',
        email: 'caro.vega@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
      {
        firstName: 'Manuel',
        lastName: 'Domínguez Prado',
        phone: '442 111 0012',
        email: 'manuel.dominguez@example.com',
        relationship: 'FATHER',
        isPrimary: false,
      },
    ],
    students: [
      { firstName: 'Iker', lastName: 'Domínguez Vega', level: 'PRIMARY', grade: '4', group: 'A' },
    ],
  },
  {
    displayName: 'Familia Castillo Reyes',
    guardians: [
      {
        firstName: 'Verónica',
        lastName: 'Reyes Campos',
        phone: '442 111 0013',
        email: 'vero.reyes@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
    ],
    students: [
      {
        firstName: 'Isabella',
        lastName: 'Castillo Reyes',
        level: 'PRESCHOOL',
        grade: '1',
        group: 'A',
      },
    ],
  },
  {
    displayName: 'Familia Morales Ochoa',
    guardians: [
      {
        firstName: 'Raúl',
        lastName: 'Morales Tapia',
        phone: '442 111 0014',
        email: 'raul.morales@example.com',
        relationship: 'FATHER',
        isPrimary: true,
      },
      {
        firstName: 'Silvia',
        lastName: 'Ochoa Bernal',
        phone: '442 111 0015',
        email: 'silvia.ochoa@example.com',
        relationship: 'MOTHER',
        isPrimary: false,
      },
    ],
    students: [
      {
        firstName: 'Emiliano',
        lastName: 'Morales Ochoa',
        level: 'SECONDARY',
        grade: '3',
        group: 'A',
      },
      {
        firstName: 'Julieta',
        lastName: 'Morales Ochoa',
        level: 'SECONDARY',
        grade: '1',
        group: 'B',
      },
    ],
  },
  {
    displayName: 'Familia Herrera Ponce',
    guardians: [
      {
        firstName: 'Adriana',
        lastName: 'Ponce Lira',
        phone: '442 111 0016',
        email: 'adriana.ponce@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
    ],
    students: [
      { firstName: 'Tadeo', lastName: 'Herrera Ponce', level: 'PRIMARY', grade: '1', group: 'A' },
    ],
  },
  {
    displayName: 'Familia Ríos Zamora',
    guardians: [
      {
        firstName: 'Ernesto',
        lastName: 'Ríos Alanís',
        phone: '442 111 0017',
        email: 'ernesto.rios@example.com',
        relationship: 'FATHER',
        isPrimary: true,
      },
    ],
    students: [
      {
        firstName: 'Victoria',
        lastName: 'Ríos Zamora',
        level: 'HIGH_SCHOOL',
        grade: '2',
        group: 'B',
      },
      { firstName: 'Rodrigo', lastName: 'Ríos Zamora', level: 'PRIMARY', grade: '6', group: 'A' },
    ],
  },
  {
    displayName: 'Familia Aguilar Montes',
    guardians: [
      {
        firstName: 'Claudia',
        lastName: 'Montes Serna',
        phone: '442 111 0018',
        email: 'claudia.montes@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
      {
        firstName: 'Óscar',
        lastName: 'Aguilar Deloya',
        phone: '442 111 0019',
        email: 'oscar.aguilar@example.com',
        relationship: 'FATHER',
        isPrimary: false,
      },
    ],
    students: [
      {
        firstName: 'Mariana',
        lastName: 'Aguilar Montes',
        level: 'PRIMARY',
        grade: '2',
        group: 'B',
      },
    ],
  },
  {
    displayName: 'Familia Navarro Quintana',
    guardians: [
      {
        firstName: 'Rosa María',
        lastName: 'Quintana Bravo',
        phone: '442 111 0020',
        email: 'rosa.quintana@example.com',
        relationship: 'GRANDPARENT',
        isPrimary: true,
      },
    ],
    students: [
      {
        firstName: 'Sebastián',
        lastName: 'Navarro Quintana',
        level: 'SECONDARY',
        grade: '2',
        group: 'B',
      },
    ],
  },
  {
    displayName: 'Familia Cervantes Ávila',
    guardians: [
      {
        firstName: 'Laura',
        lastName: 'Ávila Cordero',
        phone: '442 111 0021',
        email: 'laura.avila@example.com',
        relationship: 'MOTHER',
        isPrimary: true,
      },
    ],
    students: [
      {
        firstName: 'Ana Paula',
        lastName: 'Cervantes Ávila',
        level: 'PRESCHOOL',
        grade: '2',
        group: 'B',
      },
      {
        firstName: 'Bruno',
        lastName: 'Cervantes Ávila',
        level: 'PRESCHOOL',
        grade: '3',
        group: 'A',
      },
    ],
  },
];

// CURP ficticias con formato válido (entidad QT = Querétaro).
function fakeCurp(index: number): string {
  const consonants = 'BCDFGHJKLMNPRSTVZ';
  const c = (n: number): string => consonants[n % consonants.length]!;
  const day = String((index % 27) + 1).padStart(2, '0');
  return `GA${c(index)}M1503${day.charAt(0) === '0' ? day : '12'}HQT${c(index)}${c(index + 3)}${c(index + 7)}A${index % 10}`;
}

function normalizePhone(input: string): string {
  return `+52${input.replace(/\D/g, '')}`;
}

function applyBps(amount: bigint, bps: number): bigint {
  const discount = (amount * BigInt(bps) + 9999n) / 10000n;
  return amount - discount;
}

async function main(): Promise<void> {
  console.log('Sembrando datos del Instituto JFR...');

  // Idempotente: limpia y vuelve a sembrar (SOLO desarrollo).
  await prisma.paymentApplication.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.paymentEvent.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.student.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.family.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.tenant.deleteMany();

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Instituto JFR',
      slug: 'instituto-jfr',
      rvoe: 'RVOE-QRO-DEMO-001',
      rfc: 'IJF190101AB1',
    },
  });

  let studentCounter = 0;

  for (let f = 0; f < FAMILIES.length; f++) {
    const seedFamily = FAMILIES[f]!;
    const family = await prisma.family.create({
      data: {
        tenantId: tenant.id,
        familyCode: `FAM-${String(f + 1).padStart(4, '0')}`,
        displayName: seedFamily.displayName,
        guardians: {
          create: seedFamily.guardians.map((g) => ({
            tenantId: tenant.id,
            firstName: g.firstName,
            lastName: g.lastName,
            phoneE164: normalizePhone(g.phone),
            email: g.email,
            relationship: g.relationship,
            isPrimary: g.isPrimary,
            rfc: g.rfc ?? null,
          })),
        },
      },
    });

    for (const s of seedFamily.students) {
      studentCounter += 1;
      const student = await prisma.student.create({
        data: {
          tenantId: tenant.id,
          familyId: family.id,
          firstName: s.firstName,
          lastName: s.lastName,
          curp: fakeCurp(studentCounter),
          enrollmentId: `JFR-2026-${String(studentCounter).padStart(4, '0')}`,
          educationLevel: s.level,
          grade: s.grade,
          groupName: s.group,
          scholarshipBps: s.scholarshipBps ?? 0,
        },
      });

      const levelLabel = LEVEL_LABEL[s.level];

      // Cargo de inscripción: venció el 15 de julio de 2026, SIEMPRE separado de colegiatura.
      await prisma.charge.create({
        data: {
          tenantId: tenant.id,
          familyId: family.id,
          studentId: student.id,
          conceptType: 'ENROLLMENT',
          description: `Inscripción ciclo 2026-2027, ${s.grade}º de ${levelLabel}`,
          amountCents: applyBps(ENROLLMENT_BY_LEVEL[s.level], s.scholarshipBps ?? 0),
          dueDate: new Date('2026-07-15'),
          status: 'ISSUED',
          period: '2026-2027',
        },
      });

      // Colegiaturas del ciclo: agosto 2026 a junio 2027, vencen el día 10.
      for (const month of CYCLE_MONTHS) {
        const [year, mm] = month.split('-') as [string, string];
        await prisma.charge.create({
          data: {
            tenantId: tenant.id,
            familyId: family.id,
            studentId: student.id,
            conceptType: 'TUITION',
            description: `Colegiatura ${MONTH_NAMES[mm]} ${year}, ${s.grade}º de ${levelLabel}`,
            amountCents: applyBps(TUITION_BY_LEVEL[s.level], s.scholarshipBps ?? 0),
            dueDate: new Date(`${year}-${mm}-10`),
            // A fecha del seed (julio 2026) las colegiaturas aún no se emiten.
            status: 'SCHEDULED',
            period: month,
          },
        });
      }
    }
  }

  // Pagos SIMULADOS: tres familias ya pagaron su inscripción (pago manual de prueba).
  // Demuestra el ledger: el pago se aplica vía PaymentApplication, nunca toca el cargo directo.
  const paidFamilies = await prisma.family.findMany({
    where: { familyCode: { in: ['FAM-0001', 'FAM-0004', 'FAM-0009'] } },
  });

  for (const family of paidFamilies) {
    const enrollmentCharges = await prisma.charge.findMany({
      where: { familyId: family.id, conceptType: 'ENROLLMENT', status: 'ISSUED' },
      orderBy: { dueDate: 'asc' },
    });
    const total = enrollmentCharges.reduce((sum, c) => sum + c.amountCents, 0n);

    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          tenantId: tenant.id,
          familyId: family.id,
          amountCents: total,
          method: 'MANUAL',
          status: 'CONFIRMED',
          paidAt: new Date('2026-07-01T10:00:00-06:00'),
        },
      });

      for (const charge of enrollmentCharges) {
        await tx.paymentApplication.create({
          data: {
            paymentId: payment.id,
            chargeId: charge.id,
            amountCents: charge.amountCents,
          },
        });
        await tx.charge.update({
          where: { id: charge.id },
          data: { status: 'PAID' },
        });
      }

      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          actorType: 'system',
          action: 'payment.applied',
          entityType: 'Payment',
          entityId: payment.id,
          newValue: {
            familyCode: family.familyCode,
            amountCents: total.toString(),
            charges: enrollmentCharges.length,
          },
          reason: 'Seed de desarrollo: pago simulado de inscripción',
        },
      });
    });
  }

  const counts = {
    families: await prisma.family.count(),
    guardians: await prisma.guardian.count(),
    students: await prisma.student.count(),
    charges: await prisma.charge.count(),
    payments: await prisma.payment.count(),
  };
  console.log(
    `Listo: ${counts.families} familias, ${counts.guardians} tutores, ${counts.students} alumnos, ${counts.charges} cargos, ${counts.payments} pagos simulados.`,
  );
}

main()
  .catch((error) => {
    console.error('Error al sembrar datos:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
