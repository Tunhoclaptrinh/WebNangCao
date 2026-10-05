import { screen, fireEvent } from '@testing-library/react';
import { CartItemRow } from '../CartItemRow.tsx';
import { renderWithProviders } from '../../../test-utils.tsx';
import type { CartItem } from '../cartTypes.ts';

const sampleItem: CartItem = {
  id: 'cart-row-01',
  name: 'Chuột Logitech MX Master 3S',
  price: 2350000,
  category: 'Chuột',
  quantity: 2,
  stock: 5,
  imageColor: '#1e1b4b',
};

describe('CartItemRow Component Unit/Integration Tests (Slide 33)', () => {
  it('hiển thị đầy đủ tên sản phẩm, danh mục, đơn giá và tổng giá tiền dòng', () => {
    renderWithProviders(<CartItemRow item={sampleItem} />);

    expect(screen.getByText('Chuột Logitech MX Master 3S')).toBeInTheDocument();
    expect(screen.getAllByText(/Chuột/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/2\.350\.000 đ/)).toBeInTheDocument();
    // Tổng giá 2 * 2.350.000 = 4.700.000 đ
    expect(screen.getByText(/4\.700\.000 đ/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('nhấn nút giảm (Minus) kích hoạt giảm số lượng sản phẩm', () => {
    const { store } = renderWithProviders(<CartItemRow item={sampleItem} />, {
      preloadedState: {
        cart: {
          items: [sampleItem],
          totalQuantity: 2,
          subtotal: 4700000,
          discountAmount: 0,
          finalAmount: 4700000,
        },
      },
    });

    // Nút minus đầu tiên trong space
    const buttons = screen.getAllByRole('button');
    const minusBtn = buttons[0];
    fireEvent.click(minusBtn);

    const updatedItem = store.getState().cart.items.find((i) => i.id === 'cart-row-01');
    expect(updatedItem?.quantity).toBe(1);
  });

  it('nhấn nút tăng (Plus) kích hoạt tăng số lượng sản phẩm', () => {
    const { store } = renderWithProviders(<CartItemRow item={sampleItem} />, {
      preloadedState: {
        cart: {
          items: [sampleItem],
          totalQuantity: 2,
          subtotal: 4700000,
          discountAmount: 0,
          finalAmount: 4700000,
        },
      },
    });

    const buttons = screen.getAllByRole('button');
    const plusBtn = buttons[1];
    fireEvent.click(plusBtn);

    const updatedItem = store.getState().cart.items.find((i) => i.id === 'cart-row-01');
    expect(updatedItem?.quantity).toBe(3);
  });

  it('vô hiệu hóa nút tăng khi số lượng đã đạt tồn kho tối đa (stock)', () => {
    const maxStockItem: CartItem = {
      ...sampleItem,
      quantity: 5,
      stock: 5,
    };

    renderWithProviders(<CartItemRow item={maxStockItem} />);

    const buttons = screen.getAllByRole('button');
    const plusBtn = buttons[1];
    expect(plusBtn).toBeDisabled();
  });

  it('nhấn nút xóa (Trash) kích hoạt removeItem khỏi Redux Store', () => {
    const { store } = renderWithProviders(<CartItemRow item={sampleItem} />, {
      preloadedState: {
        cart: {
          items: [sampleItem],
          totalQuantity: 2,
          subtotal: 4700000,
          discountAmount: 0,
          finalAmount: 4700000,
        },
      },
    });

    const removeBtn = screen.getByTitle('Xóa khỏi giỏ');
    fireEvent.click(removeBtn);

    const itemExists = store.getState().cart.items.some((i) => i.id === 'cart-row-01');
    expect(itemExists).toBe(false);
  });
});
