import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/make-admin.mjs you@example.com");
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

try {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`✔ ${user.email} is now an ADMIN.`);
  console.log("Log out and back in for the change to take effect in your session.");
} catch (err) {
  console.error(
    `Couldn't find or update a user with email "${email}".`,
    err.message
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
