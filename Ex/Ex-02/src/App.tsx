import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
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
  Tabs,
  Tag,
  Typography,
} from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Accordion } from './components/Accordion/index.ts';
import { ProductList } from './components/ProductList/ProductList.tsx';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const FAQ_ITEMS = [
  {
    value: 'compound-component',
    question: '🧩 Compound Component Pattern là gì?',
    answer:
      'Compound Component là pattern cho phép chia nhỏ một UI phức tạp thành nhiều sub-component liên kết với nhau qua một shared state ẩn (thường dùng Context API). Người dùng có thể compose chúng linh hoạt mà không cần truyền props phức tạp. Ví dụ: <Accordion>, <Tabs>, <Select>.',
  },
  {
    value: 'context-api',
    question: '⚡ Tại sao dùng Context API thay vì prop drilling?',
    answer:
      'Prop drilling xảy ra khi bạn phải truyền dữ liệu qua nhiều lớp component trung gian không cần dùng. Context API giải quyết vấn đề này bằng cách tạo một "kho" dữ liệu chia sẻ, bất kỳ component con nào cũng có thể đọc trực tiếp mà không cần qua trung gian.',
  },
  {
    value: 'custom-hooks',
    question: '🎣 Custom Hook là gì và khi nào nên dùng?',
    answer:
      'Custom Hook là một hàm JavaScript bắt đầu bằng "use", cho phép tái sử dụng logic có trạng thái (stateful logic) giữa các component. Dùng khi có logic phức tạp lặp lại nhiều nơi, ví dụ: useFetch, usePagination, useForm, useLocalStorage.',
  },
  {
    value: 'generic-typescript',
    question: '🔷 Generic TypeScript <T> hoạt động như thế nào?',
    answer:
      'Generic (T) là một "placeholder" kiểu dữ liệu, được xác định khi gọi hàm/component. usePagination<Product> nghĩa là T = Product. TypeScript sẽ tự suy luận kiểu cho currentData là Product[], đảm bảo type safety mà không cần viết lại code cho từng kiểu.',
  },
  {
    value: 'accordion-single',
    question: '🎯 Vì sao Accordion chỉ mở 1 panel?',
    answer:
      'Bằng cách lưu activePanel là một string | null duy nhất trong Context (thay vì Set<string>), khi toggle một panel mới, panel cũ tự động đóng vì state chỉ giữ được 1 giá trị. Đây là cách đơn giản nhất để enforce "single-open" behavior.',
  },
  {
    value: 'vite-react',
    question: '⚡ Tại sao chọn Vite thay vì Create React App?',
    answer:
      'Vite nhanh hơn CRA nhiều lần nhờ dùng ES Modules native và esbuild. Dev server start gần như tức thì (< 1s), HMR (Hot Module Replacement) cực nhanh. Với TypeScript support tốt, Vite là lựa chọn mặc định cho các project React hiện đại.',
  },
];

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
                  background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: 20,
                  boxShadow: '0 2px 8px rgba(22, 119, 255, 0.25)',
                }}
              >
                <AppstoreOutlined />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                  LTWNC Ex-02 — React Design Patterns
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Accordion Compound Component (Context API) & usePagination&lt;T&gt; Custom Hook
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
            message="Yêu cầu bài tập tuần 2"
            description="Xây dựng Compound Component Accordion (chỉ mở 1 panel tại một thời điểm bằng Context API) và viết custom hook usePagination<T> áp dụng cho danh sách sản phẩm."
            type="info"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff' }}
          />

          <Tabs
            defaultActiveKey="all"
            items={[
              {
                key: 'all',
                label: (
                  <span>
                    <AppstoreOutlined /> Toàn Bộ Bài Tập
                  </span>
                ),
                children: (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <Card
                        title={
                          <Space align="center">
                            <QuestionCircleOutlined style={{ color: '#1677ff' }} />
                            <span>Accordion Compound Component (Context API)</span>
                          </Space>
                        }
                        style={{ borderRadius: 8, border: '1px solid #e5e7eb', height: '100%', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}
                        extra={<Tag color="purple">Single-Open Only</Tag>}
                      >
                        <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
                          Chỉ mở tối đa 1 panel tại một thời điểm. Khi mở panel mới, panel cũ tự động đóng lại thông qua <code>AccordionContext</code>.
                        </Paragraph>

                        <Accordion defaultValue="compound-component">
                          {FAQ_ITEMS.map((item) => (
                            <Accordion.Item key={item.value} value={item.value}>
                              <Accordion.Trigger>{item.question}</Accordion.Trigger>
                              <Accordion.Content>
                                <div className="accordion-content__inner">{item.answer}</div>
                              </Accordion.Content>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                      <ProductList />
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'accordion',
                label: (
                  <span>
                    <QuestionCircleOutlined /> Accordion Component
                  </span>
                ),
                children: (
                  <Card style={{ borderRadius: 8, maxWidth: 800, margin: '0 auto' }}>
                    <Title level={4}>Compound Component Accordion</Title>
                    <Paragraph type="secondary">
                      Thử nghiệm đóng mở từng câu hỏi. Hãy bấm vào câu hỏi khác để kiểm tra xem câu hỏi trước có tự động đóng lại không!
                    </Paragraph>
                    <Accordion defaultValue="compound-component">
                      {FAQ_ITEMS.map((item) => (
                        <Accordion.Item key={item.value} value={item.value}>
                          <Accordion.Trigger>{item.question}</Accordion.Trigger>
                          <Accordion.Content>
                            <div className="accordion-content__inner">{item.answer}</div>
                          </Accordion.Content>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Card>
                ),
              },
              {
                key: 'pagination',
                label: (
                  <span>
                    <ShoppingOutlined /> usePagination&lt;T&gt; Hook
                  </span>
                ),
                children: (
                  <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <ProductList />
                  </div>
                ),
              },
            ]}
          />
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
            LTWNC Bài Tập Tuần 2 • Sinh viên: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code>B23DCCC173</code>) • PTIT
          </Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
