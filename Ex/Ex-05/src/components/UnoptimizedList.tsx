import React, { useEffect, useRef } from 'react';
import { Alert, Empty } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import type { Product } from '../types/product.ts';
import { ProductItemUnmemo } from './ProductItemUnmemo.tsx';

interface UnoptimizedListProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onRenderDurationMeasured?: (durationMs: number) => void;
}

/**
 * ❌ CHƯA TỐI ƯU (Before Optimization):
 * - Render toàn bộ danh sách (10.000 phần tử) bằng Array.prototype.map() trực tiếp vào DOM.
 * - KHÔNG Virtualization: Tạo ra ~10.000 DOM wrapper nodes cùng lúc trong document.
 * - KHÔNG React.memo: Bất kỳ state nào của cha thay đổi thì toàn bộ 10.000 con đều render lại.
 * - Dẫn đến: TBT tăng cao (>1500ms), LCP chậm, bộ nhớ RAM tăng, thao tác cuộn (scroll) bị lag (15-25 FPS).
 */
export const UnoptimizedList: React.FC<UnoptimizedListProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onRenderDurationMeasured,
}) => {
  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const elapsed = performance.now() - startTimeRef.current;
    if (onRenderDurationMeasured) {
      onRenderDurationMeasured(Number(elapsed.toFixed(1)));
    }
  });

  startTimeRef.current = performance.now();

  if (products.length === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', backgroundColor: '#fff', borderRadius: 8 }}>
        <Empty description="Không tìm thấy sản phẩm nào phù hợp với bộ lọc" />
      </div>
    );
  }

  return (
    <div className="unoptimized-container">
      <Alert
        message="CẢNH BÁO HIỆU NĂNG: CHẾ ĐỘ CHƯA TỐI ƯU (UNOPTIMIZED MODE)"
        description={
          <div>
            Đang trực tiếp render <strong>hàng ngàn DOM nodes thật (1.000 items)</strong> vào cây DOM bằng <code>.map()</code> thông thường mà KHÔNG dùng Virtualization.
            <br />
            ⚠️ <strong>Hậu quả:</strong> Main thread bị nghẽn (High TBT), thời gian vẽ trang đầu (LCP) kéo dài, tiêu hao nhiều RAM, cuộn trang bị giật lag rõ rệt (Jank).
          </div>
        }
        type="error"
        showIcon
        icon={<WarningOutlined style={{ fontSize: 20 }} />}
        style={{ marginBottom: 16, border: '1px solid #ffccc7', backgroundColor: '#fff2f0' }}
      />

      <div
        id="unoptimized-scroll-view"
        style={{
          height: 600,
          overflowY: 'auto',
          border: '1px solid #ffd8d2',
          borderRadius: 8,
          padding: '12px 12px 0 12px',
          backgroundColor: '#fffafa',
        }}
      >
        {/* Render 1.000 phần tử thật không virtualization (đủ nặng để gây lag và tụt điểm Lighthouse) */}
        {products.slice(0, 1000).map((product) => (
          <ProductItemUnmemo
            key={product.id}
            product={product}
            onQuickView={() => onQuickView(product)}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};
