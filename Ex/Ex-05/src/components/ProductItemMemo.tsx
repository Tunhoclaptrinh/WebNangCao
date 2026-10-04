import React, { useRef } from 'react';
import { Tag, Button } from 'antd';
import { ShoppingCartOutlined, FireOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Product } from '../types/product.ts';

interface ProductItemMemoProps {
  product: Product;
  style?: React.CSSProperties;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

/**
 * ⚡ ĐÃ TỐI ƯU: Sử dụng React.memo kết hợp so sánh props (Slide 8, 9, 14)
 * Khi component cha re-render nhưng product không đổi và callback giữ nguyên tham chiếu (useCallback),
 * React.memo sẽ BỎ QUA việc render lại, tiết kiệm tối đa CPU!
 */
export const ProductItemMemo = React.memo<ProductItemMemoProps>(
  function ProductItemMemo({ product, style, onQuickView, onAddToCart }) {
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
          ...style,
          boxSizing: 'border-box',
          padding: '4px 8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e8e8e8',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'border-color 0.2s',
          }}
        >
          {/* Cột 1: Thông tin sản phẩm */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#52c41a',
                fontWeight: 700,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              #{product.id.replace('PRD-', '')}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#1f1f1f',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 380,
                  }}
                  title={product.name}
                >
                  {product.name}
                </span>
                <Tag color="cyan">{product.category}</Tag>
                <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
                <Tag color="volcano" style={{ fontSize: 11 }}>
                  <FireOutlined /> {product.salesCount.toLocaleString('vi-VN')} đã bán
                </Tag>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
                <span>SKU: <strong style={{ color: '#595959' }}>{product.sku}</strong></span>
                <span>Kho: <strong style={{ color: product.stock < 15 ? '#cf1322' : '#389e0d' }}>{product.stock}</strong></span>
                <span>Đánh giá: ⭐ <strong>{product.rating}</strong></span>
                <span style={{ color: '#52c41a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircleOutlined /> Render count: {renderCounter.current} (Tối ưu)
                </span>
              </div>
            </div>
          </div>

          {/* Cột 2: Giá & Nút hành động */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, marginLeft: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0958d9' }}>
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
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function (Slide 9):
    // Chỉ re-render nếu product hoặc style hoặc handler thực sự thay đổi
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.stock === nextProps.product.stock &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.status === nextProps.product.status &&
      prevProps.style?.top === nextProps.style?.top &&
      prevProps.onQuickView === nextProps.onQuickView &&
      prevProps.onAddToCart === nextProps.onAddToCart
    );
  }
);
