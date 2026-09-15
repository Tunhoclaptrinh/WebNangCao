import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Pagination, Row, Space, Tag, Typography } from 'antd';
import { products, type Product } from '../../data/products.ts';
import { usePagination } from '../../hooks/usePagination.ts';

const { Title, Text } = Typography;
const ITEMS_PER_PAGE = 4;

function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <Card
      hoverable
      style={{
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        height: '100%',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        opacity: product.inStock ? 1 : 0.7,
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            fontSize: 40,
            width: 60,
            height: 60,
            borderRadius: 8,
            background: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid #e5e7eb',
          }}
        >
          {product.emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Tag color="blue">{product.category}</Tag>
            {product.inStock ? (
              <Badge status="success" text="Còn hàng" />
            ) : (
              <Badge status="error" text="Hết hàng" />
            )}
          </div>

          <Title level={5} style={{ margin: '0 0 4px', fontSize: 14 }} ellipsis={{ rows: 1 }}>
            {product.name}
          </Title>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <Text strong style={{ color: '#1677ff', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
              {formattedPrice}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ⭐ {product.rating}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProductList() {
  const {
    currentPage,
    totalPages,
    currentData,
    next,
    prev,
    goToPage,
    hasNext,
    hasPrev,
  } = usePagination<Product>(products, ITEMS_PER_PAGE);

  return (
    <Card
      style={{
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{ padding: 24 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18, color: '#111827' }}>
            🛍️ Danh Sách Sản Phẩm (Demo Phân Trang)
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Áp dụng Generic Custom Hook <code>usePagination&lt;Product&gt;</code> ({products.length} sản phẩm · {ITEMS_PER_PAGE} item/trang)
          </Text>
        </div>

        <Tag color="cyan" style={{ padding: '4px 10px', fontSize: 12 }}>
          Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
        </Tag>
      </div>

      {/* Grid sản phẩm */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {currentData.map((product) => (
          <Col xs={24} sm={12} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {/* Thanh điều khiển phân trang */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          paddingTop: 16,
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <Space size="small">
          <Button icon={<LeftOutlined />} onClick={prev} disabled={!hasPrev}>
            Trước
          </Button>

          <Pagination
            current={currentPage}
            total={products.length}
            pageSize={ITEMS_PER_PAGE}
            onChange={(page) => goToPage(page)}
            showSizeChanger={false}
            size="small"
          />

          <Button icon={<RightOutlined />} onClick={next} disabled={!hasNext}>
            Sau
          </Button>
        </Space>

        <Text type="secondary" style={{ fontSize: 12 }}>
          Hiển thị {currentData.length} trên tổng số {products.length} sản phẩm
        </Text>
      </div>
    </Card>
  );
}
