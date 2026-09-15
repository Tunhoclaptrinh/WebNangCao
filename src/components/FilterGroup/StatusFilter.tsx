import React from 'react';
import { Segmented } from 'antd';
import { 
  AppstoreOutlined, 
  ClockCircleOutlined, 
  WarningOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { AssignmentStatusFilter } from '../../types/assignment.types';
import { useFilterContext } from './FilterContext';

export const StatusFilter: React.FC = () => {
  const { statusFilter, onStatusChange } = useFilterContext();

  return (
    <div>
      <div className="filter-group__section-title">Trạng thái nộp bài</div>
      <Segmented<AssignmentStatusFilter>
        value={statusFilter}
        onChange={(val) => onStatusChange(val)}
        className="filter-group__status-segmented"
        options={[
          {
            label: 'Tất cả',
            value: 'ALL',
            icon: <AppstoreOutlined />,
          },
          {
            label: 'Chưa hoàn thành',
            value: 'PENDING',
            icon: <ClockCircleOutlined style={{ color: '#2563eb' }} />,
          },
          {
            label: 'Quá hạn',
            value: 'OVERDUE',
            icon: <WarningOutlined style={{ color: '#dc2626' }} />,
          },
          {
            label: 'Đã hoàn thành',
            value: 'COMPLETED',
            icon: <CheckCircleOutlined style={{ color: '#16a34a' }} />,
          },
        ]}
      />
    </div>
  );
};
