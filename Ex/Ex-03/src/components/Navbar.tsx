import {
  ShopOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Layout, Segmented, Space, Tag, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { toggleDrawer } from '../features/cart/cartSlice.ts';

const { Header } = Layout;
const { Text } = Typography;

interface NavbarProps {
  dataSource: 'thunk' | 'rtk-query';
  setDataSource: (source: 'thunk' | 'rtk-query') => void;
}

export function Navbar({ dataSource, setDataSource }: NavbarProps) {
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const finalAmount = useAppSelector((state) => state.cart.finalAmount);

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
              background: 'linear-gradient(135deg, #1677ff, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(22, 119, 255, 0.25)',
            }}
          >
            <ShopOutlined />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              DevWorkspace Store
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              LTWNC Ex-03 • Redux Toolkit Feature-Based (Ant Design Light)
            </Text>
          </div>
        </Space>

        {/* Thông tin sinh viên & Switch data mode */}
        <Space size="middle" wrap align="center">
          <Tag icon={<UserOutlined />} color="blue" style={{ padding: '4px 10px', fontSize: 13 }}>
            SV: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code>B23DCCC173</code>)
          </Tag>

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
                    <strong>RTK Query (Bonus)</strong>
                  </Space>
                ),
                value: 'rtk-query',
              },
            ]}
          />
        </Space>

        {/* Nút Giỏ Hàng mở Drawer */}
        <div>
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
        </div>
      </div>
    </Header>
  );
}
