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
      badgeBg: '#f1f5f9',
      badgeColor: '#475569',
    },
    {
      key: 'PENDING' as AssignmentStatusFilter,
      label: 'Đang chờ nộp',
      icon: <ClockCircleOutlined style={{ color: '#2563eb' }} />,
      count: stats.pending,
      badgeBg: '#eff6ff',
      badgeColor: '#1d4ed8',
    },
    {
      key: 'OVERDUE' as AssignmentStatusFilter,
      label: 'Đã quá hạn',
      icon: <WarningOutlined style={{ color: '#dc2626' }} />,
      count: stats.overdue,
      badgeBg: '#fef2f2',
      badgeColor: '#b91c1c',
    },
    {
      key: 'COMPLETED' as AssignmentStatusFilter,
      label: 'Đã hoàn thành',
      icon: <CheckCircleOutlined style={{ color: '#16a34a' }} />,
      count: stats.completed,
      badgeBg: '#f0fdf4',
      badgeColor: '#15803d',
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
                className="app-sidebar__nav-item-badge"
                style={{
                  background: isActive ? '#2563eb' : item.badgeBg,
                  color: isActive ? '#ffffff' : item.badgeColor,
                }}
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
