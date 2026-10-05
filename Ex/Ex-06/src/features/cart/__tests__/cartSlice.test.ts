import {
  cartSlice,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setDrawerOpen,
} from '../cartSlice.ts';
import type { CartState, CartItem } from '../cartTypes.ts';

describe('cartSlice Redux Unit Tests (Mẫu AAA)', () => {
  const reducer = cartSlice.reducer;

  const sampleItem: Omit<CartItem, 'quantity'> & { quantity?: number } = {
    id: 'test-item-1',
    name: 'Chuột Gaming Không Dây',
    price: 1500000,
    stock: 5,
    category: 'Chuột',
    imageColor: '#000000',
  };

  const getEmptyState = (): CartState => ({
    items: [],
    totalQuantity: 0,
    subtotal: 0,
    discountAmount: 0,
    finalAmount: 0,
    appliedCoupon: null,
    couponError: null,
    isDrawerOpen: false,
  });

  describe('1. addItem Reducer', () => {
    it('thêm sản phẩm mới vào giỏ hàng rỗng và cập nhật tổng tiền', () => {
      // Arrange
      const initialState = getEmptyState();

      // Act
      const nextState = reducer(initialState, addItem(sampleItem));

      // Assert
      expect(nextState.items).toHaveLength(1);
      expect(nextState.items[0].id).toBe('test-item-1');
      expect(nextState.items[0].quantity).toBe(1);
      expect(nextState.totalQuantity).toBe(1);
      expect(nextState.subtotal).toBe(1500000);
      expect(nextState.finalAmount).toBe(1500000);
      expect(nextState.isDrawerOpen).toBe(true);
    });

    it('tăng số lượng khi thêm sản phẩm đã tồn tại, không vượt quá tồn kho (stock)', () => {
      // Arrange: Giỏ đã có 4 sản phẩm, tồn kho là 5
      const stateWithItem: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, quantity: 4 }],
        totalQuantity: 4,
        subtotal: 6000000,
        finalAmount: 6000000,
      };

      // Act: Thêm tiếp 3 sản phẩm (4 + 3 = 7 > stock 5)
      const nextState = reducer(stateWithItem, addItem({ ...sampleItem, quantity: 3 }));

      // Assert: Chỉ tăng tối đa đến stock là 5
      expect(nextState.items[0].quantity).toBe(5);
      expect(nextState.totalQuantity).toBe(5);
      expect(nextState.subtotal).toBe(7500000); // 5 * 1.500.000
    });
  });

  describe('2. updateQuantity Reducer', () => {
    it('cập nhật số lượng sản phẩm chính xác', () => {
      // Arrange
      const stateWithItem: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, quantity: 2 }],
        totalQuantity: 2,
        subtotal: 3000000,
        finalAmount: 3000000,
      };

      // Act
      const nextState = reducer(stateWithItem, updateQuantity({ id: 'test-item-1', quantity: 4 }));

      // Assert
      expect(nextState.items[0].quantity).toBe(4);
      expect(nextState.totalQuantity).toBe(4);
      expect(nextState.subtotal).toBe(6000000);
    });

    it('tự động xóa sản phẩm khỏi giỏ hàng khi quantity <= 0 (Trường hợp biên)', () => {
      // Arrange
      const stateWithItem: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, quantity: 2 }],
        totalQuantity: 2,
        subtotal: 3000000,
        finalAmount: 3000000,
      };

      // Act: Cập nhật quantity = 0
      const nextState = reducer(stateWithItem, updateQuantity({ id: 'test-item-1', quantity: 0 }));

      // Assert: Sản phẩm bị xóa sạch
      expect(nextState.items).toHaveLength(0);
      expect(nextState.totalQuantity).toBe(0);
      expect(nextState.subtotal).toBe(0);
    });
  });

  describe('3. removeItem Reducer', () => {
    it('xóa sản phẩm theo ID thành công và cập nhật lại giỏ hàng', () => {
      // Arrange
      const stateWithItem: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, quantity: 2 }],
        totalQuantity: 2,
        subtotal: 3000000,
        finalAmount: 3000000,
      };

      // Act
      const nextState = reducer(stateWithItem, removeItem('test-item-1'));

      // Assert
      expect(nextState.items).toHaveLength(0);
      expect(nextState.totalQuantity).toBe(0);
      expect(nextState.subtotal).toBe(0);
    });

    it('xử lý an toàn khi xóa sản phẩm có ID không tồn tại (Trường hợp biên Slide 32)', () => {
      // Arrange
      const stateWithItem: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, quantity: 1 }],
        totalQuantity: 1,
        subtotal: 1500000,
        finalAmount: 1500000,
      };

      // Act: Xóa id 'non-existent-id'
      const nextState = reducer(stateWithItem, removeItem('non-existent-id'));

      // Assert: Giỏ hàng không đổi, không văng ngoại lệ
      expect(nextState.items).toHaveLength(1);
      expect(nextState.totalQuantity).toBe(1);
      expect(nextState.subtotal).toBe(1500000);
    });
  });

  describe('4. clearCart Reducer', () => {
    it('làm rỗng toàn bộ giỏ hàng và thiết lập lại các chỉ số về 0', () => {
      // Arrange
      const stateWithItems: CartState = {
        ...getEmptyState(),
        items: [
          { ...sampleItem, quantity: 2 },
          { ...sampleItem, id: 'test-item-2', quantity: 1 },
        ],
        totalQuantity: 3,
        subtotal: 4500000,
        finalAmount: 4500000,
      };

      // Act
      const nextState = reducer(stateWithItems, clearCart());

      // Assert
      expect(nextState.items).toEqual([]);
      expect(nextState.totalQuantity).toBe(0);
      expect(nextState.subtotal).toBe(0);
      expect(nextState.finalAmount).toBe(0);
      expect(nextState.appliedCoupon).toBeNull();
    });
  });

  describe('5. applyCoupon & removeCoupon Reducer', () => {
    it('áp dụng mã LTWNC10 giảm 10% khi đơn hàng đạt mức tối thiểu', () => {
      // Arrange: Đơn hàng 2.000.000 đ
      const stateWithItems: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, price: 2000000, quantity: 1 }],
        subtotal: 2000000,
        totalQuantity: 1,
        finalAmount: 2000000,
      };

      // Act
      const nextState = reducer(stateWithItems, applyCoupon('LTWNC10'));

      // Assert: Giảm 10% = 200.000 đ, finalAmount = 1.800.000 đ
      expect(nextState.appliedCoupon?.code).toBe('LTWNC10');
      expect(nextState.discountAmount).toBe(200000);
      expect(nextState.finalAmount).toBe(1800000);
      expect(nextState.couponError).toBeNull();
    });

    it('báo lỗi khi áp dụng mã không tồn tại', () => {
      // Arrange
      const stateWithItems: CartState = {
        ...getEmptyState(),
        subtotal: 2000000,
      };

      // Act
      const nextState = reducer(stateWithItems, applyCoupon('NOT_EXISTS'));

      // Assert
      expect(nextState.appliedCoupon).toBeNull();
      expect(nextState.couponError).toContain('không tồn tại');
    });

    it('áp dụng mã coupon giảm tiền cố định (PTIT200K)', () => {
      // Arrange
      const stateWithItems: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, price: 3500000, quantity: 1 }],
        subtotal: 3500000,
      };

      // Act
      const nextState = reducer(stateWithItems, applyCoupon('PTIT200K'));

      // Assert: Giảm cố định 200.000 đ
      expect(nextState.appliedCoupon?.code).toBe('PTIT200K');
      expect(nextState.discountAmount).toBe(200000);
      expect(nextState.finalAmount).toBe(3300000);
    });

    it('báo lỗi khi đơn hàng chưa đạt giá trị tối thiểu của mã coupon', () => {
      // Arrange: Subtotal 500k chưa đạt 1 triệu của LTWNC10
      const stateWithItems: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, price: 500000, quantity: 1 }],
        subtotal: 500000,
      };

      // Act
      const nextState = reducer(stateWithItems, applyCoupon('LTWNC10'));

      // Assert
      expect(nextState.appliedCoupon).toBeNull();
      expect(nextState.couponError).toContain('yêu cầu đơn hàng tối thiểu');
    });

    it('tự động gỡ coupon khi xóa sản phẩm khiến subtotal nhỏ hơn minSpend', () => {
      // Arrange: 2 sản phẩm tổng 3.000.000 đ thỏa mãn PTIT200K (minSpend 3M)
      const stateWithCoupon: CartState = {
        ...getEmptyState(),
        items: [
          { ...sampleItem, id: 'item-1', price: 2000000, quantity: 1 },
          { ...sampleItem, id: 'item-2', price: 1500000, quantity: 1 },
        ],
        subtotal: 3500000,
        discountAmount: 200000,
        finalAmount: 3300000,
        appliedCoupon: {
          code: 'PTIT200K',
          description: 'Giảm 200k',
          discountFixed: 200000,
          minSpend: 3000000,
        },
      };

      // Act: Xóa item-1 (2.000.000 đ), còn lại 1.500.000 đ < minSpend 3M
      const nextState = reducer(stateWithCoupon, removeItem('item-1'));

      // Assert: Coupon bị hủy bỏ và có thông báo lỗi
      expect(nextState.appliedCoupon).toBeNull();
      expect(nextState.couponError).toContain('Mã giảm giá đã bị gỡ');
      expect(nextState.discountAmount).toBe(0);
      expect(nextState.finalAmount).toBe(1500000);
    });

    it('gỡ bỏ mã giảm giá thành công khi gọi removeCoupon', () => {
      // Arrange
      const stateWithCoupon: CartState = {
        ...getEmptyState(),
        items: [{ ...sampleItem, price: 2000000, quantity: 1 }],
        subtotal: 2000000,
        discountAmount: 200000,
        finalAmount: 1800000,
        appliedCoupon: {
          code: 'LTWNC10',
          description: 'Giảm 10%',
          discountPercent: 10,
          minSpend: 1000000,
        },
      };

      // Act
      const nextState = reducer(stateWithCoupon, removeCoupon());

      // Assert
      expect(nextState.appliedCoupon).toBeNull();
      expect(nextState.discountAmount).toBe(0);
      expect(nextState.finalAmount).toBe(2000000);
    });

    it('setDrawerOpen: điều khiển trạng thái mở/đóng drawer', () => {
      const stateClosed: CartState = { ...getEmptyState(), isDrawerOpen: false };
      const stateOpen = reducer(stateClosed, setDrawerOpen(true));
      expect(stateOpen.isDrawerOpen).toBe(true);

      const stateClosedAgain = reducer(stateOpen, setDrawerOpen(false));
      expect(stateClosedAgain.isDrawerOpen).toBe(false);
    });
  });
});

