import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useFilterContext } from './FilterContext';

export const ActionFilter: React.FC = () => {
  const { onReset, subjectFilter, priorityFilter, searchQuery } = useFilterContext();
  const hasFilter = subjectFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery.trim() !== '';

  if (!hasFilter) return null;

  return (
    <Button
      icon={<ReloadOutlined />}
      onClick={onReset}
      type="text"
      className="filter-group__reset-btn"
    >
      Đặt lại
    </Button>
  );
};
