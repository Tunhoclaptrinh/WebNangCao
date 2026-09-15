import React from 'react';

export const SidebarProfile: React.FC = () => {
  return (
    <div className="app-sidebar__profile">
      <div className="app-sidebar__avatar">TT</div>
      <div style={{ overflow: 'hidden' }}>
        <div className="app-sidebar__profile-name">Nguyễn Tiến Tuấn</div>
        <div className="app-sidebar__profile-meta">B23DCCC173 • PTIT HK7</div>
      </div>
    </div>
  );
};
