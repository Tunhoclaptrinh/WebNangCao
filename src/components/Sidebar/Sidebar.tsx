import React from 'react';
import { Button, Progress } from 'antd';
import { 
  PlusOutlined, 
  AppstoreOutlined, 
  ClockCircleOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  SyncOutlined,
  CodeOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import { 
  AssignmentStatusFilter, 
  SubjectCode, 
  SUBJECT_METAS 
} from '../../types/assignment.types';
import { SidebarProps } from './Sidebar.types';
import './Sidebar.css';

export const Sidebar: React.FC<SidebarProps> = ({
  statusFilter,
  subjectFilter,
  stats,
  subjectCounts,
  loading,
  onStatusSelect,
  onSubjectSelect,
  onOpenCreateModal,
  onResetMockData,
  onOpenTechDrawer,
}) => {
  const navItems = [
    {
      key: 'ALL' as AssignmentStatusFilter,
      label: 'Tất cả bài tập',
      icon: <AppstoreOutlined />,
      count: stats.total,
      color: '#0f172a',
      badgeBg: '#f1f5f9',
      badgeColor: '#475569',
    },
    {
      key: 'PENDING' as AssignmentStatusFilter,
      label: 'Đang chờ nộp',
      icon: <ClockCircleOutlined style={{ color: '#2563eb' }} />,
      count: stats.pending,
      color: '#2563eb',
      badgeBg: '#eff6ff',
      badgeColor: '#1d4ed8',
    },
    {
      key: 'OVERDUE' as AssignmentStatusFilter,
      label: 'Đã quá hạn',
      icon: <WarningOutlined style={{ color: '#dc2626' }} />,
      count: stats.overdue,
      color: '#dc2626',
      badgeBg: '#fef2f2',
      badgeColor: '#b91c1c',
    },
    {
      key: 'COMPLETED' as AssignmentStatusFilter,
      label: 'Đã hoàn thành',
      icon: <CheckCircleOutlined style={{ color: '#16a34a' }} />,
      count: stats.completed,
      color: '#16a34a',
      badgeBg: '#f0fdf4',
      badgeColor: '#15803d',
    },
  ];

  return (
    <aside className="app-sidebar">
      {/* Nửa trên: Logo, Thông tin sinh viên & Điều hướng */}
      <div>
        {/* Brand App */}
        <div className="app-sidebar__brand">
          <div className="app-sidebar__brand-icon">
            <ScheduleOutlined style={{ fontSize: '18px' }} />
          </div>
          <div>
            <div className="app-sidebar__brand-title">Deadline Tracker</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className="live-dot" />
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Mock API v1.0</span>
            </div>
          </div>
        </div>

        {/* Thẻ sinh viên thực hiện */}
        <div className="app-sidebar__profile">
          <div className="app-sidebar__avatar">TT</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="app-sidebar__profile-name">Nguyễn Tiến Tuấn</div>
            <div className="app-sidebar__profile-meta">B23DCCC173 • PTIT HK7</div>
          </div>
        </div>

        {/* Nút hành động chính */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          block
          onClick={onOpenCreateModal}
          className="app-sidebar__add-btn"
        >
          Thêm deadline mới
        </Button>

        {/* Mục theo dõi trạng thái */}
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
                    onSubjectSelect('ALL');
                    onStatusSelect(item.key);
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

        {/* Mục lọc theo Môn học */}
        <div>
          <div className="app-sidebar__section-header">Môn học</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {(Object.keys(SUBJECT_METAS) as SubjectCode[]).map((code) => {
              const meta = SUBJECT_METAS[code];
              const count = subjectCounts[code] || 0;
              const isActive = subjectFilter === code;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSubjectSelect(isActive ? 'ALL' : code)}
                  className={`app-sidebar__nav-item ${isActive ? 'app-sidebar__nav-item--active' : ''}`}
                  style={{ fontSize: '12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span
                      className="app-sidebar__subject-dot"
                      style={{ background: meta.textColor }}
                    />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <strong>{meta.code}</strong> — {meta.name}
                    </span>
                  </div>
                  <span
                    className="app-sidebar__nav-item-badge"
                    style={{
                      background: isActive ? '#2563eb' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#64748b',
                      marginLeft: '6px',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nửa dưới: Tiến độ hoàn thành & Nút kỹ thuật */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
        {/* Widget Tiến độ hoàn thành */}
        <div className="app-sidebar__footer-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Tiến độ hoàn thành
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a' }}>
              {stats.completionRate}%
            </span>
          </div>
          <Progress 
            percent={stats.completionRate} 
            showInfo={false} 
            strokeColor="#16a34a" 
            trailColor="#e2e8f0" 
            size="small" 
          />
          <div className="app-sidebar__footer-meta">
            <span>{stats.completed} đã xong</span>
            <span>{stats.pending + stats.overdue} cần nộp</span>
          </div>
        </div>

        {/* Nút hành động phụ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Button
            type="text"
            block
            icon={<CodeOutlined style={{ color: '#2563eb' }} />}
            onClick={onOpenTechDrawer}
            className="app-sidebar__footer-btn"
            style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            Kiến trúc kỹ thuật (3 Buổi)
          </Button>

          <Button
            type="text"
            block
            icon={<SyncOutlined spin={loading} style={{ color: '#64748b' }} />}
            onClick={onResetMockData}
            className="app-sidebar__footer-btn"
            style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            Tải lại dữ liệu mẫu
          </Button>
        </div>
      </div>
    </aside>
  );
};
