import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { useAppDispatch } from '../../app/hooks.ts';
import { removeItem, updateQuantity } from './cartSlice.ts';
import type { CartItem } from './cartTypes.ts';

const { Text } = Typography;

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const dispatch = useAppDispatch();

  const handleDecrease = () => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        marginBottom: 10,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Icon danh mục thumbnail */}
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 6,
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
          border: '1px solid #e5e7eb',
        }}
      >
        {item.category === 'Màn hình' && '🖥️'}
        {item.category === 'Bàn phím' && '⌨️'}
        {item.category === 'Chuột' && '🖱️'}
        {item.category === 'Âm thanh' && '🎧'}
        {item.category === 'Phụ kiện' && '💡'}
      </div>

      {/* Thông tin sản phẩm */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>
          {item.category}
        </Text>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#111827',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: '2px 0',
          }}
          title={item.name}
        >
          {item.name}
        </div>
        <Text type="secondary" style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
          {item.price.toLocaleString('vi-VN')} đ
        </Text>
      </div>

      {/* Điều khiển số lượng & Xóa */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <Space.Compact size="small">
          <Button icon={<MinusOutlined />} onClick={handleDecrease} />
          <span
            style={{
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              borderTop: '1px solid #d9d9d9',
              borderBottom: '1px solid #d9d9d9',
              background: '#ffffff',
            }}
          >
            {item.quantity}
          </span>
          <Button
            icon={<PlusOutlined />}
            onClick={handleIncrease}
            disabled={item.quantity >= item.stock}
          />
        </Space.Compact>

        <Space size={8} align="center">
          <Text strong style={{ color: '#1677ff', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
            {(item.price * item.quantity).toLocaleString('vi-VN')} đ
          </Text>
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            title="Xóa khỏi giỏ"
          />
        </Space>
      </div>
    </div>
  );
}
