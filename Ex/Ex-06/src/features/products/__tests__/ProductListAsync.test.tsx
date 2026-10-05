import { screen, fireEvent } from '@testing-library/react';
import { ProductList } from '../ProductList.tsx';
import { fetchProductsAsync } from '../productsSlice.ts';
import { renderWithProviders, createTestStore } from '../../../test-utils.tsx';
import type { Product } from '../productTypes.ts';

const mockSampleProducts: Product[] = [
  {
    id: 'async-01',
    name: 'Màn hình Dell UltraSharp U2723QE 4K',
    price: 13990000,
    originalPrice: 15490000,
    category: 'Màn hình',
    description: 'Màn hình chuyên đồ họa cao cấp 4K IPS Black',
    specs: ['4K IPS', 'Type-C 90W'],
    rating: 4.9,
    reviewsCount: 88,
    stock: 12,
    imageColor: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    badge: 'Bán chạy',
  },
  {
    id: 'async-02',
    name: 'Tai nghe Sony WH-1000XM5 Chống Ồn',
    price: 7990000,
    originalPrice: 8990000,
    category: 'Âm thanh',
    description: 'Tai nghe chống ồn chủ động đầu bảng',
    specs: ['Chống ồn ANC', 'Pin 30h'],
    rating: 4.8,
    reviewsCount: 120,
    stock: 5,
    imageColor: 'linear-gradient(135deg, #6366f1, #4338ca)',
  },
];

describe('Async API & ProductList Component Testing (Slide 34 & 36)', () => {
  describe('Unit Test: fetchProductsAsync Thunk', () => {
    it('fetchProductsAsync.fulfilled: nạp danh sách sản phẩm thành công khi API phản hồi', async () => {
      const store = createTestStore();

      // Gọi thunk với delayMs cực ngắn (10ms) để tối ưu thời gian test
      const action = await store.dispatch(fetchProductsAsync({ delayMs: 10, shouldFail: false }));

      expect(action.type).toBe('products/fetchProducts/fulfilled');
      const state = store.getState().products;
      expect(state.status).toBe('succeeded');
      expect(state.items.length).toBeGreaterThan(0);
      expect(state.error).toBeNull();
    });

    it('fetchProductsAsync.rejected: xử lý lỗi 503 khi máy chủ giả lập thất bại', async () => {
      const store = createTestStore();

      const action = await store.dispatch(fetchProductsAsync({ delayMs: 10, shouldFail: true }));

      expect(action.type).toBe('products/fetchProducts/rejected');
      const state = store.getState().products;
      expect(state.status).toBe('failed');
      expect(state.error).toContain('Lỗi 503 Service Unavailable');
    });
  });

  describe('Integration Test: ProductList Render States', () => {
    it('hiển thị danh sách sản phẩm và bộ lọc khi trạng thái succeeded', () => {
      const setDataSource = jest.fn();

      renderWithProviders(
        <ProductList dataSource="thunk" setDataSource={setDataSource} />,
        {
          preloadedState: {
            products: {
              items: mockSampleProducts,
              status: 'succeeded',
              error: null,
              selectedCategory: 'Tất cả',
              searchQuery: '',
              sortBy: 'default',
            },
          },
        }
      );

      // Kiểm tra tên các sản phẩm xuất hiện trên DOM
      expect(screen.getByText('Màn hình Dell UltraSharp U2723QE 4K')).toBeInTheDocument();
      expect(screen.getByText('Tai nghe Sony WH-1000XM5 Chống Ồn')).toBeInTheDocument();
      expect(screen.getByText(/Danh Sách Thiết Bị & Phụ Kiện Công Nghệ/i)).toBeInTheDocument();
    });

    it('hiển thị thông báo lỗi và nút "Thử lại ngay" khi trạng thái failed', () => {
      const setDataSource = jest.fn();

      const { store } = renderWithProviders(
        <ProductList dataSource="thunk" setDataSource={setDataSource} />,
        {
          preloadedState: {
            products: {
              items: [],
              status: 'failed',
              error: 'Lỗi 503 Service Unavailable: Không thể kết nối tới máy chủ sản phẩm!',
              selectedCategory: 'Tất cả',
              searchQuery: '',
              sortBy: 'default',
            },
          },
        }
      );

      // Verify thông báo lỗi hiển thị rõ ràng
      expect(screen.getByText('Gặp lỗi khi tải dữ liệu sản phẩm')).toBeInTheDocument();
      expect(
        screen.getByText(/Không thể kết nối tới máy chủ sản phẩm/i)
      ).toBeInTheDocument();

      // Nút Thử lại ngay
      const retryBtn = screen.getByRole('button', { name: /thử lại ngay/i });
      expect(retryBtn).toBeInTheDocument();

      // Click thử lại
      fireEvent.click(retryBtn);
      // Kiểm tra Redux action được kích hoạt và chuyển ngay sang status loading
      expect(store.getState().products.status).toBe('loading');
    });
  });
});
