import React from 'react';
import { Segmented, Select, Input, Button, Space, Tag } from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  WarningOutlined, 
  AppstoreOutlined 
} from '@ant-design/icons';
import { FilterContext, useFilterContext, FilterContextType } from './FilterContext';
import { 
  AssignmentStatusFilter, 
  Priority, 
  SubjectCode, 
  SUBJECT_METAS, 
  PRIORITY_METAS 
} from '../../types/assignment.types';

// -------------------------------------------------------------
// Component Cha: FilterGroup
// -------------------------------------------------------------
export interface FilterGroupProps extends FilterContextType {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const FilterGroup: React.FC<FilterGroupProps> & {
  Status: typeof StatusFilter;
  Subject: typeof SubjectFilter;
  Priority: typeof PriorityFilter;
  Search: typeof SearchFilter;
  Actions: typeof ActionFilter;
} = ({ children, className, style, ...contextValue }) => {
  return (
    <FilterContext.Provider value={contextValue}>
      <div 
        className={className} 
        style={{ 
          background: '#ffffff', 
          padding: '16px 20px', 
          borderRadius: '12px', 
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          ...style 
        }}
      >
        {children}
      </div>
    </FilterContext.Provider>
  );
};

// -------------------------------------------------------------
// Sub-component 1: Lọc theo trạng thái (Yêu cầu 5)
// -------------------------------------------------------------
const StatusFilter: React.FC = () => {
  const { statusFilter, onStatusChange } = useFilterContext();

  const options = [
    {
      value: 'ALL',
      label: (
        <Space size={4}>
          <AppstoreOutlined /> Tất cả
        </Space>
      ),
    },
    {
      value: 'PENDING',
      label: (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: '#1677ff' }} /> Chưa hoàn thành
        </Space>
      ),
    },
    {
      value: 'OVERDUE',
      label: (
        <Space size={4}>
          <WarningOutlined style={{ color: '#ff4d4f' }} /> Quá hạn
        </Space>
      ),
    },
    {
      value: 'COMPLETED',
      label: (
        <Space size={4}>
          <CheckCircleOutlined style={{ color: '#52c41a' }} /> Đã hoàn thành
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#8c8c8c', marginBottom: '6px', textTransform: 'uppercase' }}>
        Trạng thái nộp bài
      </div>
      <Segmented
        value={statusFilter}
        onChange={(val) => onStatusChange(val as AssignmentStatusFilter)}
        options={options}
        size="middle"
        block={false}
      />
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 2: Lọc theo môn học
// -------------------------------------------------------------
const SubjectFilter: React.FC = () => {
  const { subjectFilter, onSubjectChange } = useFilterContext();

  const subjectOptions = [
    { value: 'ALL', label: 'Tất cả môn học' },
    ...Object.values(SUBJECT_METAS).map((s) => ({
      value: s.code,
      label: `${s.iconText} ${s.name} (${s.code})`,
    })),
  ];

  return (
    <div style={{ minWidth: '200px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#8c8c8c', marginBottom: '6px', textTransform: 'uppercase' }}>
        Môn học
      </div>
      <Select
        value={subjectFilter}
        onChange={(val) => onSubjectChange(val as SubjectCode | 'ALL')}
        options={subjectOptions}
        style={{ width: '100%' }}
        placeholder="Chọn môn học"
      />
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 3: Lọc theo độ ưu tiên
// -------------------------------------------------------------
const PriorityFilter: React.FC = () => {
  const { priorityFilter, onPriorityChange } = useFilterContext();

  const priorityOptions = [
    { value: 'ALL', label: 'Tất cả ưu tiên' },
    ...Object.values(PRIORITY_METAS).map((p) => ({
      value: p.priority,
      label: (
        <Space size={6}>
          <Tag color={p.color} style={{ margin: 0, padding: '0 6px', fontSize: '11px' }}>
            {p.label}
          </Tag>
        </Space>
      ),
    })),
  ];

  return (
    <div style={{ minWidth: '160px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#8c8c8c', marginBottom: '6px', textTransform: 'uppercase' }}>
        Độ ưu tiên
      </div>
      <Select
        value={priorityFilter}
        onChange={(val) => onPriorityChange(val as Priority | 'ALL')}
        options={priorityOptions}
        style={{ width: '100%' }}
        placeholder="Mức ưu tiên"
      />
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 4: Tìm kiếm theo từ khóa
// -------------------------------------------------------------
const SearchFilter: React.FC = () => {
  const { searchQuery, onSearchChange } = useFilterContext();

  return (
    <div style={{ flex: 1, minWidth: '220px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#8c8c8c', marginBottom: '6px', textTransform: 'uppercase' }}>
        Tìm kiếm bài tập
      </div>
      <Input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Nhập tên bài tập hoặc nội dung..."
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        allowClear
      />
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 5: Nút khôi phục bộ lọc
// -------------------------------------------------------------
const ActionFilter: React.FC = () => {
  const { onReset } = useFilterContext();

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
      <Button 
        icon={<ReloadOutlined />} 
        onClick={onReset}
        title="Đặt lại tất cả bộ lọc"
      >
        Đặt lại
      </Button>
    </div>
  );
};

// Gán các sub-components theo Compound Component Pattern
FilterGroup.Status = StatusFilter;
FilterGroup.Subject = SubjectFilter;
FilterGroup.Priority = PriorityFilter;
FilterGroup.Search = SearchFilter;
FilterGroup.Actions = ActionFilter;
