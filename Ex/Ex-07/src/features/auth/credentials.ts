import "server-only";
import { compare, hash } from "bcryptjs";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { credentialsSchema } from "./validation";
import { normalizeRole } from "./permissions";
// Durable per-account throttling, shared across local Node workers via SQLite.
const dummyHash = hash("dummy-password-never-used-for-signin", 12);
export async function verifyCredentials(input: unknown) {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) return null;
  const { email, password } = parsed.data;
  const key = createHash("sha256").update(email).digest("hex");
  const now = new Date();
  // Increment and expiry reset are atomic inside a transaction.
  const permitted = await db.$transaction(async (tx) => {
    const attempt = await tx.loginAttempt.findUnique({ where: { key } });
    if (attempt && attempt.resetAt > now && attempt.count >= 10) return false;
    await tx.loginAttempt.upsert({
      where: { key },
      create: { key, count: 1, resetAt: new Date(now.getTime() + 15 * 60_000) },
      update:
        attempt && attempt.resetAt > now
          ? { count: { increment: 1 } }
          : { count: 1, resetAt: new Date(now.getTime() + 15 * 60_000) },
    });
    return true;
  });
  if (!permitted) return null;
  const user = await db.user.findUnique({ where: { email } });
  const valid = await compare(
    password,
    user?.passwordHash ?? (await dummyHash),
  );
  if (!user?.passwordHash || !valid) return null;
  await db.loginAttempt.deleteMany({ where: { key } });
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: normalizeRole(user.role),
  };
}
