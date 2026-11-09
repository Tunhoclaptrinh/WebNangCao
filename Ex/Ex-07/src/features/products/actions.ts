"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireActor, AccessError } from "@/features/auth/guards";
import { productInputSchema, productIdSchema } from "./validation";
export type MutationResult =
  { ok: true; message: string } | { ok: false; message: string };
function invalidateProducts(slug: string) {
  revalidateTag("products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/dashboard");
}
function accessFailure(error: unknown): MutationResult | null {
  return error instanceof AccessError
    ? {
        ok: false,
        message:
          error.code === "FORBIDDEN"
            ? "Bạn không có quyền thực hiện thao tác này."
            : "Vui lòng đăng nhập để tiếp tục.",
      }
    : null;
}
export async function updateProduct(input: unknown): Promise<MutationResult> {
  try {
    await requireActor("product:write");
    const parsed = productInputSchema.safeParse(input);
    if (!parsed.success)
      return {
        ok: false,
        message: "Giá, tồn kho hoặc phiên bản dữ liệu không hợp lệ.",
      };
    const { id, price, stock, updatedAt } = parsed.data;
    const product = await db.product.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!product) return { ok: false, message: "Sản phẩm không còn tồn tại." };
    const result = await db.product.updateMany({
      where: { id, updatedAt: new Date(updatedAt) },
      data: { price, stock },
    });
    if (!result.count)
      return {
        ok: false,
        message: "Dữ liệu đã thay đổi. Vui lòng tải lại trang trước khi lưu.",
      };
    invalidateProducts(product.slug);
    return { ok: true, message: "Đã cập nhật sản phẩm." };
  } catch (error) {
    const failure = accessFailure(error);
    if (failure) return failure;
    throw error;
  }
}
export async function deleteProduct(id: unknown): Promise<MutationResult> {
  try {
    await requireActor("product:write");
    const parsed = productIdSchema.safeParse(id);
    if (!parsed.success)
      return { ok: false, message: "Mã sản phẩm không hợp lệ." };
    const product = await db.product.findUnique({
      where: { id: parsed.data },
      select: { slug: true },
    });
    if (!product) return { ok: false, message: "Sản phẩm không còn tồn tại." };
    await db.product.deleteMany({ where: { id: parsed.data } });
    invalidateProducts(product.slug);
    return { ok: true, message: "Đã xoá sản phẩm." };
  } catch (error) {
    const failure = accessFailure(error);
    if (failure) return failure;
    throw error;
  }
}
export async function toggleFavorite(
  id: unknown,
  shouldSave: boolean,
): Promise<MutationResult> {
  try {
    const actor = await requireActor("favorites:write");
    const parsed = productIdSchema.safeParse(id);
    if (!parsed.success || typeof shouldSave !== "boolean")
      return { ok: false, message: "Yêu cầu không hợp lệ." };
    if (shouldSave) {
      const product = await db.product.findUnique({
        where: { id: parsed.data },
        select: { id: true },
      });
      if (!product)
        return { ok: false, message: "Sản phẩm không còn tồn tại." };
      await db.favorite.upsert({
        where: {
          userId_productId: { userId: actor.id, productId: parsed.data },
        },
        create: { userId: actor.id, productId: parsed.data },
        update: {},
      });
    } else
      await db.favorite.deleteMany({
        where: { userId: actor.id, productId: parsed.data },
      });
    revalidatePath("/dashboard");
    return {
      ok: true,
      message: shouldSave
        ? "Đã lưu vào danh sách của bạn."
        : "Đã bỏ lưu sản phẩm.",
    };
  } catch (error) {
    const failure = accessFailure(error);
    if (failure) return failure;
    throw error;
  }
}
