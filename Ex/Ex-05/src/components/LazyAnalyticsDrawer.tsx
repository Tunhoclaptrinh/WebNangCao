import React from 'react';
import { Drawer, Card, Row, Col, Progress, Statistic, Table, Tag } from 'antd';
import {
  PieChartOutlined,
  StockOutlined,
  DollarCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import type { Product, ProductCategory } from '../types/product.ts';

interface LazyAnalyticsDrawerProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

/**
 * ⚡ KỸ THUẬT: Code-Splitting & Lazy Loading (Slide 16-19, 36)
 * Component này là module phân tích dữ liệu lớn (Analytics Dashboard)
 * Được tách thành 1 chunk JS riêng biệt (chunk.js) bằng React.lazy() + Suspense.
 * Trình duyệt CHỈ tải mã nguồn của module này khi người dùng thực sự bấm nút "Phân tích kho hàng"!
 */
const LazyAnalyticsDrawer: React.FC<LazyAnalyticsDrawerProps> = ({ open, onClose, products }) => {
  // Tính toán thống kê dữ liệu
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const outOfStockCount = products.filter((p) => p.status === 'out_of_stock').length;
  const lowStockCount = products.filter((p) => p.status === 'low_stock').length;

  const categoryStats = products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = { count: 0, totalValue: 0, totalSales: 0 };
    }
    acc[p.category].count += 1;
    acc[p.category].totalValue += p.price * p.stock;
    acc[p.category].totalSales += p.salesCount;
    return acc;
  }, {} as Record<ProductCategory, { count: number; totalValue: number; totalSales: number }>);

  const topSelling = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  const topColumns = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku: string) => <code>{sku}</code>,
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Đã Bán',
      dataIndex: 'salesCount',
      key: 'salesCount',
      render: (sales: number) => (
        <span style={{ color: '#cf1322', fontWeight: 700 }}>
          {sales.toLocaleString('vi-VN')}
        </span>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PieChartOutlined style={{ color: '#1677ff', fontSize: 20 }} />
          <span>Báo Cáo Phân Tích Kho Hàng Doanh Nghiệp (10.000 Sản Phẩm)</span>
          <Tag color="cyan">
            <ThunderboltOutlined /> Lazy-Loaded Chunk
          </Tag>
        </div>
      }
      placement="right"
      width={720}
      onClose={onClose}
      open={open}
      styles={{ body: { backgroundColor: '#f8fafc' } }}
    >
      <div style={{ marginBottom: 16 }}>
        <Card size="small" style={{ backgroundColor: '#e6f4ff', borderColor: '#91caff' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#003eb3' }}>
            💡 <strong>Minh chứng Code-Splitting:</strong> Hãy mở tab <strong>Network</strong> trong Chrome DevTools.
            Bạn sẽ thấy file chunk JavaScript của component này vừa mới được tải về độc lập mà không hề làm phình to file <code>index.js</code> ban đầu!
          </p>
        </Card>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Tổng Giá Trị Kho Hàng (VND)"
              value={totalValue}
              precision={0}
              valueStyle={{ color: '#3f8600', fontWeight: 700 }}
              prefix={<DollarCircleOutlined />}
              formatter={(val) => `${Number(val).toLocaleString('vi-VN')} đ`}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Tổng Tồn Kho Hiện Hữu"
              value={totalStock}
              valueStyle={{ color: '#1677ff', fontWeight: 700 }}
              prefix={<StockOutlined />}
              formatter={(val) => `${Number(val).toLocaleString('vi-VN')} chiếc`}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Cảnh Báo Hết Hàng"
              value={outOfStockCount}
              valueStyle={{ color: '#cf1322', fontWeight: 700 }}
              prefix={<WarningOutlined />}
              suffix={`/ ${products.length.toLocaleString('vi-VN')}`}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Cảnh Báo Sắp Hết (Dưới 15)"
              value={lowStockCount}
              valueStyle={{ color: '#faad14', fontWeight: 700 }}
              prefix={<WarningOutlined />}
              suffix={`/ ${products.length.toLocaleString('vi-VN')}`}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="📊 Cơ Cấu Danh Mục Sản Phẩm Trong 10.000 Items"
        style={{ marginTop: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        {Object.entries(categoryStats).map(([cat, stat]) => {
          const percent = Number(((stat.count / products.length) * 100).toFixed(1));
          return (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{cat}</span>
                <span style={{ color: '#8c8c8c', fontSize: 13 }}>
                  {stat.count.toLocaleString('vi-VN')} mã ({percent}%) — {(stat.totalValue / 1_000_000_000).toFixed(1)} Tỷ VND
                </span>
              </div>
              <Progress percent={percent} strokeColor="#1677ff" />
            </div>
          );
        })}
      </Card>

      <Card
        title="🔥 Top 5 Sản Phẩm Bán Chạy Nhất Toàn Hệ Thống"
        style={{ marginTop: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <Table
          dataSource={topSelling}
          columns={topColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </Drawer>
  );
};

export default LazyAnalyticsDrawer;
