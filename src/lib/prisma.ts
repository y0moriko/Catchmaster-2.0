import { PrismaClient } from "../generated/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "./env";

interface GlobalWithPrisma {
  prisma?: PrismaClient;
}

const globalForPrisma = global as unknown as GlobalWithPrisma;

const isPostgres = env.DATABASE_URL.startsWith("postgres://") || env.DATABASE_URL.startsWith("postgresql://");

const adapter = isPostgres
  ? new PrismaPg(new Pool({ connectionString: env.DATABASE_URL }))
  : new PrismaBetterSqlite3({ url: env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
