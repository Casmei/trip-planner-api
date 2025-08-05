import { env } from "../config/env";
import { PrismaClient } from "../infrastructure/database/generated/prisma";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["query"] : [],
});
