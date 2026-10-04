import React from 'react';
import { Modal, Descriptions, Tag, Button, Badge, Space } from 'antd';
import { ShoppingCartOutlined, QrcodeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { Product } from '../types/product.ts';

interface LazyProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

/**
 * ⚡ KỸ THUẬT: Code-Splitting & Lazy Loading (Slide 16-19)
 * Modal chi tiết sản phẩm được lazy load để giảm dung lượng file bundle ban đầu.
 */
const LazyProductDetailModal: React.FC<LazyProductDetailModalProps> = ({
  product,
  open,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const statusConfig = {
    in_stock: { status: 'success' as const, text: 'Sẵn sàng giao hàng' },
    low_stock: { status: 'warning' as const, text: 'Kho còn dưới 15 sản phẩm' },
    out_of_stock: { status: 'error' as const, text: 'Tạm hết hàng' },
  }[product.status];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>Chi Tiết Sản Phẩm: {product.sku}</span>
          <Tag color="cyan">
            <ThunderboltOutlined /> Code-Split Chunk
          </Tag>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={680}
      footer={[
        <Button key="back" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<ShoppingCartOutlined />}
          disabled={product.status === 'out_of_stock'}
          onClick={() => {
            onAddToCart(product);
            onClose();
          }}
        >
          Thêm Vào Giỏ Hàng
        </Button>,
      ]}
    >
      <div style={{ padding: '12px 0' }}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Mã Sản Phẩm" span={1}>
            <strong>{product.id}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Mã SKU" span={1}>
            <code>{product.sku}</code>
          </Descriptions.Item>

          <Descriptions.Item label="Tên Sản Phẩm" span={2}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{product.name}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Thương Hiệu" span={1}>
            {product.brand}
          </Descriptions.Item>
          <Descriptions.Item label="Danh Mục" span={1}>
            <Tag color="blue">{product.category}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Giá Niêm Yết" span={1}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#cf1322' }}>
              {product.price.toLocaleString('vi-VN')} đ
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Giá Gốc Hãng" span={1}>
            <span style={{ textDecoration: 'line-through', color: '#8c8c8c' }}>
              {product.originalPrice.toLocaleString('vi-VN')} đ
            </span>{' '}
            <Tag color="red">-15%</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Tồn Kho Hiện Tại" span={1}>
            <Badge status={statusConfig.status} text={`${product.stock} đơn vị`} />
          </Descriptions.Item>
          <Descriptions.Item label="Trạng Thái Kho" span={1}>
            <span>{statusConfig.text}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Đánh Giá Khách Hàng" span={1}>
            ⭐ <strong>{product.rating} / 5.0</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Số Lượng Đã Bán" span={1}>
            <strong>{product.salesCount.toLocaleString('vi-VN')}</strong> lượt mua
          </Descriptions.Item>

          <Descriptions.Item label="Cập Nhật Lần Cuối" span={2}>
            {product.lastUpdated}
          </Descriptions.Item>

          <Descriptions.Item label="Mã Vạch Giả Lập" span={2}>
            <Space>
              <QrcodeOutlined style={{ fontSize: 24, color: '#595959' }} />
              <code style={{ fontSize: 13, background: '#f5f5f5', padding: '2px 8px', borderRadius: 4 }}>
                |||| || ||||| | ||||| {product.id} ||||
              </code>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default LazyProductDetailModal;
