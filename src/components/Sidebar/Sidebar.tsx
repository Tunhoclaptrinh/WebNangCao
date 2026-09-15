import React from 'react';
import { SidebarProps } from './Sidebar.types';
import { SidebarBrand } from './SidebarBrand';
import { SidebarProfile } from './SidebarProfile';
import { SidebarStatusNav } from './SidebarStatusNav';
import { SidebarSubjectNav } from './SidebarSubjectNav';
import { SidebarProgressWidget } from './SidebarProgressWidget';
import './Sidebar.css';

export const Sidebar: React.FC<SidebarProps> = ({
  statusFilter,
  subjectFilter,
  stats,
  subjectCounts,
  loading,
  onStatusSelect,
  onSubjectSelect,
  onResetMockData,
  onOpenTechDrawer,
}) => {
  return (
    <aside className="app-sidebar">
      {/* Nửa trên: Logo, Profile, Nút tạo & Điều hướng */}
      <div>
        <SidebarBrand />
        <SidebarProfile />

        {/* Nhóm điều hướng trạng thái */}
        <SidebarStatusNav
          statusFilter={statusFilter}
          subjectFilter={subjectFilter}
          stats={stats}
          onSelect={onStatusSelect}
          onClearSubject={() => onSubjectSelect('ALL')}
        />

        {/* Nhóm lọc theo môn học */}
        <SidebarSubjectNav
          subjectFilter={subjectFilter}
          subjectCounts={subjectCounts}
          onSelect={onSubjectSelect}
        />
      </div>

      {/* Nửa dưới: Tiến độ & Công cụ kỹ thuật */}
      <SidebarProgressWidget
        stats={stats}
        loading={loading}
        onOpenTechDrawer={onOpenTechDrawer}
        onResetMockData={onResetMockData}
      />
    </aside>
  );
};
