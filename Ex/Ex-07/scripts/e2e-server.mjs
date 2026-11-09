import { execFileSync, spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  rmSync,
  closeSync,
  openSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
const env = {
  ...process.env,
  NEXT_BUILD_DIR: ".next-e2e",
  DATABASE_URL: "file:./e2e.db",
  AUTH_SECRET: randomBytes(48).toString("base64url"),
  AUTH_URL: "http://localhost:3100",
  AUTH_GITHUB_ID: "",
  AUTH_GITHUB_SECRET: "",
};
// Only the disposable e2e database is removed; dev.db is never touched.
for (const name of ["e2e.db", "e2e.db-journal", "e2e.db-wal", "e2e.db-shm"])
  rmSync(`prisma/${name}`, { force: true });
closeSync(openSync("prisma/e2e.db", "a"));
for (const args of [
  ["prisma", "migrate", "deploy"],
  ["tsx", "prisma/seed.ts"],
])
  execFileSync("npx", args, { env, stdio: "inherit" });
rmSync(".next-e2e", { recursive: true, force: true });
// A real separate production build also isolates Next's compiled ISR paths.
const originalConfig = readFileSync("tsconfig.json", "utf8");
const originalNextEnv = readFileSync("next-env.d.ts", "utf8");
try {
  execFileSync("node", ["node_modules/next/dist/bin/next", "build"], {
    env,
    stdio: "inherit",
  });
} finally {
  writeFileSync("tsconfig.json", originalConfig);
  writeFileSync("next-env.d.ts", originalNextEnv);
}
const child = spawn(
  "node",
  ["node_modules/next/dist/bin/next", "start", "-p", "3100"],
  { env, stdio: "inherit" },
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
