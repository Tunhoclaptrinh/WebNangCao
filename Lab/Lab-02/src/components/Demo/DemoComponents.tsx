import {
  ReloadOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { withAuth } from '../../hoc/withAuth.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { useFetch } from '../../hooks/useFetch.ts';

const { Title, Text, Paragraph } = Typography;

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: { rate: number; count: number };
}

// ─── Bài 1: ProfilePage bảo vệ bởi withAuth ───────────
interface ProfilePageProps {
  title?: string;
}

function ProfilePage({ title = 'Trang Cá Nhân' }: ProfilePageProps) {
  const { user } = useAuth();

  return (
    <Card
      style={{
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Avatar size={54} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          <Tag color="green" icon={<SafetyCertificateOutlined />} style={{ marginTop: 4 }}>
            Đã xác thực qua withAuth HOC
          </Tag>
        </div>
      </div>

      <Descriptions size="small" bordered column={1}>
        <Descriptions.Item label="Họ và tên">
          <strong>{user?.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">
          <Tag color="purple">{user?.role}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export const ProtectedProfile = withAuth(ProfilePage);

// ─── Bài 3: ProductListDemo dùng useFetch ─────────────
export function ProductListDemo() {
  const { data: products, loading, error, refetch } =
    useFetch<Product[]>('https://fakestoreapi.com/products?limit=6');

  return (
    <Card
      style={{
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Tag color="cyan" style={{ padding: '3px 8px', fontSize: 12 }}>
          Hook: <code>useFetch&lt;Product[]&gt;</code>
        </Tag>
        <Button icon={<ReloadOutlined />} onClick={refetch} loading={loading} size="small">
          Refetch API
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 12, color: '#6b7280' }}>Đang gọi API FakeStore...</p>
        </div>
      )}

      {error && (
        <Alert
          message="Lỗi nạp dữ liệu"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {!loading && !error && products && (
        <Row gutter={[12, 12]}>
          {products.map((p) => (
            <Col xs={24} sm={12} md={8} key={p.id}>
              <Card
                size="small"
                hoverable
                style={{
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              >
                <Tag color="blue" style={{ width: 'fit-content', marginBottom: 6 }}>
                  {p.category}
                </Tag>
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 8 }}
                >
                  {p.title}
                </Paragraph>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ color: '#1677ff', fontFamily: "'JetBrains Mono', monospace" }}>
                    ${p.price}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ⭐ {p.rating.rate}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
}
