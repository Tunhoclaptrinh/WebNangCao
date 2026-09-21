import { CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { App, Badge, Button, Card, Rate, Space, Tag, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { addItem } from '../cart/cartSlice.ts';
import type { Product } from './productTypes.ts';
import { FavoriteButton } from '../favorites/FavoriteButton.tsx';
import type { StateEngine } from '../../types/favoriteTypes.ts';

const { Text, Title, Paragraph } = Typography;

interface ProductCardProps {
  product: Product;
  engine?: StateEngine;
}

export function ProductCard({ product, engine = 'zustand' }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const cartItem = useAppSelector((state) =>
    state.cart.items.find((i) => i.id === product.id)
  );

  const currentCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isMaxInCart = currentCartQty >= product.stock;

  const handleAddToCart = () => {
    if (isOutOfStock || isMaxInCart) return;

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        stock: product.stock,
        imageColor: product.imageColor,
        quantity: 1,
      })
    );

    message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const cardContent = (
    <Card
      hoverable
      style={{
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
      cover={
        <div
          style={{
            height: 160,
            background: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ fontSize: 56, filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))' }}>
            {product.category === 'Màn hình' && '🖥️'}
            {product.category === 'Bàn phím' && '⌨️'}
            {product.category === 'Chuột' && '🖱️'}
            {product.category === 'Âm thanh' && '🎧'}
            {product.category === 'Phụ kiện' && '💡'}
          </div>

          {/* Nút yêu thích ở góc trên bên trái của ảnh sản phẩm */}
          <FavoriteButton
            product={product}
            engine={engine}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 3,
            }}
          />

          {discountPercent > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#ff4d4f',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 12,
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              -{discountPercent}%
            </span>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Tag color="blue">{product.category}</Tag>
        <Space size={4}>
          <Rate disabled defaultValue={product.rating} allowHalf style={{ fontSize: 11 }} />
          <Text type="secondary" style={{ fontSize: 11 }}>({product.reviewsCount})</Text>
        </Space>
      </div>

      <Title level={5} style={{ margin: '4px 0 6px', fontSize: 14, minHeight: 40 }} ellipsis={{ rows: 2 }}>
        {product.name}
      </Title>

      <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 10 }} ellipsis={{ rows: 2 }}>
        {product.description}
      </Paragraph>

      <div style={{ marginBottom: 14 }}>
        <Space size={[4, 4]} wrap>
          {product.specs.slice(0, 2).map((spec, idx) => (
            <Tag key={idx} style={{ fontSize: 11, background: '#f9fafb', borderColor: '#e5e7eb' }}>
              {spec}
            </Tag>
          ))}
        </Space>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1677ff', fontFamily: "'JetBrains Mono', monospace" }}>
              {product.price.toLocaleString('vi-VN')} đ
            </div>
            {product.originalPrice && (
              <Text delete type="secondary" style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                {product.originalPrice.toLocaleString('vi-VN')} đ
              </Text>
            )}
          </div>

          <div>
            {isOutOfStock ? (
              <Badge status="error" text="Hết hàng" />
            ) : product.stock < 10 ? (
              <Badge status="warning" text={`Còn ${product.stock}`} />
            ) : (
              <Badge status="success" text={`Kho: ${product.stock}`} />
            )}
          </div>
        </div>

        <Button
          type="primary"
          block
          icon={currentCartQty > 0 ? <CheckOutlined /> : <ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={isOutOfStock || isMaxInCart}
        >
          {isOutOfStock
            ? 'Tạm hết hàng'
            : isMaxInCart
            ? `Tối đa trong giỏ (${currentCartQty})`
            : currentCartQty > 0
            ? `Thêm tiếp (${currentCartQty})`
            : 'Thêm vào giỏ'}
        </Button>
      </div>
    </Card>
  );

  if (product.badge) {
    return (
      <Badge.Ribbon text={product.badge} color="red">
        {cardContent}
      </Badge.Ribbon>
    );
  }

  return cardContent;
}
