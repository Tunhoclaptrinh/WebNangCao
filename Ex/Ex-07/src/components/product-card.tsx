/* eslint-disable @next/next/no-img-element -- baseline image delivery measured before optimization */
import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/site";
export function ProductArt({
  art,
  name,
  color,
  large = false,
}: {
  art: string;
  name: string;
  color: string;
  large?: boolean;
}) {
  // Baseline asset delivery; measured before next/image optimization.
  return (
    <div
      className={`product-art${large ? " product-art-large" : ""}`}
      style={{ backgroundColor: color }}
    >
      <img src={`/images/${art}.png`} alt={name} width={800} height={640} />
    </div>
  );
}
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Xem ${product.name}`}
      >
        <div className="product-visual">
          <ProductArt
            art={product.art}
            name={product.name}
            color={product.color}
          />
          {product.stock === 0 ? (
            <span className="product-badge sold-out">Tạm hết hàng</span>
          ) : (
            product.featured && (
              <span className="product-badge">Được yêu thích</span>
            )
          )}
          <span className="product-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="product-info">
          <span className="eyebrow">
            {product.category} <span> / </span> {product.brand}
          </span>
          <h3>{product.name}</h3>
          <p className="price">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
