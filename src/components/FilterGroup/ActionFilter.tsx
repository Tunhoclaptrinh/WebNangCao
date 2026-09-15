import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useFilterContext } from './FilterContext';

export const ActionFilter: React.FC = () => {
  const { onReset } = useFilterContext();

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
      <Button
        icon={<ReloadOutlined />}
        onClick={onReset}
        type="text"
        className="filter-group__reset-btn"
      >
        Đặt lại
      </Button>
    </div>
  );
};
