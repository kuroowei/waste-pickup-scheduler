import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
const SALT_ROUNDS = 12;
const DRIVER_PASSWORD = 'Driver@1234';
const drivers = [
  { fullName: 'Emmanuel Ogoni', phone: '08031112201', truckName: 'Truck 1', plateNumber: 'BYT-101-YN' },
  { fullName: 'Samuel Ateke', phone: '08031112202', truckName: 'Truck 2', plateNumber: 'BYT-102-YN' },
  { fullName: 'David Ebiere', phone: '08031112203', truckName: 'Truck 3', plateNumber: 'BYT-103-YN' },
  { fullName: 'Friday Amakiri', phone: '08031112204', truckName: 'Truck 4', plateNumber: 'BYT-104-YN' },
  { fullName: 'Godwin Tarela', phone: '08031112205', truckName: 'Truck 5', plateNumber: 'BYT-105-YN' },
  { fullName: 'Preye Diseye', phone: '08031112206', truckName: 'Truck 6', plateNumber: 'BYT-106-YN' },
  { fullName: 'Ibinabo Korubo', phone: '08031112207', truckName: 'Truck 7', plateNumber: 'BYT-107-YN' },
  { fullName: 'Anthony Douye', phone: '08031112208', truckName: 'Truck 8', plateNumber: 'BYT-108-YN' },
  { fullName: 'Christopher Igoni', phone: '08031112209', truckName: 'Truck 9', plateNumber: 'BYT-109-YN' },
  { fullName: 'Moses Warder', phone: '08031112210', truckName: 'Truck 10', plateNumber: 'BYT-110-YN' },
];
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

  const hashedPassword = await bcrypt.hash(DRIVER_PASSWORD, SALT_ROUNDS);
  let seededCount = 0;
  for (const d of drivers) {
    const email = `${d.fullName.toLowerCase().replace(/\s+/g, '.')}@kurosofttech.com`;
    const driverUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        fullName: d.fullName,
        email,
        phone: d.phone,
        password: hashedPassword,
        role: 'DRIVER',
      },
    });
    await prisma.truck.upsert({
      where: { plateNumber: d.plateNumber },
      update: {},
      create: {
        name: d.truckName,
        plateNumber: d.plateNumber,
        driverId: driverUser.id,
      },
    });
    seededCount++;
  }
  console.log(`Seeded ${seededCount} drivers and trucks. Default driver password: ${DRIVER_PASSWORD}`);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });