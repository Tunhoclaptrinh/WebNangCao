import { useFavoritesStore } from '../useFavoritesStore.ts';
import type { Product } from '../../features/products/productTypes.ts';

describe('useFavoritesStore Zustand Unit Tests (Slide 30)', () => {
  const sampleProduct: Product = {
    id: 'fav-01',
    name: 'Tai nghe Sony WH-1000XM5',
    price: 6990000,
    category: 'Âm thanh',
    description: 'Tai nghe chống ồn hàng đầu',
    specs: ['Bluetooth 5.2', 'Chống ồn ANC'],
    stock: 12,
    rating: 4.8,
    reviewsCount: 156,
    imageColor: '#000000',
  };

  beforeEach(() => {
    // Dọn dẹp store về trạng thái rỗng trước mỗi test
    useFavoritesStore.getState().clearFavorites();
  });

  it('thêm sản phẩm vào danh sách yêu thích và kiểm tra bằng isFavorite', () => {
    // Act
    useFavoritesStore.getState().addFavorite(sampleProduct);

    // Assert
    const state = useFavoritesStore.getState();
    expect(state.favorites).toHaveLength(1);
    expect(state.favorites[0].id).toBe('fav-01');
    expect(state.isFavorite('fav-01')).toBe(true);
    expect(state.isFavorite('non-existent')).toBe(false);
  });

  it('không thêm trùng lặp sản phẩm đã có trong danh sách', () => {
    // Act: Gọi addFavorite 2 lần liên tiếp
    useFavoritesStore.getState().addFavorite(sampleProduct);
    useFavoritesStore.getState().addFavorite(sampleProduct);

    // Assert: Độ dài vẫn chỉ là 1
    const state = useFavoritesStore.getState();
    expect(state.favorites).toHaveLength(1);
  });

  it('bật/tắt trạng thái yêu thích linh hoạt qua toggleFavorite', () => {
    // Act 1: Chưa có -> Thêm vào
    useFavoritesStore.getState().toggleFavorite(sampleProduct);
    expect(useFavoritesStore.getState().isFavorite('fav-01')).toBe(true);

    // Act 2: Đã có -> Bỏ khỏi danh sách
    useFavoritesStore.getState().toggleFavorite(sampleProduct);
    expect(useFavoritesStore.getState().isFavorite('fav-01')).toBe(false);
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });

  it('xóa sản phẩm theo ID qua removeFavorite', () => {
    // Arrange
    useFavoritesStore.getState().addFavorite(sampleProduct);

    // Act
    useFavoritesStore.getState().removeFavorite('fav-01');

    // Assert
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });

  it('xóa sạch toàn bộ danh sách khi gọi clearFavorites', () => {
    // Arrange: Thêm 2 sản phẩm
    useFavoritesStore.getState().addFavorite(sampleProduct);
    useFavoritesStore.getState().addFavorite({ ...sampleProduct, id: 'fav-02', name: 'Món 2' });

    // Act
    useFavoritesStore.getState().clearFavorites();

    // Assert
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });
});
