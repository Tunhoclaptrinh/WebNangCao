import {
  existsSync,
  readFileSync,
  writeFileSync,
  closeSync,
  openSync,
} from "node:fs";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
if (!existsSync(".env.local")) {
  const template = readFileSync(".env.example", "utf8");
  writeFileSync(
    ".env.local",
    template.replace(
      'AUTH_SECRET=""',
      `AUTH_SECRET="${randomBytes(48).toString("base64url")}"`,
    ),
    { mode: 0o600 },
  );
  console.log(
    "Đã tạo .env.local với AUTH_SECRET ngẫu nhiên (không in ra màn hình).",
  );
}
process.loadEnvFile(".env.local");
if (!existsSync("prisma/dev.db")) closeSync(openSync("prisma/dev.db", "a"));
for (const args of [
  ["prisma", "generate"],
  ["prisma", "migrate", "deploy"],
  ["tsx", "prisma/seed.ts"],
]) {
  const [command, ...parameters] = args;
  const cli =
    command === "prisma"
      ? "node_modules/prisma/build/index.js"
      : "node_modules/tsx/dist/cli.mjs";
  execFileSync(process.execPath, [cli, ...parameters], {
    stdio: "inherit",
    env: process.env,
  });
}
console.log(
  "Sẵn sàng. Chạy npm run dev. GitHub OAuth cần điền ID/Secret trong .env.local.",
);
