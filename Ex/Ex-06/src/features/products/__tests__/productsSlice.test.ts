import productsReducer, {
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
  resetProductsFilter,
  fetchProductsAsync,
} from '../productsSlice.ts';
import type { ProductsState, Product } from '../productTypes.ts';

const mockProduct: Product = {
  id: 'prod-test-01',
  name: 'Màn hình Dell UltraSharp 27',
  price: 12000000,
  category: 'Màn hình',
  description: 'Màn hình chuẩn đồ họa',
  specs: ['4K', 'IPS'],
  stock: 10,
  rating: 4.8,
  reviewsCount: 30,
  imageColor: '#000',
};

describe('productsSlice Reducer Unit Tests (Slide 20-22)', () => {
  const initialProductsState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
    selectedCategory: 'Tất cả',
    searchQuery: '',
    sortBy: 'default',
  };

  it('trả về initial state mặc định khi action không khớp', () => {
    const state = productsReducer(undefined, { type: 'unknown_action' });
    expect(state.status).toBe('idle');
    expect(state.selectedCategory).toBe('Tất cả');
    expect(state.items).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('setSelectedCategory: cập nhật danh mục lọc sản phẩm', () => {
    const state = productsReducer(initialProductsState, setSelectedCategory('Bàn phím'));
    expect(state.selectedCategory).toBe('Bàn phím');
  });

  it('setSearchQuery: cập nhật từ khóa tìm kiếm sản phẩm', () => {
    const state = productsReducer(initialProductsState, setSearchQuery('Keychron'));
    expect(state.searchQuery).toBe('Keychron');
  });

  it('setSortBy: cập nhật tiêu chí sắp xếp sản phẩm', () => {
    const state = productsReducer(initialProductsState, setSortBy('price-asc'));
    expect(state.sortBy).toBe('price-asc');
  });

  it('resetProductsFilter: hoàn tác tất cả các bộ lọc về mặc định', () => {
    const modifiedState: ProductsState = {
      ...initialProductsState,
      selectedCategory: 'Chuột',
      searchQuery: 'Logitech',
      sortBy: 'price-desc',
    };

    const state = productsReducer(modifiedState, resetProductsFilter());
    expect(state.selectedCategory).toBe('Tất cả');
    expect(state.searchQuery).toBe('');
    expect(state.sortBy).toBe('default');
  });

  it('fetchProductsAsync.pending: chuyển trạng thái sang loading và xóa error', () => {
    const previousState: ProductsState = {
      ...initialProductsState,
      status: 'failed',
      error: 'Lỗi cũ',
    };

    const action = { type: fetchProductsAsync.pending.type };
    const state = productsReducer(previousState, action);

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchProductsAsync.fulfilled: chuyển trạng thái sang succeeded và lưu danh sách sản phẩm', () => {
    const action = {
      type: fetchProductsAsync.fulfilled.type,
      payload: [mockProduct],
    };
    const state = productsReducer(initialProductsState, action);

    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Màn hình Dell UltraSharp 27');
  });

  it('fetchProductsAsync.rejected: chuyển trạng thái sang failed và lưu thông báo lỗi', () => {
    const errorMessage = 'Máy chủ giả lập đang bận!';
    const action = {
      type: fetchProductsAsync.rejected.type,
      payload: errorMessage,
      error: { message: 'Rejected' },
    };
    const state = productsReducer(initialProductsState, action);

    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorMessage);
  });
});
