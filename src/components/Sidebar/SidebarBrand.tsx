import React from 'react';
import { ScheduleOutlined } from '@ant-design/icons';

export const SidebarBrand: React.FC = () => {
  return (
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
  );
};
