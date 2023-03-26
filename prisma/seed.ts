// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// init prisma client
const prisma = new PrismaClient();

async function main() {
  // create two dummy users one of type manager and the other of type admin
  const user1 = await prisma.user.upsert({
    where: { email: 'manager@gmail.com' },
    update: {},
    create: {
      email: 'manager@gmail.com',
      password: '123',
      cin: 'kbf45849',
      firstName: 'admin',
      lastName: 'test',
      roles: 'MANAGER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: '123',
      cin: 'k45849',
      firstName: 'admin',
      lastName: 'test',
      roles: 'ADMIN',
    },
  });

  console.log(user1, user2);
}

// execute the main function

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
