import React from 'react';
import { Card, Input, Select, Button, Space, Tag } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import type { ProductCategory, ProductStatus, SortOption } from '../types/product.ts';

interface ProductFilterBarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory | 'all';
  onCategoryChange: (value: ProductCategory | 'all') => void;
  selectedStatus: ProductStatus | 'all';
  onStatusChange: (value: ProductStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  onResetFilters: () => void;
  totalResults: number;
  useDebounceSearch: boolean;
  activeSearchQuery: string;
}

const CATEGORY_OPTIONS: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'Tất cả danh mục', value: 'all' },
  { label: 'Laptop Cao Cấp', value: 'Laptop' },
  { label: 'Bàn Phím Cơ', value: 'Bàn Phím Cơ' },
  { label: 'Chuột Gaming', value: 'Chuột Gaming' },
  { label: 'Màn Hình Chuyên Nghiệp', value: 'Màn Hình' },
  { label: 'Tai Nghe & Âm Thanh', value: 'Tai Nghe & Âm Thanh' },
  { label: 'Linh Kiện PC', value: 'Linh Kiện PC' },
];

const STATUS_OPTIONS: { label: string; value: ProductStatus | 'all' }[] = [
  { label: 'Tất cả trạng thái kho', value: 'all' },
  { label: 'Còn hàng sẵn sàng', value: 'in_stock' },
  { label: 'Cảnh báo: Sắp hết hàng', value: 'low_stock' },
  { label: 'Tạm hết hàng', value: 'out_of_stock' },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Mặc định (ID)', value: 'default' },
  { label: 'Giá: Thấp đến Cao', value: 'price_asc' },
  { label: 'Giá: Cao đến Thấp', value: 'price_desc' },
  { label: 'Bán chạy nhất (Hot)', value: 'sales_desc' },
  { label: 'Đánh giá cao nhất (⭐)', value: 'rating_desc' },
  { label: 'Tồn kho nhiều nhất', value: 'stock_desc' },
];

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchInput,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResults,
  useDebounceSearch,
  activeSearchQuery,
}) => {
  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        borderRadius: 8,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Space size="middle" wrap style={{ flex: 1 }}>
          {/* Ô tìm kiếm */}
          <div style={{ position: 'relative', width: 280 }}>
            <Input
              placeholder="Tìm theo tên sản phẩm, SKU, thương hiệu..."
              prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
            />
            {useDebounceSearch && activeSearchQuery !== searchInput && (
              <span
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 6,
                  fontSize: 11,
                  color: '#faad14',
                }}
              >
                Đang chờ debounce 300ms...
              </span>
            )}
          </div>

          {/* Lọc danh mục */}
          <Select
            style={{ width: 190 }}
            value={selectedCategory}
            onChange={onCategoryChange}
            options={CATEGORY_OPTIONS}
            prefix={<FilterOutlined />}
          />

          {/* Lọc trạng thái */}
          <Select
            style={{ width: 180 }}
            value={selectedStatus}
            onChange={onStatusChange}
            options={STATUS_OPTIONS}
          />

          {/* Sắp xếp */}
          <Select
            style={{ width: 190 }}
            value={sortBy}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            prefix={<SortAscendingOutlined />}
          />

          {/* Nút đặt lại */}
          <Button icon={<ReloadOutlined />} onClick={onResetFilters}>
            Đặt lại bộ lọc
          </Button>
        </Space>

        {/* Kết quả tìm kiếm */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color="blue" style={{ fontSize: 13, padding: '4px 8px' }}>
            Tìm thấy: <strong>{totalResults.toLocaleString('vi-VN')}</strong> / 10.000
          </Tag>
        </div>
      </div>
    </Card>
  );
};
