import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useFilterContext } from './FilterContext';
import { useDebounce } from '../../hooks/useDebounce';

export const SearchFilter: React.FC = () => {
  const { searchQuery, onSearchChange } = useFilterContext();
  const [localValue, setLocalValue] = useState(searchQuery);
  const debouncedValue = useDebounce(localValue, 300);
  const isFirstMount = useRef(true);

  // Đồng bộ giá trị khi searchQuery từ context/Redux thay đổi từ bên ngoài (ví dụ reset bộ lọc)
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  // Kích hoạt onSearchChange khi giá trị debounced thay đổi
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (debouncedValue !== searchQuery) {
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue, onSearchChange, searchQuery]);

  return (
    <Input
      placeholder="Tìm kiếm bài tập theo tiêu đề, ghi chú... (300ms debounce)"
      prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
      allowClear
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      className="filter-group__search-input"
      style={{ flex: 1, minWidth: 260 }}
    />
  );
};
