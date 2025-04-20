import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {
      password_digested: await bcrypt.hash("admin@123", 10),
    },
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password_digested: await bcrypt.hash("admin@123", 10),
      role: "admin",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
