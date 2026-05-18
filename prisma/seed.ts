import { PrismaClient } from '../src/generated/client/client';
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from 'bcrypt';
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Roles
  const roles = ['admin'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
  console.log('✅ Roles created');

  // 2. Create Default Admin
  // WARNING: Change this password after first login!
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (adminRole) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@catchmaster.com' },
      update: {},
      create: {
        email: 'admin@catchmaster.com',
        firstName: 'System',
        lastName: 'Administrator',
        password: hashedPassword,
        roleId: adminRole.id,
      },
    });
    console.log('✅ Default admin created (admin@catchmaster.com / admin123)');
    console.log('⚠️  WARNING: Change the default admin password after first login!');
  }

  // 3. Create Fish Species
  const fishSpecies = [
    { name: 'Tuna', localName: 'Tambakol', category: 'Pelagic' },
    { name: 'Spanish Mackerel', localName: 'Tanigue', category: 'Pelagic' },
    { name: 'Grouper', localName: 'Lapu-lapu', category: 'Demersal' },
    { name: 'Snapper', localName: 'Maya-maya', category: 'Demersal' },
    { name: 'Scad', localName: 'Galunggong', category: 'Pelagic' },
    { name: 'Sardine', localName: 'Tamban', category: 'Pelagic' },
    { name: 'Anchovy', localName: 'Dilis', category: 'Pelagic' },
    { name: 'Squid', localName: 'Pusit', category: 'Cephalopod' },
    { name: 'Shrimp', localName: 'Hipon', category: 'Crustacean' },
    { name: 'Crab', localName: 'Alimango', category: 'Crustacean' },
  ];

  for (const fish of fishSpecies) {
    const existing = await prisma.fishSpecies.findFirst({
      where: { name: fish.name }
    });
    if (!existing) {
      await prisma.fishSpecies.create({
        data: fish
      });
    }
  }
  console.log('✅ Fish species created');

  console.log('✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
