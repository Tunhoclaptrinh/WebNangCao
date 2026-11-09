import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { requireActor } from "@/features/auth/guards";
export const getProducts = unstable_cache(
  () => db.product.findMany({ orderBy: [{ featured: "desc" }, { id: "asc" }] }),
  ["catalogue", process.env.DATABASE_URL || "default"],
  { revalidate: 60, tags: ["products"] },
);
export const getProduct = cache((slug: string) =>
  db.product.findUnique({ where: { slug } }),
);
export async function getAdminProducts() {
  await requireActor("product:write");
  return db.product.findMany({ orderBy: { id: "asc" } });
}
export async function getMyFavorites() {
  const actor = await requireActor();
  return db.favorite.findMany({
    where: { userId: actor.id },
    include: { product: true },
    orderBy: { productId: "asc" },
  });
}
