import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { ProductCard } from './ProductCard.tsx';
import { ProductFilter } from './ProductFilter.tsx';
import { useGetProductsQuery } from './productsApi.ts';
import { fetchProductsAsync } from './productsSlice.ts';
import type { Product } from './productTypes.ts';

interface ProductListProps {
  onAddToCartSuccess: (productName: string) => void;
  dataSource: 'thunk' | 'rtk-query';
  setDataSource: (source: 'thunk' | 'rtk-query') => void;
}

export function ProductList({
  onAddToCartSuccess,
  dataSource,
  setDataSource,
}: ProductListProps) {
  const dispatch = useAppDispatch();

  // State từ Redux Thunk
  const thunkProducts = useAppSelector((state) => state.products.items);
  const thunkStatus = useAppSelector((state) => state.products.status);
  const thunkError = useAppSelector((state) => state.products.error);

  // State bộ lọc và tìm kiếm từ Redux
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);
  const searchQuery = useAppSelector((state) => state.products.searchQuery);
  const sortBy = useAppSelector((state) => state.products.sortBy);

  // Điều khiển giả lập lỗi để test trạng thái rejected / error
  const [simulateError, setSimulateError] = useState(false);

  // 1. Dữ liệu từ RTK Query (Bonus điểm cộng)
  const {
    data: rtkProducts,
    isLoading: isRtkLoading,
    isError: isRtkError,
    error: rtkErrorObj,
    refetch: refetchRtk,
  } = useGetProductsQuery(
    simulateError ? { shouldFail: true } : undefined,
    { skip: dataSource !== 'rtk-query' }
  );

  // 2. Fetch dữ liệu qua Redux Thunk khi khởi chạy hoặc chuyển chế độ
  useEffect(() => {
    if (dataSource === 'thunk') {
      dispatch(fetchProductsAsync({ shouldFail: simulateError }));
    }
  }, [dataSource, simulateError, dispatch]);

  const handleRetry = () => {
    if (dataSource === 'thunk') {
      dispatch(fetchProductsAsync({ shouldFail: simulateError }));
    } else {
      refetchRtk();
    }
  };

  // Xác định nguồn dữ liệu active
  const rawProducts: Product[] =
    dataSource === 'thunk' ? thunkProducts : rtkProducts ?? [];
  const isLoading =
    dataSource === 'thunk'
      ? thunkStatus === 'loading'
      : isRtkLoading;
  const isError =
    dataSource === 'thunk'
      ? thunkStatus === 'failed'
      : isRtkError;
  const errorMessage =
    dataSource === 'thunk'
      ? thunkError
      : typeof rtkErrorObj === 'object' && rtkErrorObj && 'data' in rtkErrorObj
        ? String(rtkErrorObj.data)
        : 'Có lỗi xảy ra trong quá trình truy vấn RTK Query.';

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // Lọc theo danh mục
    if (selectedCategory !== 'Tất cả') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Tìm kiếm theo tên hoặc mô tả
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sắp xếp
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [rawProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <section className="product-section">
      {/* Header thanh công nghệ Data Fetching */}
      <div className="section-top-bar">
        <div>
          <h2 className="section-heading">Cửa Hàng Thiết Bị Không Gian Làm Việc</h2>
          <p className="section-subtext">
            Sản phẩm công nghệ cao cấp chính hãng dành cho Developers và Designers
          </p>
        </div>

        {/* Nút chuyển đổi cơ chế Data Fetching: Thunk vs RTK Query */}
        <div className="source-switcher">
          <span className="source-label">Phương thức nạp dữ liệu:</span>
          <div className="switcher-tabs">
            <button
              type="button"
              className={`switch-tab ${dataSource === 'thunk' ? 'active' : ''}`}
              onClick={() => setDataSource('thunk')}
            >
              <span>⚡ Redux Thunk</span>
              <small>createAsyncThunk</small>
            </button>
            <button
              type="button"
              className={`switch-tab ${dataSource === 'rtk-query' ? 'active bonus' : 'bonus'}`}
              onClick={() => setDataSource('rtk-query')}
            >
              <span>🔥 RTK Query</span>
              <small>Điểm cộng kỹ thuật ⭐</small>
            </button>
          </div>
        </div>
      </div>

      {/* Điều khiển mô phỏng lỗi mạng */}
      <div className="simulation-bar">
        <div className="sim-badge">
          {dataSource === 'thunk' ? (
            <>Sử dụng <code>productsSlice.ts</code> (createAsyncThunk)</>
          ) : (
            <>Sử dụng <code>productsApi.ts</code> (createApi + fakeBaseQuery)</>
          )}
        </div>

        <div className="sim-error-toggle">
          <label className="sim-checkbox-label">
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
            />
            <span>Mô phỏng lỗi Server 500 (Kiểm tra trạng thái Error/Rejected)</span>
          </label>
          <button
            type="button"
            onClick={handleRetry}
            className="btn-refresh"
            title="Tải lại dữ liệu"
          >
            🔄 Refetch
          </button>
        </div>
      </div>

      {/* Bộ lọc sản phẩm */}
      <ProductFilter />

      {/* Trạng thái Loading với Skeleton Cards */}
      {isLoading && (
        <div className="products-grid-layout">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="skeleton-media"></div>
              <div className="skeleton-content">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line desc"></div>
                <div className="skeleton-line price"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trạng thái Lỗi */}
      {!isLoading && isError && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-body">
            <h3>Không thể tải danh sách sản phẩm</h3>
            <p>{errorMessage}</p>
            <p className="error-hint">
              💡 Bạn đang bật tùy chọn "Mô phỏng lỗi Server". Hãy bỏ chọn ở trên và nhấn "Thử lại".
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleRetry}
            >
              Thử lại ngay
            </button>
          </div>
        </div>
      )}

      {/* Trạng thái Thành Công */}
      {!isLoading && !isError && filteredProducts.length > 0 && (
        <div className="products-grid-layout">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCartSuccess={onAddToCartSuccess}
            />
          ))}
        </div>
      )}

      {/* Trạng thái Không tìm thấy kết quả phù hợp */}
      {!isLoading && !isError && filteredProducts.length === 0 && (
        <div className="empty-products">
          <div className="empty-icon">🔎</div>
          <h3>Không tìm thấy sản phẩm phù hợp</h3>
          <p>
            Không có kết quả nào khớp với danh mục "{selectedCategory}" hoặc từ khóa "
            {searchQuery}".
          </p>
        </div>
      )}
    </section>
  );
}
