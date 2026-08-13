import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const wasteTypes = [
    { name: 'General Household Waste', description: 'Everyday non-recyclable household refuse' },
    { name: 'Recyclables', description: 'Plastic, glass, paper, and metal recyclables' },
    { name: 'Organic Waste', description: 'Food scraps, garden waste, and other compostables' },
    { name: 'Electronic Waste', description: 'Old electronics, batteries, and appliances' },
    { name: 'Bulky Waste', description: 'Furniture, mattresses, and other large items' },
  ];

  for (const type of wasteTypes) {
    await prisma.wasteType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }

  console.log(`Seeded ${wasteTypes.length} waste types.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });