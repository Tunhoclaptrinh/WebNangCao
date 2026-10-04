import React, { useRef } from 'react';
import { Tag, Button } from 'antd';
import { ShoppingCartOutlined, FireOutlined, EyeOutlined } from '@ant-design/icons';
import type { Product } from '../types/product.ts';

interface ProductItemUnmemoProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isHighlighted?: boolean;
}

/**
 * ❌ CHƯA TỐI ƯU: KHÔNG sử dụng React.memo
 * Mỗi khi parent re-render (người dùng gõ search, toggle filter...),
 * toàn bộ 10.000 component này đều bị gọi lại hàm render (re-render thừa).
 */
export const ProductItemUnmemo: React.FC<ProductItemUnmemoProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const renderCounter = useRef(0);
  renderCounter.current += 1;

  const statusConfig = {
    in_stock: { color: 'success', text: 'Còn hàng' },
    low_stock: { color: 'warning', text: 'Sắp hết' },
    out_of_stock: { color: 'error', text: 'Hết hàng' },
  }[product.status];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        marginBottom: '8px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Cột 1: Thông tin sản phẩm */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: '#fff1f0',
            border: '1px solid #ffccc7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cf1322',
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          #{product.id.replace('PRD-', '')}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#1f1f1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </span>
            <Tag color="blue">{product.category}</Tag>
            <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
            <Tag color="volcano" style={{ fontSize: 11 }}>
              <FireOutlined /> {product.salesCount.toLocaleString('vi-VN')} đã bán
            </Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
            <span>SKU: <strong style={{ color: '#595959' }}>{product.sku}</strong></span>
            <span>Kho: <strong style={{ color: product.stock < 15 ? '#cf1322' : '#389e0d' }}>{product.stock}</strong></span>
            <span>Đánh giá: ⭐ <strong>{product.rating}</strong></span>
            <span style={{ color: '#ff4d4f', fontWeight: 600 }}>
              Re-renders: {renderCounter.current} lần ⚠️
            </span>
          </div>
        </div>
      </div>

      {/* Cột 2: Giá & Nút hành động */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, marginLeft: 16 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#da2128' }}>
            {product.price.toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: 11, color: '#bfbfbf', textDecoration: 'line-through' }}>
            {product.originalPrice.toLocaleString('vi-VN')} đ
          </div>
        </div>

        <Button
          icon={<EyeOutlined />}
          size="middle"
          onClick={() => onQuickView(product)}
        >
          Chi tiết
        </Button>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          size="middle"
          disabled={product.status === 'out_of_stock'}
          onClick={() => onAddToCart(product)}
        >
          Thêm
        </Button>
      </div>
    </div>
  );
};
