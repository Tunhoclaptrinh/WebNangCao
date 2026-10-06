import React from 'react';
import { Segmented, Button, Tooltip, Space } from 'antd';
import {
  BarsOutlined,
  AppstoreOutlined,
  PlusOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  SunOutlined,
  MoonOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { WorkspaceHeaderProps } from './WorkspaceHeader.types';
import { useTheme } from '../../context/ThemeContext';
import './WorkspaceHeader.css';

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  title,
  count,
  isFiltered,
  viewMode,
  loading,
  showStats = false,
  onClearFilters,
  onViewModeChange,
  onResetMockData,
  onOpenCreateModal,
  onGenerate10k,
  onToggleStats,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="workspace-header">
      {/* Tiêu đề & Thông tin bộ lọc */}
      <div className="workspace-header__title-box">
        <h1 className="workspace-header__title">{title}</h1>
        <span className="workspace-header__count-badge">{count.toLocaleString()}</span>

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
      <Space size={8} wrap className="workspace-header__actions">
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

        {/* Nút Bật/Tắt Thống kê chi tiết (React.lazy component) */}
        {onToggleStats && (
          <Tooltip title={showStats ? 'Ẩn thống kê' : 'Hiện bảng thống kê chi tiết'}>
            <Button
              type={showStats ? 'primary' : 'default'}
              icon={<BarChartOutlined />}
              onClick={onToggleStats}
              style={{ borderRadius: '4px' }}
            >
              Thống kê
            </Button>
          </Tooltip>
        )}

        {/* Nút Stress test 10.000 bài tập mẫu (Phần B) */}
        {onGenerate10k && (
          <Tooltip title="Stress Test: Tạo nhanh 10.000 bài tập mẫu để kiểm thử Virtualization và hiệu năng 60 FPS">
            <Button
              danger
              icon={<ThunderboltOutlined />}
              onClick={onGenerate10k}
              style={{ borderRadius: '4px', fontWeight: 600 }}
            >
              10.000 bài mẫu
            </Button>
          </Tooltip>
        )}

        {/* Nút reset dữ liệu mẫu ban đầu */}
        <Tooltip title="Khôi phục danh sách bài tập ban đầu từ mock API">
          <Button
            icon={<SyncOutlined spin={loading} />}
            onClick={onResetMockData}
            style={{ borderRadius: '4px', color: '#64748b' }}
          />
        </Tooltip>

        {/* Nút Chuyển đổi Theme Sáng / Tối độc lập (ThemeContext) */}
        <Tooltip title={isDark ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}>
          <Button
            icon={isDark ? <SunOutlined style={{ color: '#eab308' }} /> : <MoonOutlined style={{ color: '#475569' }} />}
            onClick={toggleTheme}
            style={{ borderRadius: '4px' }}
            aria-label="Chuyển đổi giao diện Sáng / Tối"
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
