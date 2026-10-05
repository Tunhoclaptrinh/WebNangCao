import { DeleteOutlined, HeartFilled, ShoppingCartOutlined, FireOutlined } from '@ant-design/icons';
import { Drawer, Button, Typography, Space, Empty, Popconfirm, Tag, Badge, App } from 'antd';
import { useFavoritesStore } from '../../store/useFavoritesStore.ts';
import { useFavoritesContext } from '../../context/FavoritesContext.tsx';
import { useAppDispatch } from '../../app/hooks.ts';
import { addItem } from '../cart/cartSlice.ts';
import type { StateEngine } from '../../types/favoriteTypes.ts';

const { Text, Title } = Typography;

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  engine: StateEngine;
}

export function FavoritesDrawer({ isOpen, onClose, engine }: FavoritesDrawerProps) {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  // Zustand Store
  const zustandFavorites = useFavoritesStore((s) => s.favorites);
  const zustandRemove = useFavoritesStore((s) => s.removeFavorite);
  const zustandClear = useFavoritesStore((s) => s.clearFavorites);

  // Context Store
  const contextStore = useFavoritesContext();

  const favorites = engine === 'zustand' ? zustandFavorites : contextStore.favorites;
  const removeFavorite = engine === 'zustand' ? zustandRemove : contextStore.removeFavorite;
  const clearFavorites = engine === 'zustand' ? zustandClear : contextStore.clearFavorites;

  // Xử lý chuyển sản phẩm từ Yêu thích vào Giỏ hàng
  const handleAddToCart = (product: typeof favorites[0]) => {
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

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 16 }}>
          <Space size={8}>
            <HeartFilled style={{ color: '#ff4d4f', fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Sản phẩm yêu thích</span>
            <Badge count={favorites.length} style={{ backgroundColor: '#ff4d4f' }} />
          </Space>
          <Tag color={engine === 'zustand' ? 'purple' : 'cyan'} style={{ fontWeight: 600, fontSize: 11 }}>
            Engine: {engine === 'zustand' ? 'Zustand Store' : 'Context API'}
          </Tag>
        </div>
      }
      placement="right"
      width={460}
      onClose={onClose}
      open={isOpen}
      footer={
        favorites.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
            <Popconfirm
              title="Xoá tất cả sản phẩm yêu thích?"
              description="Bạn có chắc muốn xoá toàn bộ danh sách yêu thích không?"
              okText="Xoá tất cả"
              cancelText="Huỷ"
              okButtonProps={{ danger: true }}
              onConfirm={() => {
                clearFavorites();
                message.info('Đã xoá toàn bộ danh sách yêu thích');
              }}
            >
              <Button danger type="text" icon={<DeleteOutlined />}>
                Xoá tất cả
              </Button>
            </Popconfirm>
            <Button type="primary" onClick={onClose} style={{ borderRadius: 6, fontWeight: 600 }}>
              Tiếp tục mua sắm
            </Button>
          </div>
        )
      }
    >
      {favorites.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
                  Danh sách yêu thích đang trống
                </p>
                <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
                  Hãy bấm vào biểu tượng trái tim trên thẻ sản phẩm để lưu lại những món bạn thích nhất!
                </p>
              </div>
            }
          >
            <Button type="primary" onClick={onClose} icon={<FireOutlined />} style={{ borderRadius: 6, marginTop: 8 }}>
              Khám phá sản phẩm
            </Button>
          </Empty>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, color: '#64748b' }}>
            💡 Dữ liệu yêu thích được tự động đồng bộ và lưu trữ trong <strong>LocalStorage</strong> ({engine === 'zustand' ? 'Zustand Persist' : 'Context Storage'}).
          </div>

          {favorites.map((product) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #f1f5f9',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Emoji Icon Preview */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                {product.category === 'Màn hình' && '🖥️'}
                {product.category === 'Bàn phím' && '⌨️'}
                {product.category === 'Chuột' && '🖱️'}
                {product.category === 'Âm thanh' && '🎧'}
                {product.category === 'Phụ kiện' && '💡'}
              </div>

              {/* Thông tin chi tiết */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Tag color="blue" style={{ fontSize: 10, padding: '0 4px', lineHeight: '18px' }}>
                    {product.category}
                  </Tag>
                  {product.stock <= 0 ? (
                    <Tag color="error" style={{ fontSize: 10 }}>Hết hàng</Tag>
                  ) : (
                    <Tag color="success" style={{ fontSize: 10 }}>Còn hàng ({product.stock})</Tag>
                  )}
                </div>

                <Title level={5} style={{ margin: 0, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name}
                </Title>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1677ff', fontFamily: "'JetBrains Mono', monospace" }}>
                    {product.price.toLocaleString('vi-VN')} đ
                  </span>
                  {product.originalPrice && (
                    <Text delete type="secondary" style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                      {product.originalPrice.toLocaleString('vi-VN')} đ
                    </Text>
                  )}
                </div>
              </div>

              {/* Cụm nút thao tác */}
              <Space direction="vertical" size={4} style={{ flexShrink: 0 }}>
                <Button
                  type="primary"
                  size="small"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  style={{ borderRadius: 4, fontSize: 12 }}
                >
                  Giỏ hàng
                </Button>
                <Button
                  danger
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeFavorite(product.id)}
                  style={{ fontSize: 12 }}
                >
                  Bỏ thích
                </Button>
              </Space>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
