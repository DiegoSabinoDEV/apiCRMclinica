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
    { name: 'Botox', retouchDaysMin: 120, retouchDaysMax: 180 },
    { name: 'Preenchimento Labial', retouchDaysMin: 180, retouchDaysMax: 365 },
    { name: 'Bioestimuladores de Colágeno', retouchDaysMin: 180, retouchDaysMax: 365 },
    { name: 'Fios de PDO', retouchDaysMin: 180, retouchDaysMax: 365 },
    { name: 'Harmonização Facial', retouchDaysMin: 180, retouchDaysMax: 365 },
    { name: 'Limpeza de Pele', retouchDaysMin: 30, retouchDaysMax: 60 },
    { name: 'Criomodelação', retouchDaysMin: 30, retouchDaysMax: 60 },
    { name: 'Drenagem Linfática', retouchDaysMin: 15, retouchDaysMax: 30 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {
        active: true,
        retouchDaysMin: service.retouchDaysMin,
        retouchDaysMax: service.retouchDaysMax,
      },
      create: {
        name: service.name,
        category: 'estetica',
        durationMinutes: 45,
        retouchDaysMin: service.retouchDaysMin,
        retouchDaysMax: service.retouchDaysMax,
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
