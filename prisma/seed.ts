import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("password123", 12);

  // Demo user — free plan
  await prisma.user.upsert({
    where: { email: "demo@nakshatra.ai" },
    update: {},
    create: {
      email: "demo@nakshatra.ai",
      name: "Arjun Sharma",
      passwordHash: hash,
      plan: "free",
      language: "en",
      dateOfBirth: new Date("1995-03-15"),
      timeOfBirth: "06:30",
      placeOfBirth: "Mumbai, India",
      latitude: 19.076,
      longitude: 72.8777,
    },
  });

  // Demo user — premium plan
  await prisma.user.upsert({
    where: { email: "premium@nakshatra.ai" },
    update: {},
    create: {
      email: "premium@nakshatra.ai",
      name: "Priya Patel",
      passwordHash: hash,
      plan: "premium",
      language: "hi",
      dateOfBirth: new Date("1992-08-22"),
      timeOfBirth: "14:15",
      placeOfBirth: "Delhi, India",
      latitude: 28.6139,
      longitude: 77.209,
    },
  });

  console.log("✅ Seed data created");
  console.log("   demo@nakshatra.ai / password123 (Free)");
  console.log("   premium@nakshatra.ai / password123 (Premium)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
