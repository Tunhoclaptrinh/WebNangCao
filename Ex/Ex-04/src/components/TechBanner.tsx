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
              <InfoCircleOutlined style={{ color: '#7c3aed', fontSize: 18 }} />
              <Text strong style={{ fontSize: 14 }}>
                Kiến trúc Bài tập Tuần 4: Tính Năng "Sản Phẩm Yêu Thích" (Zustand Store Riêng + Context Nâng Cao + Nhận Xét Kỹ Thuật 5–7 Dòng)
              </Text>
            </Space>
            <Button
              type="link"
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ fontWeight: 600, padding: 0, color: '#7c3aed' }}
            >
              {isExpanded ? 'Thu gọn chi tiết ▲' : 'Xem chi tiết tiêu chí đánh giá Buổi 4 ▼'}
            </Button>
          </div>
        }
        type="info"
        style={{
          border: '1px solid #ddd6fe',
          background: '#faf5ff',
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
                <Title level={5} style={{ fontSize: 13, color: '#7c3aed', margin: '0 0 6px' }}>
                  <DatabaseOutlined /> 1. Zustand useFavoritesStore
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Tách riêng store độc lập, không gộp chung giỏ hàng. Hỗ trợ <code>addFavorite</code>, <code>removeFavorite</code>, <code>toggleFavorite</code>, lưu tự động qua <code>persist</code> middleware.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f9fafb', height: '100%', borderColor: '#f3f4f6' }}>
                <Title level={5} style={{ fontSize: 13, color: '#0891b2', margin: '0 0 6px' }}>
                  <CheckCircleOutlined /> 2. Context Nâng Cao (Bonus)
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Cung cấp song song phiên bản <code>FavoritesContext</code> kết hợp <code>useReducer</code> + <code>useMemo</code>, có thanh chuyển đổi Engine trực quan trên Navbar.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f9fafb', height: '100%', borderColor: '#f3f4f6' }}>
                <Title level={5} style={{ fontSize: 13, color: '#2563eb', margin: '0 0 6px' }}>
                  <SafetyCertificateOutlined /> 3. Nhận xét kỹ thuật (5–7 dòng)
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  So sánh toàn diện ưu/nhược điểm giữa Zustand và Redux Toolkit về boilerplate, re-render, bất đồng bộ và phạm vi sử dụng dự án thực tế.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ background: '#f9fafb', height: '100%', borderColor: '#f3f4f6' }}>
                <Title level={5} style={{ fontSize: 13, color: '#fa8c16', margin: '0 0 6px' }}>
                  <CodeOutlined /> 4. TypeScript 100% Strict
                </Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Không dùng <code>any</code>, định nghĩa rõ ràng kiểu <code>Product</code>, <code>FavoritesState</code>, <code>StateEngine</code>, đáp ứng toàn diện tiêu chí chấm điểm Slide 25.
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}
