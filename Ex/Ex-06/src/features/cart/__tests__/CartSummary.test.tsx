import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { CartSummary } from '../CartSummary.tsx';
import { renderWithProviders } from '../../../test-utils.tsx';
import type { CartItem } from '../cartTypes.ts';

const mockCartItems: CartItem[] = [
  {
    id: 'prod-01',
    name: 'Bàn phím cơ Keychron Q1 Pro',
    price: 4000000,
    originalPrice: 4500000,
    category: 'Bàn phím',
    quantity: 1,
    stock: 10,
    imageColor: '#312e81',
  },
];

describe('CartSummary Component Integration Tests (Slide 33 & 36)', () => {
  it('không render gì (null) khi giỏ hàng hoàn toàn trống', () => {
    const onCheckout = jest.fn();
    const { container } = renderWithProviders(<CartSummary onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          discountAmount: 0,
          finalAmount: 0,
          appliedCoupon: null,
        },
      },
    });

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('hiển thị chi tiết thanh toán đúng giá trị: số món, tạm tính và tổng tiền', () => {
    const onCheckout = jest.fn();
    renderWithProviders(<CartSummary onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: mockCartItems,
          totalQuantity: 1,
          subtotal: 4000000,
          discountAmount: 0,
          finalAmount: 4000000,
          appliedCoupon: null,
          couponError: null,
        },
      },
    });

    expect(screen.getByText(/1 món/i)).toBeInTheDocument();
    // 4.000.000 đ hiển thị ở Tạm tính và nút Tiến Hành Thanh Toán
    const priceElements = screen.getAllByText(/4\.000\.000 đ/i);
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Tổng tiền thanh toán:/i)).toBeInTheDocument();
  });

  it('áp dụng mã giảm giá hợp lệ thành công và cập nhật chiết khấu trong Redux', () => {
    const onCheckout = jest.fn();

    const { store } = renderWithProviders(<CartSummary onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: mockCartItems,
          totalQuantity: 1,
          subtotal: 4000000,
          discountAmount: 0,
          finalAmount: 4000000,
          appliedCoupon: null,
          couponError: null,
        },
      },
    });

    // Nhập mã voucher LTWNC10 (giảm 10% cho đơn >= 1.000.000 đ)
    const input = screen.getByPlaceholderText(/nhập mã voucher/i);
    fireEvent.change(input, { target: { value: 'LTWNC10' } });

    const applyButton = screen.getByRole('button', { name: /áp dụng/i });
    fireEvent.click(applyButton);

    // Kiểm tra state Redux và giao diện
    expect(store.getState().cart.appliedCoupon?.code).toBe('LTWNC10');
    expect(store.getState().cart.discountAmount).toBe(400000);
    expect(store.getState().cart.finalAmount).toBe(3600000);

    expect(screen.getByText(/Đã áp dụng: LTWNC10/i)).toBeInTheDocument();
  });

  it('hiển thị thông báo lỗi khi nhập mã voucher không tồn tại', () => {
    const onCheckout = jest.fn();

    renderWithProviders(<CartSummary onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: mockCartItems,
          totalQuantity: 1,
          subtotal: 4000000,
          discountAmount: 0,
          finalAmount: 4000000,
          appliedCoupon: null,
          couponError: null,
        },
      },
    });

    const input = screen.getByPlaceholderText(/nhập mã voucher/i);
    fireEvent.change(input, { target: { value: 'INVALID_CODE_999' } });

    const applyButton = screen.getByRole('button', { name: /áp dụng/i });
    fireEvent.click(applyButton);

    expect(
      screen.getByText(/Mã "INVALID_CODE_999" không tồn tại hoặc đã hết hạn/i)
    ).toBeInTheDocument();
  });

  it('gỡ bỏ mã coupon khi click nút "Gỡ bỏ"', () => {
    const onCheckout = jest.fn();

    const { store } = renderWithProviders(<CartSummary onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: mockCartItems,
          totalQuantity: 1,
          subtotal: 4000000,
          discountAmount: 400000,
          finalAmount: 3600000,
          appliedCoupon: {
            code: 'LTWNC10',
            description: 'Giảm 10% cho sinh viên môn Web Nâng Cao',
            discountPercent: 10,
            minSpend: 1000000,
          },
          couponError: null,
        },
      },
    });

    const removeButton = screen.getByRole('button', { name: /gỡ bỏ/i });
    fireEvent.click(removeButton);

    expect(store.getState().cart.appliedCoupon).toBeNull();
    expect(store.getState().cart.discountAmount).toBe(0);
    expect(store.getState().cart.finalAmount).toBe(4000000);
  });

  it('kích hoạt onCheckout callback khi nhấn nút "Tiến Hành Thanh Toán"', () => {
    const onCheckout = jest.fn();

    renderWithProviders(<CartSummary onCheckout={onCheckout} />, {
      preloadedState: {
        cart: {
          items: mockCartItems,
          totalQuantity: 1,
          subtotal: 4000000,
          discountAmount: 0,
          finalAmount: 4000000,
          appliedCoupon: null,
          couponError: null,
        },
      },
    });

    const checkoutButton = screen.getByRole('button', { name: /tiến hành thanh toán/i });
    fireEvent.click(checkoutButton);

    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
});
