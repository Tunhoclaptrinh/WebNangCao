import { screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '../CartDrawer.tsx';
import { renderWithProviders } from '../../../test-utils.tsx';
import type { CartItem } from '../cartTypes.ts';

const mockCartItem: CartItem = {
  id: 'drawer-item-1',
  name: 'Tai nghe Sony WH-1000XM5',
  price: 7990000,
  category: 'Âm thanh',
  quantity: 1,
  stock: 10,
  imageColor: '#000',
};

describe('CartDrawer Component Integration Tests (Slide 33)', () => {
  it('hiển thị thông báo giỏ hàng trống khi không có sản phẩm', () => {
    const onCheckout = jest.fn();
    const { store } = renderWithProviders(<CartDrawer onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          discountAmount: 0,
          finalAmount: 0,
          appliedCoupon: null,
          isDrawerOpen: true,
        },
      },
    });

    expect(screen.getByText(/Giỏ hàng của bạn đang trống!/i)).toBeInTheDocument();
    const continueBtn = screen.getByRole('button', { name: /tiếp tục mua sắm/i });
    expect(continueBtn).toBeInTheDocument();

    fireEvent.click(continueBtn);
    expect(store.getState().cart.isDrawerOpen).toBe(false);
  });

  it('hiển thị danh sách sản phẩm và phần tổng kết khi giỏ hàng có mặt hàng', () => {
    const onCheckout = jest.fn();
    renderWithProviders(<CartDrawer onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: [mockCartItem],
          totalQuantity: 1,
          subtotal: 7990000,
          discountAmount: 0,
          finalAmount: 7990000,
          appliedCoupon: null,
          isDrawerOpen: true,
        },
      },
    });

    expect(screen.getByText('Tai nghe Sony WH-1000XM5')).toBeInTheDocument();
    expect(screen.getByText(/Tiến Hành Thanh Toán/i)).toBeInTheDocument();
  });
});
