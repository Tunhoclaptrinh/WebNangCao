import {
  HeartFilled,
  ShopOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Layout, Segmented, Space, Tag, Typography, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { toggleDrawer } from '../features/cart/cartSlice.ts';
import { useFavoritesStore } from '../store/useFavoritesStore.ts';
import { useFavoritesContext } from '../context/FavoritesContext.tsx';
import type { StateEngine } from '../types/favoriteTypes.ts';

const { Header } = Layout;
const { Text } = Typography;

interface NavbarProps {
  dataSource: 'thunk' | 'rtk-query';
  setDataSource: (source: 'thunk' | 'rtk-query') => void;
  engine: StateEngine;
  setEngine: (engine: StateEngine) => void;
  onOpenFavorites: () => void;
}

export function Navbar({ dataSource, setDataSource, engine, setEngine, onOpenFavorites }: NavbarProps) {
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const finalAmount = useAppSelector((state) => state.cart.finalAmount);

  // Lấy số lượng yêu thích theo engine đang chọn
  const zustandFavCount = useFavoritesStore((s) => s.favorites.length);
  const contextStore = useFavoritesContext();
  const favoritesCount = engine === 'zustand' ? zustandFavCount : contextStore.favorites.length;

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
        height: 'auto',
        lineHeight: 'normal',
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '12px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {/* Brand / Logo */}
        <Space size="middle" align="center">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
            }}
          >
            <ShopOutlined />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              DevWorkspace Store
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              LTWNC Ex-04 • Zustand Store & Context Nâng Cao & Redux Toolkit
            </Text>
          </div>
        </Space>

        {/* Chuyển đổi State Engine: Zustand Store vs Context API */}
        <Space size="middle" wrap align="center">
          <Tag icon={<UserOutlined />} color="purple" style={{ padding: '4px 10px', fontSize: 13, fontWeight: 600 }}>
            SV: <strong>Nguyễn Tiến Tuấn</strong> (<code>B23DCCC173</code>)
          </Tag>

          {/* Engine Selector cho tính năng Yêu Thích */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Yêu thích:</Text>
            <Segmented
              value={engine}
              onChange={(val) => setEngine(val as StateEngine)}
              options={[
                {
                  label: (
                    <Space size={4}>
                      <span style={{ color: '#7c3aed', fontWeight: 700 }}>⚡</span>
                      <span>Zustand Store</span>
                    </Space>
                  ),
                  value: 'zustand',
                },
                {
                  label: (
                    <Space size={4}>
                      <span style={{ color: '#0891b2', fontWeight: 700 }}>⚛</span>
                      <span>Context Nâng Cao</span>
                    </Space>
                  ),
                  value: 'context',
                },
              ]}
            />
          </div>

          {/* Data source selector */}
          <Segmented
            value={dataSource}
            onChange={(val) => setDataSource(val as 'thunk' | 'rtk-query')}
            options={[
              {
                label: (
                  <Space orientation="horizontal" size={4}>
                    <ThunderboltOutlined style={{ color: '#1677ff' }} />
                    <span>Redux Thunk</span>
                  </Space>
                ),
                value: 'thunk',
              },
              {
                label: (
                  <Space orientation="horizontal" size={4}>
                    <span style={{ color: '#52c41a' }}>★</span>
                    <strong>RTK Query</strong>
                  </Space>
                ),
                value: 'rtk-query',
              },
            ]}
          />
        </Space>

        {/* Cụm nút hành động: Yêu Thích + Giỏ Hàng */}
        <Space size={12} align="center">
          {/* Nút Yêu Thích mở FavoritesDrawer */}
          <Tooltip title="Xem danh sách sản phẩm yêu thích (Wishlist)">
            <Badge count={favoritesCount} overflowCount={99} style={{ backgroundColor: '#ff4d4f' }}>
              <Button
                size="large"
                icon={<HeartFilled style={{ color: favoritesCount > 0 ? '#ff4d4f' : '#9ca3af' }} />}
                onClick={onOpenFavorites}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 600,
                  borderColor: favoritesCount > 0 ? '#fca5a5' : '#e5e7eb',
                  background: favoritesCount > 0 ? '#fff1f2' : '#ffffff',
                }}
              >
                <span>Yêu thích ({favoritesCount})</span>
              </Button>
            </Badge>
          </Tooltip>

          {/* Nút Giỏ Hàng mở CartDrawer */}
          <Badge count={totalQuantity} offset={[-2, 2]}>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => dispatch(toggleDrawer())}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(22, 119, 255, 0.25)',
              }}
            >
              <span>Giỏ hàng:</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {finalAmount.toLocaleString('vi-VN')} đ
              </span>
            </Button>
          </Badge>
        </Space>
      </div>
    </Header>
  );
}
