import { defineConfig } from "prisma/config";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
const postgres = /^postgres(?:ql)?:/.test(process.env.DATABASE_URL ?? "");
export default defineConfig({
  schema: postgres ? "prisma/postgres/schema.prisma" : "prisma/schema.prisma",
  migrations: {
    path: postgres ? "prisma/postgres/migrations" : "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
