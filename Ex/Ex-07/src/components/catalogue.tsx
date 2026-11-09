"use client";
import { useMemo, useState } from "react";
import { Input, Select, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
        <Input
          className="catalogue-search"
          prefix={<SearchOutlined />}
          aria-label="Tìm sản phẩm"
          placeholder="Tìm theo tên, thương hiệu…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          allowClear
        />
      </div>
      <div className="catalogue-meta">
        <p aria-live="polite">
          {filtered.length} sản phẩm <span>được chọn lọc cho bạn</span>
        </p>
        <Select
          aria-label="Sắp xếp sản phẩm"
          value={sort}
          onChange={setSort}
          options={[
            { value: "featured", label: "Nổi bật" },
            { value: "price-asc", label: "Giá: thấp đến cao" },
            { value: "price-desc", label: "Giá: cao đến thấp" },
          ]}
        />
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <Empty description="Chưa tìm thấy sản phẩm phù hợp" />
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
