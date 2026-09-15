import React from 'react';
import { Progress, Button } from 'antd';
import { CodeOutlined, SyncOutlined } from '@ant-design/icons';
import { SidebarStats } from './Sidebar.types';

export interface SidebarProgressWidgetProps {
  stats: SidebarStats;
  loading: boolean;
  onOpenTechDrawer: () => void;
  onResetMockData: () => void;
}

export const SidebarProgressWidget: React.FC<SidebarProgressWidgetProps> = ({
  stats,
  loading,
  onOpenTechDrawer,
  onResetMockData,
}) => {
  return (
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
  );
};
