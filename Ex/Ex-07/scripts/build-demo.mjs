import { execFileSync } from "node:child_process";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
if (!/^postgres(?:ql)?:/.test(process.env.DATABASE_URL || "")) {
  throw new Error(
    "Demo deployment requires a persistent PostgreSQL DATABASE_URL; local SQLite is for npm run setup/dev only.",
  );
}
for (const key of ["AUTH_SECRET", "NEXT_PUBLIC_SITE_URL", "AUTH_URL"]) {
  if (!process.env[key]?.trim())
    throw new Error(`Missing deployment variable: ${key}`);
}
const site = new URL(process.env.NEXT_PUBLIC_SITE_URL);
if (site.protocol !== "https:")
  throw new Error("Public demo must use an HTTPS site URL.");
const run = (args, env = process.env) =>
  execFileSync(process.execPath, args, { env, stdio: "inherit" });
run(["node_modules/prisma/build/index.js", "generate"]);
// Neon provides an unpooled URL for migration/DDL; never print connection strings.
run(["node_modules/prisma/build/index.js", "migrate", "deploy"], {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
});
run(["node_modules/tsx/dist/cli.mjs", "prisma/seed.ts"]);
run(["node_modules/next/dist/bin/next", "build"]);
