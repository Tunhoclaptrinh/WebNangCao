import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import {
  resetProductsFilter,
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
} from './productsSlice.ts';

const CATEGORIES = ['Tất cả', 'Màn hình', 'Bàn phím', 'Chuột', 'Âm thanh', 'Phụ kiện'];

export function ProductFilter() {
  const dispatch = useAppDispatch();
  const { selectedCategory, searchQuery, sortBy } = useAppSelector(
    (state) => state.products
  );

  return (
    <div className="filter-panel">
      <div className="filter-top-row">
        {/* Thanh tìm kiếm */}
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên, thông số..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => dispatch(setSearchQuery(''))}
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bộ sắp xếp */}
        <div className="sort-wrap">
          <label htmlFor="sort-select" className="sort-label">
            Sắp xếp:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) =>
              dispatch(
                setSortBy(
                  e.target.value as 'default' | 'price-asc' | 'price-desc' | 'rating'
                )
              )
            }
            className="sort-select"
          >
            <option value="default">Mặc định (Nổi bật)</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Thanh danh mục dạng pills */}
      <div className="category-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => dispatch(setSelectedCategory(cat))}
          >
            {cat}
          </button>
        ))}

        {(selectedCategory !== 'Tất cả' || searchQuery || sortBy !== 'default') && (
          <button
            type="button"
            className="cat-pill reset-pill"
            onClick={() => dispatch(resetProductsFilter())}
          >
            🔄 Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
