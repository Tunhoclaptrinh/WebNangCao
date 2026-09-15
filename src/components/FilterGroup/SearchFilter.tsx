import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useFilterContext } from './FilterContext';

export const SearchFilter: React.FC = () => {
  const { searchQuery, onSearchChange } = useFilterContext();

  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      <div className="filter-group__section-title">Tìm kiếm bài tập</div>
      <Input
        placeholder="Nhập tên bài tập hoặc nội dung..."
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        allowClear
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-group__search-input"
      />
    </div>
  );
};
