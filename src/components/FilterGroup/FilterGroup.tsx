import React from 'react';
import { Segmented, Select, Input, Button, Space } from 'antd';
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
          padding: '18px 22px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
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
        <Space size={6}>
          <AppstoreOutlined />
          <span>Tất cả</span>
        </Space>
      ),
    },
    {
      value: 'PENDING',
      label: (
        <Space size={6}>
          <ClockCircleOutlined style={{ color: '#2563eb' }} />
          <span>Chưa hoàn thành</span>
        </Space>
      ),
    },
    {
      value: 'OVERDUE',
      label: (
        <Space size={6}>
          <WarningOutlined style={{ color: '#dc2626' }} />
          <span>Quá hạn</span>
        </Space>
      ),
    },
    {
      value: 'COMPLETED',
      label: (
        <Space size={6}>
          <CheckCircleOutlined style={{ color: '#16a34a' }} />
          <span>Đã hoàn thành</span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Trạng thái nộp bài
      </div>
      <Segmented
        value={statusFilter}
        onChange={(val) => onStatusChange(val as AssignmentStatusFilter)}
        options={options}
        size="middle"
        style={{ background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}
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
      label: (
        <Space size={8}>
          <span 
            style={{ 
              padding: '1px 6px', 
              borderRadius: '4px', 
              background: s.bg, 
              color: s.textColor, 
              border: `1px solid ${s.borderColor}`,
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {s.code}
          </span>
          <span style={{ fontSize: '13px' }}>{s.name}</span>
        </Space>
      ),
    })),
  ];

  return (
    <div style={{ minWidth: '220px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
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
          <span 
            style={{ 
              padding: '1px 8px', 
              borderRadius: '4px', 
              background: p.bg, 
              color: p.textColor, 
              border: `1px solid ${p.borderColor}`,
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {p.label}
          </span>
        </Space>
      ),
    })),
  ];

  return (
    <div style={{ minWidth: '160px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
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
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Tìm kiếm bài tập
      </div>
      <Input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Nhập tên bài tập hoặc nội dung..."
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
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
        style={{ borderRadius: '8px', color: '#64748b', fontSize: '13px', fontWeight: 500 }}
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
