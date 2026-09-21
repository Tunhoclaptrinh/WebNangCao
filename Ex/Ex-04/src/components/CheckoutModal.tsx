import { useState } from 'react';
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Result,
  Space,
  Typography,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { clearCart, setDrawerOpen } from '../features/cart/cartSlice.ts';

const { Text } = Typography;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const dispatch = useAppDispatch();
  const { items, finalAmount, totalQuantity, discountAmount, appliedCoupon } =
    useAppSelector((state) => state.cart);

  const [isSuccess, setIsSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [form] = Form.useForm();

  const handleFinish = (_values: { name: string; phone: string; address: string }) => {
    const code = `PTIT-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(code);
    setIsSuccess(true);
    setTimeout(() => {
      dispatch(clearCart());
      dispatch(setDrawerOpen(false));
    }, 400);
  };

  const handleClose = () => {
    setIsSuccess(false);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={560}
      title={
        <Space align="center">
          <ShoppingOutlined style={{ color: '#1677ff' }} />
          <span>{isSuccess ? 'Đặt Hàng Thành Công' : 'Xác Nhận Đặt Hàng & Thanh Toán'}</span>
        </Space>
      }
      destroyOnClose
    >
      {isSuccess ? (
        <Result
          status="success"
          title="Đặt Hàng Thành Công!"
          subTitle={`Mã đơn hàng: #${orderCode}. Cảm ơn bạn đã lựa chọn DevWorkspace Store!`}
          extra={[
            <Card key="summary" size="small" style={{ textAlign: 'left', marginBottom: 16, background: '#f9fafb' }}>
              <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="Tổng thanh toán">
                  <Text strong style={{ color: '#1677ff', fontFamily: "'JetBrains Mono', monospace" }}>
                    {finalAmount.toLocaleString('vi-VN')} đ
                  </Text>
                </Descriptions.Item>
                {appliedCoupon && (
                  <Descriptions.Item label="Mã khuyến mãi đã áp">
                    <Text type="success">
                      {appliedCoupon.code} (-{discountAmount.toLocaleString('vi-VN')} đ)
                    </Text>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Trạng thái đơn">
                  <Text type="secondary">Chờ xác nhận & giao hàng (COD)</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>,
            <Button type="primary" key="buy" onClick={handleClose} block size="large">
              Tiếp tục mua sắm
            </Button>,
          ]}
        />
      ) : (
        <div>
          {/* Tóm tắt giỏ hàng */}
          <Card size="small" style={{ marginBottom: 16, background: '#f9fafb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <Text strong>Tóm tắt đơn hàng ({totalQuantity} món):</Text>
              <Text strong style={{ color: '#1677ff', fontFamily: "'JetBrains Mono', monospace" }}>
                {finalAmount.toLocaleString('vi-VN')} đ
              </Text>
            </div>
            <div style={{ maxHeight: 120, overflowY: 'auto' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
                  <Text type="secondary" ellipsis style={{ maxWidth: 320 }}>
                    • {item.name} (x{item.quantity})
                  </Text>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Form thông tin giao hàng */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              name: 'Nguyễn Tiến Tuấn',
              phone: '0987654321',
              address: 'Học viện Công nghệ Bưu chính Viễn thông - Km10 Trần Phú, Hà Đông, Hà Nội',
            }}
          >
            <Form.Item
              name="name"
              label="Họ và tên người nhận"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input prefix={<UserOutlined style={{ color: '#9ca3af' }} />} />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ giao hàng"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng' }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={handleClose}>
                Hủy bỏ
              </Button>
              <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                Xác nhận đặt hàng ({finalAmount.toLocaleString('vi-VN')} đ)
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
}
