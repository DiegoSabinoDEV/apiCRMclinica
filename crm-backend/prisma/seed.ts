import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@harmonny.com';
  const password = process.env.ADMIN_PASSWORD ?? 'TroqueEstaSenha123!';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'admin',
      active: true,
    },
    create: {
      name: 'Administrador Harmonny',
      email,
      passwordHash,
      role: 'admin',
      active: true,
    },
  });

  const services = [
    'Botox',
    'Preenchimento Labial',
    'Bioestimuladores de Colágeno',
    'Fios de PDO',
    'Harmonização Facial',
    'Limpeza de Pele',
    'Criomodelação',
    'Drenagem Linfática',
  ];

  for (const name of services) {
    await prisma.service.upsert({
      where: { name },
      update: { active: true },
      create: {
        name,
        category: 'estetica',
        durationMinutes: 45,
        active: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
