import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useFilterContext } from './FilterContext';

export const SearchFilter: React.FC = () => {
  const { searchQuery, onSearchChange } = useFilterContext();

  return (
    <Input
      placeholder="Tìm kiếm bài tập theo tiêu đề, ghi chú..."
      prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
      allowClear
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="filter-group__search-input"
      style={{ flex: 1, minWidth: 260 }}
    />
  );
};
