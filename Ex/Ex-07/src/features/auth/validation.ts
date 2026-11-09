import { z } from "zod";
export const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
  password: z
    .string()
    .min(8)
    .max(72)
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= 72,
      "Mật khẩu vượt quá 72 byte.",
    ),
});
