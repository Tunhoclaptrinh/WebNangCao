import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../ProductCard.tsx';
import { renderWithProviders } from '../../../test-utils.tsx';
import type { Product } from '../productTypes.ts';

describe('ProductCard Component Integration Tests (Slide 33)', () => {
  const sampleProduct: Product = {
    id: 'prod-in-stock',
    name: 'Bàn phím cơ Custom Akko Mod007',
    price: 3200000,
    originalPrice: 3800000,
    category: 'Bàn phím',
    description: 'Bàn phím nhôm CNC cao cấp',
    specs: ['Gasket Mount', 'Hotswap 5 pin'],
    stock: 5,
    rating: 4.9,
    reviewsCount: 42,
    imageColor: '#1e1b4b',
  };

  it('hiển thị đúng tên sản phẩm, danh mục, giá tiền và rating', () => {
    // Arrange & Act
    renderWithProviders(<ProductCard product={sampleProduct} />);

    // Assert: Ưu tiên getByRole và getByText theo Slide 29
    expect(screen.getByText('Bàn phím cơ Custom Akko Mod007')).toBeInTheDocument();
    expect(screen.getByText('Bàn phím')).toBeInTheDocument();
    expect(screen.getByText(/3\.200\.000/)).toBeInTheDocument();
    expect(screen.getByText('(42)')).toBeInTheDocument();
  });

  it('click nút "Thêm vào giỏ" kích hoạt thêm sản phẩm vào Redux Store', async () => {
    // Arrange
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ProductCard product={sampleProduct} />, {
      preloadedState: {
        cart: {
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          discountAmount: 0,
          finalAmount: 0,
          appliedCoupon: null,
          isDrawerOpen: false,
        },
      },
    });

    // Ban đầu giỏ hàng chưa có sản phẩm này
    const initialItem = store.getState().cart.items.find((i) => i.id === 'prod-in-stock');
    expect(initialItem).toBeUndefined();

    // Act: Tìm nút "Thêm vào giỏ" bằng getByRole và click
    const addButton = screen.getByRole('button', { name: /thêm vào giỏ/i });
    await user.click(addButton);

    // Assert: Redux store được cập nhật
    const cartItem = store.getState().cart.items.find((i) => i.id === 'prod-in-stock');
    expect(cartItem).toBeDefined();
    expect(cartItem?.quantity).toBe(1);
    expect(store.getState().cart.subtotal).toBe(3200000);
  });

  it('nút "Tạm hết hàng" bị vô hiệu hóa (disabled) khi tồn kho stock = 0', () => {
    // Arrange: Sản phẩm hết hàng
    const outOfStockProduct: Product = {
      ...sampleProduct,
      id: 'prod-out-of-stock',
      name: 'Màn hình OLED 4K (Hết Hàng)',
      stock: 0,
    };

    // Act
    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    // Assert: Nút hiển thị "Tạm hết hàng" và bị disabled
    const disabledButton = screen.getByRole('button', { name: /tạm hết hàng/i });
    expect(disabledButton).toBeInTheDocument();
    expect(disabledButton).toBeDisabled();
  });
});
