import { useState } from 'react';
import { Alert, Button, Card, Col, Row, Space, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CodeOutlined,
  DatabaseOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

export function TechBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginBottom: 24 }}>
      <Alert
        message={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Space align="center">
              <InfoCircleOutlined style={{ color: '#1677ff', fontSize: 18 }} />
              <Text strong style={{ fontSize: 14 }}>
                Kiến trúc Đồ án Tuần 3: Redux Toolkit Chuẩn Feature-Based + RTK Query Điểm Cộng + 100% Typed Hooks
              </Text>
            </Space>
            <Button
              type="link"
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ fontWeight: 600, padding: 0 }}
            >
              {isExpanded ? 'Thu gọn chi tiết ▲' : 'Xem chi tiết tiêu chí đánh giá ▼'}
            </Button>
          </div>
        }
        type="info"
        style={{
          border: '1px solid #bfdbfe',
          background: '#eff6ff',
          borderRadius: 8,
        }}
      />

      {isExpanded && (
        <Card
          size="small"
          style={{
            marginTop: 12,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f9fafb', height: '100%', borderColor: '#f3f4f6' }}>
                <Title level={5} style={{ fontSize: 13, color: '#1677ff', margin: '0 0 6px' }}>
                  <DatabaseOutlined /> 1. cartSlice (`features/cart/`)
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Hỗ trợ <code>addItem</code>, <code>removeItem</code>, <code>updateQuantity</code>, <code>clearCart</code>, <code>applyCoupon</code>. Tự động tính toán tổng tiền & giảm giá.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f9fafb', height: '100%', borderColor: '#f3f4f6' }}>
                <Title level={5} style={{ fontSize: 13, color: '#52c41a', margin: '0 0 6px' }}>
                  <CheckCircleOutlined /> 2. RTK Query & Thunk
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Tích hợp cả <code>createAsyncThunk</code> (3 trạng thái pending/fulfilled/rejected) lẫn <strong>RTK Query (Điểm cộng ⭐)</strong> với cache tự động.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f9fafb', height: '100%', borderColor: '#f3f4f6' }}>
                <Title level={5} style={{ fontSize: 13, color: '#722ed1', margin: '0 0 6px' }}>
                  <SafetyCertificateOutlined /> 3. Typed Hooks (`app/hooks.ts`)
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Toàn bộ component chỉ sử dụng <code>useAppDispatch</code> và <code>useAppSelector</code>. Không có bất kỳ type <code>any</code> nào.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f9fafb', height: '100%', borderColor: '#f3f4f6' }}>
                <Title level={5} style={{ fontSize: 13, color: '#fa8c16', margin: '0 0 6px' }}>
                  <CodeOutlined /> 4. Redux DevTools Ready
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Cấu hình sẵn <code>devTools: true</code> qua <code>configureStore()</code>. Thầy cô có thể mở Redux DevTools để xem lịch sử dispatch action.
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}
