import type { Metadata } from "next";
import { getProducts } from "@/features/products/data";
import { Catalogue } from "@/components/catalogue";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site";
export const metadata: Metadata = {
  title: "Bộ sưu tập thiết bị",
  description:
    "Khám phá màn hình, bàn phím, âm thanh và phụ kiện. Tìm lựa chọn phù hợp cho góc làm việc của bạn.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Bộ sưu tập DevWorkspace",
    description: "Những thiết bị được chọn lọc cho một góc làm việc tốt hơn.",
    url: "/products",
  },
};
export const revalidate = 60;
export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <main id="main" className="container catalogue-page">
      <div className="page-intro">
        <span className="eyebrow">THE WORKSPACE COLLECTION</span>
        <h1>
          Chọn điều <em>phù hợp.</em>
        </h1>
        <p>
          Ít hơn, nhưng tốt hơn. Khám phá những thiết bị được chọn lọc
          <br className="desktop-break" /> để mỗi giờ làm việc đều trở nên dễ
          chịu.
        </p>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": absoluteUrl("/products"),
              name: "Bộ sưu tập thiết bị DevWorkspace",
              url: absoluteUrl("/products"),
              mainEntity: {
                "@type": "ItemList",
                itemListElement: products.map((product, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: absoluteUrl(`/products/${product.slug}`),
                  name: product.name,
                })),
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
              ],
            },
          ],
        }}
      />
      <Catalogue products={products} />
      <aside className="catalogue-note">
        <span aria-hidden="true">◈</span>
        <div>
          <strong>Mỗi món đồ, một lý do được chọn.</strong>
          <p>
            Khám phá chi tiết, thông số và lưu lại những thiết bị phù hợp với
            bạn.
          </p>
        </div>
      </aside>
    </main>
  );
}
