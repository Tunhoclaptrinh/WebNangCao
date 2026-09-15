import { useState } from 'react';
import {
  ClearOutlined,
  CreditCardOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Divider,
  Input,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import {
  AVAILABLE_COUPONS,
  applyCoupon,
  clearCart,
  removeCoupon,
} from './cartSlice.ts';

const { Text } = Typography;

interface CartSummaryProps {
  onCheckout: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const dispatch = useAppDispatch();
  const {
    totalQuantity,
    subtotal,
    discountAmount,
    finalAmount,
    appliedCoupon,
    couponError,
    items,
  } = useAppSelector((state) => state.cart);

  const [couponInput, setCouponInput] = useState('');

  const handleApply = () => {
    if (couponInput.trim()) {
      dispatch(applyCoupon(couponInput));
      setCouponInput('');
    }
  };

  const handleQuickApply = (code: string) => {
    dispatch(applyCoupon(code));
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card
      style={{
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{ padding: 18 }}
    >
      {/* Khối nhập mã coupon */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
          <TagOutlined /> Mã Giảm Giá Ưu Đãi:
        </Text>
        <Space.Compact style={{ width: '100%', marginBottom: 8 }}>
          <Input
            placeholder="Nhập mã voucher (vd: LTWNC10)"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            onPressEnter={handleApply}
            style={{ textTransform: 'uppercase' }}
          />
          <Button type="primary" onClick={handleApply}>
            Áp dụng
          </Button>
        </Space.Compact>

        {/* Gợi ý coupon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Gợi ý:</Text>
          {AVAILABLE_COUPONS.map((c) => (
            <Tag
              key={c.code}
              color={appliedCoupon?.code === c.code ? 'success' : 'processing'}
              style={{ cursor: 'pointer', fontSize: 11 }}
              onClick={() => handleQuickApply(c.code)}
              title={c.description}
            >
              🏷️ {c.code}
            </Tag>
          ))}
        </div>

        {/* Lỗi coupon */}
        {couponError && (
          <Alert
            message={couponError}
            type="error"
            showIcon
            style={{ marginTop: 8, padding: '4px 10px', fontSize: 12 }}
          />
        )}

        {/* Coupon đang áp dụng */}
        {appliedCoupon && (
          <Alert
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <strong>Đã áp dụng: {appliedCoupon.code}</strong> — {appliedCoupon.description}
                </span>
                <Button
                  type="link"
                  danger
                  size="small"
                  onClick={() => dispatch(removeCoupon())}
                  style={{ padding: 0, height: 'auto' }}
                >
                  Gỡ bỏ
                </Button>
              </div>
            }
            type="success"
            showIcon
            style={{ marginTop: 8, padding: '6px 12px', fontSize: 12 }}
          />
        )}
      </div>

      <Divider style={{ margin: '14px 0' }} />

      {/* Chi tiết thanh toán */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4b5563' }}>
          <span>Số lượng mặt hàng:</span>
          <strong>{totalQuantity} món</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4b5563' }}>
          <span>Tạm tính:</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {subtotal.toLocaleString('vi-VN')} đ
          </span>
        </div>
        {discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#52c41a' }}>
            <span>Chiết khấu mã giảm:</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
              -{discountAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>
        )}
      </div>

      {/* Tổng cộng */}
      <div style={{ background: '#f9fafb', padding: '12px 16px', borderRadius: 6, marginBottom: 16, border: '1px solid #f3f4f6' }}>
        <Statistic
          title="Tổng tiền thanh toán:"
          value={finalAmount}
          suffix="đ"
          valueStyle={{ color: '#1677ff', fontWeight: 800, fontSize: 22, fontFamily: "'JetBrains Mono', monospace" }}
        />
      </div>

      {/* Nút hành động */}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Button
          type="primary"
          size="large"
          block
          icon={<CreditCardOutlined />}
          onClick={onCheckout}
          style={{ fontWeight: 700, boxShadow: '0 2px 8px rgba(22, 119, 255, 0.25)' }}
        >
          Tiến Hành Thanh Toán ({finalAmount.toLocaleString('vi-VN')} đ)
        </Button>

        <Button
          type="dashed"
          danger
          block
          icon={<ClearOutlined />}
          onClick={() => dispatch(clearCart())}
          size="middle"
        >
          Làm trống giỏ hàng
        </Button>
      </Space>
    </Card>
  );
}
