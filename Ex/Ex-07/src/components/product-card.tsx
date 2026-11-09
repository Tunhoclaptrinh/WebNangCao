import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/site";
export function ProductArt({
  art,
  name,
  color,
  large = false,
  priority = false,
}: {
  art: string;
  name: string;
  color: string;
  large?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className={`product-art${large ? " product-art-large" : ""}`}
      style={{ backgroundColor: color }}
    >
      <Image
        src={`/images/${art}.webp`}
        alt={name}
        width={800}
        height={640}
        sizes={
          large
            ? "(max-width: 760px) calc(100vw - 40px), 600px"
            : "(max-width: 760px) calc((100vw - 54px) / 2), (max-width: 1100px) 230px, 304px"
        }
        priority={large || priority}
      />
    </div>
  );
}
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
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
            priority={priority}
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
