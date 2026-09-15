import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Empty, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { CartItemRow } from './CartItemRow.tsx';
import { setDrawerOpen } from './cartSlice.ts';
import { CartSummary } from './CartSummary.tsx';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, isDrawerOpen } = useAppSelector(
    (state) => state.cart
  );

  return (
    <Drawer
      title={
        <Space align="center">
          <ShoppingCartOutlined style={{ color: '#1677ff', fontSize: 20 }} />
          <span style={{ fontSize: 16, fontWeight: 700 }}>Giỏ Hàng Mua Sắm</span>
          <Badge count={totalQuantity} style={{ backgroundColor: '#1677ff' }} />
        </Space>
      }
      placement="right"
      width={460}
      open={isDrawerOpen}
      onClose={() => dispatch(setDrawerOpen(false))}
      bodyStyle={{ padding: '16px', background: '#f9fafb' }}
      footer={
        items.length > 0 ? (
          <div style={{ padding: '8px 0' }}>
            <CartSummary onCheckout={onCheckout} />
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Giỏ hàng của bạn đang trống!"
          >
            <Button
              type="primary"
              onClick={() => dispatch(setDrawerOpen(false))}
              style={{ marginTop: 12 }}
            >
              Tiếp tục mua sắm
            </Button>
          </Empty>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
