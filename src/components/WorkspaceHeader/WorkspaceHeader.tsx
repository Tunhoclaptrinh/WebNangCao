import React from 'react';
import { Segmented, Button, Tooltip, Space } from 'antd';
import {
  BarsOutlined,
  AppstoreOutlined,
  PlusOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { WorkspaceHeaderProps } from './WorkspaceHeader.types';
import './WorkspaceHeader.css';

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  title,
  count,
  isFiltered,
  viewMode,
  loading,
  onClearFilters,
  onViewModeChange,
  onResetMockData,
  onOpenCreateModal,
}) => {
  return (
    <header className="workspace-header">
      {/* Tiêu đề & Thông tin bộ lọc */}
      <div className="workspace-header__title-box">
        <h1 className="workspace-header__title">{title}</h1>
        <span className="workspace-header__count-badge">{count}</span>

        {isFiltered && (
          <Button
            type="text"
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={onClearFilters}
            className="workspace-header__clear-btn"
          >
            Xoá bộ lọc
          </Button>
        )}
      </div>

      {/* Hành động trên thanh điều hướng */}
      <Space size={10} className="workspace-header__actions">
        {/* Toggle View Mode: List vs Kanban Board */}
        <Segmented
          value={viewMode}
          onChange={(val) => onViewModeChange(val as 'list' | 'board')}
          options={[
            { label: 'Danh sách', value: 'list', icon: <BarsOutlined /> },
            { label: 'Bảng Kanban', value: 'board', icon: <AppstoreOutlined /> },
          ]}
          className="workspace-header__segmented"
        />

        {/* Nút reset dữ liệu mẫu ban đầu */}
        <Tooltip title="Khôi phục danh sách bài tập ban đầu từ mock API">
          <Button
            icon={<SyncOutlined spin={loading} />}
            onClick={onResetMockData}
            style={{ borderRadius: '4px', color: '#64748b' }}
          />
        </Tooltip>

        {/* Nút tạo bài tập mới */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onOpenCreateModal}
          className="workspace-header__create-btn"
        >
          Thêm deadline
        </Button>
      </Space>
    </header>
  );
};
