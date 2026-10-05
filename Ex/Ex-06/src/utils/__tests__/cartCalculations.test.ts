import {
  calculateTotalQuantity,
  calculateSubtotal,
  calculateDiscount,
  calcTotal,
  validateCoupon,
  formatCurrency,
  AVAILABLE_COUPONS,
} from '../cartCalculations.ts';
import type { CartItem } from '../../features/cart/cartTypes.ts';

describe('cartCalculations Utility Tests (Mẫu AAA)', () => {
  const mockItems: CartItem[] = [
    {
      id: 'prod-01',
      name: 'Màn hình Dell UltraSharp U2723QE',
      price: 13500000,
      quantity: 1,
      stock: 5,
      category: 'Màn hình',
      imageColor: '#1e293b',
    },
    {
      id: 'prod-02',
      name: 'Bàn phím cơ Keychron Q1 Pro',
      price: 4390000,
      quantity: 2,
      stock: 10,
      category: 'Bàn phím',
      imageColor: '#312e81',
    },
  ];

  describe('1. calculateTotalQuantity', () => {
    it('trả về 0 khi giỏ hàng rỗng', () => {
      // Arrange
      const items: CartItem[] = [];
      // Act
      const result = calculateTotalQuantity(items);
      // Assert
      expect(result).toBe(0);
    });

    it('tính chính xác tổng số lượng các mặt hàng', () => {
      // Arrange & Act
      const result = calculateTotalQuantity(mockItems);
      // Assert: 1 + 2 = 3
      expect(result).toBe(3);
    });
  });

  describe('2. calculateSubtotal', () => {
    it('trả về 0 đ khi giỏ hàng không có sản phẩm', () => {
      // Arrange & Act
      const result = calculateSubtotal([]);
      // Assert
      expect(result).toBe(0);
    });

    it('tính chính xác tạm tính (price * quantity)', () => {
      // Arrange & Act: 13.500.000*1 + 4.390.000*2 = 13.500.000 + 8.780.000 = 22.280.000
      const result = calculateSubtotal(mockItems);
      // Assert
      expect(result).toBe(22280000);
    });
  });

  describe('3. calculateDiscount', () => {
    it('trả về 0 khi không có coupon hoặc coupon = null', () => {
      // Arrange & Act
      const discount = calculateDiscount(5000000, null);
      // Assert
      expect(discount).toBe(0);
    });

    it('trả về 0 khi đơn hàng chưa đạt mức tối thiểu của coupon', () => {
      // Arrange: LTWNC10 yêu cầu tối thiểu 1.000.000 đ
      const coupon = AVAILABLE_COUPONS.LTWNC10;
      // Act: Đơn hàng chỉ 800.000 đ
      const discount = calculateDiscount(800000, coupon);
      // Assert
      expect(discount).toBe(0);
    });

    it('tính đúng số tiền giảm theo tỷ lệ phần trăm (10% của 2.000.000 đ = 200.000 đ)', () => {
      // Arrange
      const coupon = AVAILABLE_COUPONS.LTWNC10;
      // Act
      const discount = calculateDiscount(2000000, coupon);
      // Assert
      expect(discount).toBe(200000);
    });

    it('tính đúng số tiền giảm cố định (PTIT200K giảm 200.000 đ khi đơn từ 3.000.000 đ)', () => {
      // Arrange
      const coupon = AVAILABLE_COUPONS.PTIT200K;
      // Act
      const discount = calculateDiscount(3500000, coupon);
      // Assert
      expect(discount).toBe(200000);
    });
  });

  describe('4. calcTotal (Hàm tổng hợp chính theo Slide 32)', () => {
    it('tính toán chính xác toàn bộ chỉ số khi áp dụng mã giảm giá', () => {
      // Arrange
      const coupon = AVAILABLE_COUPONS.LTWNC10; // Giảm 10%
      // Act
      const totals = calcTotal(mockItems, coupon);

      // Assert
      expect(totals.totalQuantity).toBe(3);
      expect(totals.subtotal).toBe(22280000);
      expect(totals.discountAmount).toBe(2228000); // 10% của 22.280.000 đ
      expect(totals.finalAmount).toBe(20052000); // 22.280.000 - 2.228.000
    });

    it('xử lý an toàn khi giỏ hàng rỗng', () => {
      // Act
      const totals = calcTotal([], AVAILABLE_COUPONS.LTWNC10);

      // Assert
      expect(totals.totalQuantity).toBe(0);
      expect(totals.subtotal).toBe(0);
      expect(totals.discountAmount).toBe(0);
      expect(totals.finalAmount).toBe(0);
    });
  });

  describe('5. validateCoupon', () => {
    it('từ chối mã giảm giá không tồn tại', () => {
      // Act
      const result = validateCoupon('INVALID_CODE', 5000000);
      // Assert
      expect(result.valid).toBe(false);
      expect(result.coupon).toBeNull();
      expect(result.error).toContain('không hợp lệ');
    });

    it('từ chối khi đơn hàng chưa đủ giá trị tối thiểu', () => {
      // Act: Mã VIP500K yêu cầu tối thiểu 10.000.000 đ
      const result = validateCoupon('VIP500K', 2000000);
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Đơn hàng tối thiểu');
    });

    it('chấp nhận mã giảm giá hợp lệ và không phân biệt chữ hoa/thường', () => {
      // Act: Gõ mã chữ thường 'ltwnc10'
      const result = validateCoupon('  ltwnc10  ', 2000000);
      // Assert
      expect(result.valid).toBe(true);
      expect(result.coupon?.code).toBe('LTWNC10');
      expect(result.error).toBeNull();
    });
  });

  describe('6. formatCurrency', () => {
    it('định dạng số tiền theo đúng chuẩn tiền tệ VND', () => {
      // Act & Assert
      expect(formatCurrency(1500000)).toContain('1.500.000');
      expect(formatCurrency(1500000)).toContain('đ');
    });
  });
});
