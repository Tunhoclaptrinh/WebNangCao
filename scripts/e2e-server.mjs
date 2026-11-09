import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";

const env = {
  ...process.env,
  PORT: "3100",
  AUTH_SECRET: process.env.AUTH_SECRET || randomBytes(48).toString("base64url"),
  AUTH_URL: "http://localhost:3100",
  NEXTAUTH_URL: "http://localhost:3100",
};

const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", "3100"],
  { env, stdio: "inherit" }
);

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => process.exit(code ?? 0));
