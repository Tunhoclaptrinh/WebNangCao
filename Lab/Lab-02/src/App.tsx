import {
  CodeOutlined,
  CompassOutlined,
  GlobalOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Card,
  Col,
  ConfigProvider,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import viVN from 'antd/locale/vi_VN';
import { ProtectedProfile, ProductListDemo } from './components/Demo/DemoComponents.tsx';
import { Tabs } from './components/Tabs/Tabs.tsx';

const { Header, Content, Footer } = Layout;
const { Text, Paragraph } = Typography;

export default function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorBgBase: '#ffffff',
          colorBgLayout: '#f5f7fa',
          colorTextBase: '#1f2937',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        {/* Header */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '12px 24px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
            height: 'auto',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Space align="center" size="middle">
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
                <CompassOutlined />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                  LTWNC Lab-02 — Design Patterns in React
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  HOC · Compound Component · Custom Hook · Context API · TypeScript
                </Text>
              </div>
            </Space>

            <Tag icon={<UserOutlined />} color="blue" style={{ padding: '4px 10px', fontSize: 13 }}>
              SV: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code>B23DCCC173</code>)
            </Tag>
          </div>
        </Header>

        {/* Nội dung chính */}
        <Content style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '24px 20px' }}>
          <Alert
            message="Nội dung thực hành Buổi 2 (Slide 16–18)"
            description="Áp dụng các mẫu thiết kế React nâng cao: Higher-Order Component (withAuth), Compound Component với Context API (Tabs), và Custom Hook Generic (useFetch<T>)."
            type="info"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff' }}
          />

          <Row gutter={[24, 24]}>
            {/* BÀI 1: HOC withAuth */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space align="center">
                    <LockOutlined style={{ color: '#1677ff' }} />
                    <span>Bài 1/3: HOC withAuth&lt;P&gt;</span>
                  </Space>
                }
                style={{ borderRadius: 8, border: '1px solid #e5e7eb', height: '100%', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}
                extra={<Tag color="blue">HOC Pattern</Tag>}
              >
                <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
                  Higher-Order Component kiểm tra xác thực quyền truy cập trước khi render component mục tiêu. Nếu chưa đăng nhập, tự chuyển hướng hoặc hiển thị thông báo.
                </Paragraph>

                <div style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: 6, border: '1px solid #f3f4f6', marginBottom: 16 }}>
                  <Text code style={{ fontSize: 12 }}>
                    const ProtectedProfile = withAuth(ProfilePage);
                  </Text>
                </div>

                <ProtectedProfile title="Trang Cá Nhân Của Tôi" />
              </Card>
            </Col>

            {/* BÀI 2: Tabs Compound Component */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space align="center">
                    <CodeOutlined style={{ color: '#722ed1' }} />
                    <span>Bài 2/3: Tabs Compound Component</span>
                  </Space>
                }
                style={{ borderRadius: 8, border: '1px solid #e5e7eb', height: '100%', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}
                extra={<Tag color="purple">Context API</Tag>}
              >
                <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
                  Tự xây dựng Tabs Compound Component dùng Context API chia sẻ trạng thái activeTab ẩn giữa <code>Tabs.List</code>, <code>Tabs.Tab</code> và <code>Tabs.Panel</code>.
                </Paragraph>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                  <Tabs defaultValue="intro">
                    <Tabs.List>
                      <Tabs.Tab value="intro">Giới Thiệu</Tabs.Tab>
                      <Tabs.Tab value="principles">Nguyên Lý</Tabs.Tab>
                      <Tabs.Tab value="code">Mã Nguồn</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="intro">
                      <p style={{ margin: '12px 0 0', color: '#4b5563', lineHeight: 1.6 }}>
                        Compound Component giúp người phát triển sử dụng các component con linh hoạt và tự do bố cục mà không phải truyền hàng chục prop lồng nhau.
                      </p>
                    </Tabs.Panel>

                    <Tabs.Panel value="principles">
                      <p style={{ margin: '12px 0 0', color: '#4b5563', lineHeight: 1.6 }}>
                        Sử dụng <code>React.createContext</code> để tạo kênh giao tiếp nội bộ. Component con tự trích xuất <code>value</code> và <code>setValue</code> thông qua custom hook.
                      </p>
                    </Tabs.Panel>

                    <Tabs.Panel value="code">
                      <pre style={{ margin: '12px 0 0', padding: 10, background: '#f9fafb', borderRadius: 6, fontSize: 12, border: '1px solid #f3f4f6' }}>
                        {`<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Nội dung</Tabs.Panel>
</Tabs>`}
                      </pre>
                    </Tabs.Panel>
                  </Tabs>
                </div>
              </Card>
            </Col>

            {/* BÀI 3: useFetch<T> Hook */}
            <Col xs={24}>
              <Card
                title={
                  <Space align="center">
                    <GlobalOutlined style={{ color: '#52c41a' }} />
                    <span>Bài 3/3: Custom Hook useFetch&lt;T&gt; với Generic TypeScript</span>
                  </Space>
                }
                style={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}
                extra={<Tag color="green">Custom Hook</Tag>}
              >
                <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
                  Hook generic <code>useFetch&lt;T&gt;(url)</code> tự động quản lý vòng đời HTTP request: <code>data</code>, <code>loading</code>, <code>error</code> và hàm <code>refetch</code>.
                </Paragraph>

                <ProductListDemo />
              </Card>
            </Col>
          </Row>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            padding: '20px',
            marginTop: 'auto',
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            LTWNC Lab-02 • Sinh viên: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code>B23DCCC173</code>) • PTIT
          </Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
