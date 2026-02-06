const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_USERNAME,
    ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME,
  } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_USERNAME || !ADMIN_FIRST_NAME || !ADMIN_LAST_NAME) {
    throw new Error(
      "Missing required env vars. Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME, ADMIN_FIRST_NAME, ADMIN_LAST_NAME."
    );
  }

  if (ADMIN_PASSWORD.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [{ role: "ADMIN" }, { email: ADMIN_EMAIL }],
    },
  });

  if (existingAdmin) {
    console.log("Admin already exists. Skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Admin user created.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
