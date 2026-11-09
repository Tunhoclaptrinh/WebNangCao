import { getProduct } from "@/features/products/data";
import { createOgImage } from "@/components/og-image";
export const alt = "Sản phẩm được chọn lọc tại DevWorkspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return createOgImage(
    product?.name || "DevWorkspace",
    product
      ? `${product.brand} / THE WORKSPACE COLLECTION`
      : "Thoughtfully selected for your workspace.",
  );
}
