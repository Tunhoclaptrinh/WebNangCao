/* eslint-disable @next/next/no-img-element -- baseline image delivery measured before optimization */
import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/features/products/data";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { site, absoluteUrl } from "@/lib/site";
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "DevWorkspace — Góc làm việc của bạn",
    description: site.description,
    url: "/",
  },
};
export const revalidate = 60;
export default async function HomePage() {
  const products = await getProducts();
  return (
    <main id="main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          logo: absoluteUrl("/icon.svg"),
        }}
      />
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-dot" /> DÀNH CHO NHỮNG NGƯỜI YÊU CÔNG VIỆC
          </span>
          <h1>
            Một góc nhỏ.
            <br />
            Nhiều <em>cảm hứng.</em>
          </h1>
          <p>
            Những thiết bị tốt không chỉ nằm trên bàn.
            <br className="desktop-break" /> Chúng giúp bạn làm điều mình yêu,
            mỗi ngày.
          </p>
          <Link href="/products" className="button-primary">
            Khám phá bộ sưu tập <span aria-hidden="true">↗</span>
          </Link>
          <div className="hero-caption">
            <span className="caption-line" /> Được chọn lọc. Để bạn tập trung.
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-index">THE WORKSPACE EDIT / 2026</span>
          <img
            src="/images/workspace.png"
            width={1200}
            height={1050}
            alt="Minh họa góc làm việc tối giản với màn hình, bàn phím và đèn bàn"
          />
          <div className="hero-visual-label">
            <span>Thiết kế cho sự tập trung</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </section>
      <div className="container values-strip">
        <span>
          <i aria-hidden="true">◈</i> Thiết bị được chọn lọc
        </span>
        <span>
          <i aria-hidden="true">⌁</i> Thiết kế tinh giản
        </span>
        <span>
          <i aria-hidden="true">♡</i> Không gian mang dấu ấn riêng
        </span>
      </div>
      <section className="container collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BẮT ĐẦU TỪ NHỮNG ĐIỀU TỐT</span>
            <h2>Lựa chọn cho góc làm việc</h2>
          </div>
          <Link href="/products" className="text-link">
            Xem tất cả <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.featured)
            .slice(0, 4)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
      <section className="container editorial">
        <div>
          <span className="eyebrow">KHÔNG GIAN CỦA RIÊNG BẠN</span>
          <h2>
            Góc làm việc tốt hơn,
            <br />
            bắt đầu từ lựa chọn của bạn.
          </h2>
          <p>
            Lưu những món đồ bạn thích, tạo bộ sưu tập của riêng mình
            <br className="desktop-break" /> và tìm cảm hứng cho lần nâng cấp
            tiếp theo.
          </p>
        </div>
        <Link href="/dashboard" className="button-outline">
          Tạo không gian của tôi <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
