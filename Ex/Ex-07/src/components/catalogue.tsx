"use client";
import { useMemo, useState } from "react";
import type { Product } from "@prisma/client";
import { ProductCard } from "./product-card";
const categories = ["Tất cả", "Màn hình", "Bàn phím", "Âm thanh", "Phụ kiện"];
export function Catalogue({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("featured");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    const result = products.filter(
      (p) =>
        (category === "Tất cả" || p.category === category) &&
        `${p.name} ${p.brand}`.toLocaleLowerCase("vi").includes(normalized),
    );
    if (sort !== "featured")
      result.sort((a, b) =>
        sort === "price-asc" ? a.price - b.price : b.price - a.price,
      );
    return result;
  }, [products, query, category, sort]);
  return (
    <>
      <div className="catalogue-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label="Danh mục sản phẩm"
        >
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="catalogue-search">
          <span className="search-symbol" aria-hidden="true" />
          <input
            type="search"
            aria-label="Tìm sản phẩm"
            placeholder="Tìm theo tên, thương hiệu…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="catalogue-meta">
        <p aria-live="polite">
          {filtered.length} sản phẩm <span>được chọn lọc cho bạn</span>
        </p>
        <select
          aria-label="Sắp xếp sản phẩm"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="featured">Nổi bật</option>
          <option value="price-asc">Giá: thấp đến cao</option>
          <option value="price-desc">Giá: cao đến thấp</option>
        </select>
      </div>
      <h2 className="sr-only">Bộ sưu tập sản phẩm</h2>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
            />
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <span className="empty-search-icon" aria-hidden="true">
            ⌕
          </span>
          <p>Chưa tìm thấy sản phẩm phù hợp</p>
          <button
            className="text-button"
            onClick={() => {
              setQuery("");
              setCategory("Tất cả");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </>
  );
}
