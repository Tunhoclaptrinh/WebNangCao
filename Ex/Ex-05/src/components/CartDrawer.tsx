import React from 'react';
import { Drawer, List, Button, Typography, Space, Empty, Popconfirm } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';
import type { Product } from '../types/product.ts';

const { Text } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: Product[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  cart,
  onRemoveItem,
  onClearCart,
}) => {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShoppingCartOutlined style={{ fontSize: 20, color: '#1677ff' }} />
          <span>Giỏ Hàng Quản Trị ({cart.length} sản phẩm)</span>
        </div>
      }
      placement="right"
      width={450}
      onClose={onClose}
      open={open}
      extra={
        cart.length > 0 && (
          <Popconfirm
            title="Xác nhận xóa giỏ hàng?"
            onConfirm={onClearCart}
            okText="Xóa hết"
            cancelText="Hủy"
          >
            <Button danger size="small" type="text" icon={<DeleteOutlined />}>
              Xóa sạch
            </Button>
          </Popconfirm>
        )
      }
      footer={
        cart.length > 0 && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text strong style={{ fontSize: 15 }}>Tổng thanh toán:</Text>
              <Text strong style={{ fontSize: 18, color: '#cf1322' }}>
                {totalPrice.toLocaleString('vi-VN')} đ
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              block
              icon={<CreditCardOutlined />}
              onClick={() => {
                alert(`Đơn hàng mẫu trị giá ${totalPrice.toLocaleString('vi-VN')} đ đã được tạo!`);
                onClearCart();
                onClose();
              }}
            >
              Tiến Hành Đặt Hàng Mẫu
            </Button>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <Empty description="Giỏ hàng hiện đang trống" style={{ marginTop: 60 }} />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  danger
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => onRemoveItem(item.id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={<span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>}
                description={
                  <Space direction="vertical" size={2}>
                    <Text style={{ fontSize: 11, color: '#8c8c8c' }}>
                      SKU: {item.sku}
                    </Text>
                    <Text strong style={{ color: '#cf1322', fontSize: 13 }}>
                      {item.price.toLocaleString('vi-VN')} đ
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};
