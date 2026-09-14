/**
 * ProductList.tsx
 * Component demo cho usePagination hook.
 * Hiển thị danh sách sản phẩm với phân trang.
 */

import { usePagination } from "../../hooks/usePagination";
import { products, type Product } from "../../data/products";
import "./ProductList.css";

const ITEMS_PER_PAGE = 4;

function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  return (
    <div className={`product-card ${!product.inStock ? "product-card--out-of-stock" : ""}`}>
      <div className="product-card__emoji">{product.emoji}</div>
      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__footer">
          <span className="product-card__price">{formattedPrice}</span>
          <div className="product-card__meta">
            <span className="product-card__rating">
              ⭐ {product.rating}
            </span>
            <span className={`product-card__stock ${product.inStock ? "in-stock" : "out-of-stock"}`}>
              {product.inStock ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductList() {
  const {
    currentPage,
    totalPages,
    currentData,
    next,
    prev,
    goToPage,
    hasNext,
    hasPrev,
  } = usePagination<Product>(products, ITEMS_PER_PAGE);

  return (
    <section className="product-list-section">
      <div className="product-list-header">
        <h2 className="product-list-title">
          🛍️ Danh Sách Sản Phẩm
        </h2>
        <span className="product-list-meta">
          {products.length} sản phẩm · {ITEMS_PER_PAGE} item/trang
        </span>
      </div>

      {/* Hook info badge */}
      <div className="hook-badge">
        <code>usePagination&lt;Product&gt;(products, {ITEMS_PER_PAGE})</code>
      </div>

      {/* Grid sản phẩm */}
      <div className="product-grid">
        {currentData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        <button
          className="pagination__btn"
          onClick={prev}
          disabled={!hasPrev}
          aria-label="Trang trước"
        >
          ← Trước
        </button>

        <div className="pagination__pages">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination__page ${page === currentPage ? "pagination__page--active" : ""}`}
              onClick={() => goToPage(page)}
              aria-label={`Trang ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination__btn"
          onClick={next}
          disabled={!hasNext}
          aria-label="Trang tiếp theo"
        >
          Tiếp →
        </button>
      </div>

      <p className="pagination__info">
        Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
        &nbsp;·&nbsp;
        Hiển thị {currentData.length} / {products.length} sản phẩm
      </p>
    </section>
  );
}
