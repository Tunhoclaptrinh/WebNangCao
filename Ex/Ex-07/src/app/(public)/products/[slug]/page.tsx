import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/features/products/data";
import { ProductArt, ProductCard } from "@/components/product-card";
import { FavoriteButton } from "@/components/favorite-button";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, formatPrice } from "@/lib/site";
type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export async function generateStaticParams() {
  return (await getProducts()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/products/${product.slug}`,
    },
  };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = (await getProducts())
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  return (
    <main id="main" className="container detail-page">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link>
        <span>/</span>
        <Link href="/products">Sản phẩm</Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: [absoluteUrl(`/images/${product.art}.png`)],
              sku: product.id,
              brand: { "@type": "Brand", name: product.brand },
              offers: {
                "@type": "Offer",
                url: absoluteUrl(`/products/${product.slug}`),
                priceCurrency: "VND",
                price: product.price,
                availability: `https://schema.org/${product.stock > 0 ? "InStock" : "OutOfStock"}`,
                itemCondition: "https://schema.org/NewCondition",
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Trang chủ",
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Sản phẩm",
                  item: absoluteUrl("/products"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: product.name,
                  item: absoluteUrl(`/products/${product.slug}`),
                },
              ],
            },
          ],
        }}
      />
      <section className="product-detail">
        <div className="detail-visual">
          <ProductArt
            art={product.art}
            color={product.color}
            name={product.name}
            large
          />
          <span>Minh họa thiết kế · Màu sắc thực tế có thể khác</span>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {product.category} / {product.brand}
          </span>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className={`stock-label${product.stock ? "" : " no-stock"}`}>
            <span className="tiny-dot" />
            {product.stock ? `Còn ${product.stock} sản phẩm` : "Tạm hết hàng"}
          </p>
          <div className="detail-specs">
            {product.specs.split("|").map((spec) => (
              <span key={spec}>
                <span aria-hidden="true">✓</span> {spec}
              </span>
            ))}
          </div>
          <FavoriteButton id={product.id} />
          <p className="save-hint">
            Lưu lại để dễ dàng tìm thấy trong tài khoản của bạn.
          </p>
          <div className="detail-assurance">
            <strong>Chọn lọc cho công việc hàng ngày.</strong>
            <p>
              Tham khảo thông số, so sánh lựa chọn và xây dựng không gian phù
              hợp với bạn. Đây là sản phẩm minh họa của dự án học tập.
            </p>
          </div>
        </div>
      </section>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CÓ THỂ BẠN CŨNG THÍCH</span>
            <h2>Hoàn thiện góc làm việc</h2>
          </div>
          <Link href="/products" className="text-link">
            Xem bộ sưu tập ↗
          </Link>
        </div>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
