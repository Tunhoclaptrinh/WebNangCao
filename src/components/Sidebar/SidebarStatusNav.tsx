import React from 'react';
import { 
  AppstoreOutlined, 
  ClockCircleOutlined, 
  WarningOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { AssignmentStatusFilter, SubjectCode } from '../../types/assignment.types';
import { SidebarStats } from './Sidebar.types';

export interface SidebarStatusNavProps {
  statusFilter: AssignmentStatusFilter;
  subjectFilter: SubjectCode | 'ALL';
  stats: SidebarStats;
  onSelect: (status: AssignmentStatusFilter) => void;
  onClearSubject: () => void;
}

export const SidebarStatusNav: React.FC<SidebarStatusNavProps> = ({
  statusFilter,
  subjectFilter,
  stats,
  onSelect,
  onClearSubject,
}) => {
  const navItems = [
    {
      key: 'ALL' as AssignmentStatusFilter,
      label: 'Tất cả bài tập',
      icon: <AppstoreOutlined />,
      count: stats.total,
      type: 'ALL',
    },
    {
      key: 'PENDING' as AssignmentStatusFilter,
      label: 'Đang chờ nộp',
      icon: <ClockCircleOutlined style={{ color: '#2563eb' }} />,
      count: stats.pending,
      type: 'PENDING',
    },
    {
      key: 'OVERDUE' as AssignmentStatusFilter,
      label: 'Đã quá hạn',
      icon: <WarningOutlined style={{ color: '#dc2626' }} />,
      count: stats.overdue,
      type: 'OVERDUE',
    },
    {
      key: 'COMPLETED' as AssignmentStatusFilter,
      label: 'Đã hoàn thành',
      icon: <CheckCircleOutlined style={{ color: '#16a34a' }} />,
      count: stats.completed,
      type: 'COMPLETED',
    },
  ];

  return (
    <div style={{ marginBottom: '22px' }}>
      <div className="app-sidebar__section-header">Mục theo dõi</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const isActive = subjectFilter === 'ALL' && statusFilter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onClearSubject();
                onSelect(item.key);
              }}
              className={`app-sidebar__nav-item ${isActive ? 'app-sidebar__nav-item--active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span
                className={`app-sidebar__nav-item-badge app-sidebar__nav-item-badge--${item.type} ${
                  isActive ? 'app-sidebar__nav-item-badge--active' : ''
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
