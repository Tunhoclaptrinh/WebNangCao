import { z } from "zod";
export const productInputSchema = z.object({
  id: z.string().regex(/^prod-[a-zA-Z0-9-]{1,40}$/),
  price: z.coerce.number().int().min(1000).max(1_000_000_000),
  stock: z.coerce.number().int().min(0).max(10000),
  updatedAt: z.iso.datetime(),
});
export const productIdSchema = z.string().regex(/^prod-[a-zA-Z0-9-]{1,40}$/);
