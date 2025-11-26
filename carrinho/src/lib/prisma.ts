import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "~/app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionUrl: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
