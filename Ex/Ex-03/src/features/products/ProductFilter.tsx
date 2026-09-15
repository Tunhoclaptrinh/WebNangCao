import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Radio, Row, Select, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import {
  resetProductsFilter,
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
} from './productsSlice.ts';

const CATEGORIES = ['Tất cả', 'Màn hình', 'Bàn phím', 'Chuột', 'Âm thanh', 'Phụ kiện'];

export function ProductFilter() {
  const dispatch = useAppDispatch();
  const { selectedCategory, searchQuery, sortBy } = useAppSelector(
    (state) => state.products
  );

  return (
    <Card
      style={{
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        marginBottom: 20,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        {/* Tìm kiếm */}
        <Col xs={24} md={12} lg={10}>
          <Input
            placeholder="Tìm kiếm sản phẩm theo tên, mô tả..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            allowClear
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            size="middle"
          />
        </Col>

        {/* Sắp xếp */}
        <Col xs={24} md={12} lg={6}>
          <Space align="center" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>Sắp xếp:</span>
            <Select
              value={sortBy}
              onChange={(val) => dispatch(setSortBy(val))}
              style={{ width: 170 }}
              options={[
                { value: 'default', label: 'Mặc định (Nổi bật)' },
                { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
                { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
                { value: 'rating', label: 'Đánh giá cao nhất' },
              ]}
            />
          </Space>
        </Col>

        {/* Danh mục */}
        <Col xs={24}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <Space size={8} wrap align="center">
              <span style={{ fontSize: 13, color: '#4b5563', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                <FilterOutlined /> Danh mục:
              </span>
              <Radio.Group
                value={selectedCategory}
                onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
                buttonStyle="solid"
                size="small"
              >
                {CATEGORIES.map((cat) => (
                  <Radio.Button key={cat} value={cat}>
                    {cat}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Space>

            {(selectedCategory !== 'Tất cả' || searchQuery || sortBy !== 'default') && (
              <Button
                size="small"
                type="dashed"
                icon={<ReloadOutlined />}
                onClick={() => dispatch(resetProductsFilter())}
              >
                Đặt lại
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
}
