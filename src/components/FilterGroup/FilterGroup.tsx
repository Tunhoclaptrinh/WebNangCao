import React from 'react';
import { Segmented, Select, Input, Button } from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  WarningOutlined, 
  AppstoreOutlined 
} from '@ant-design/icons';
import { FilterContext, useFilterContext } from './FilterContext';
import { 
  AssignmentStatusFilter, 
  Priority, 
  SubjectCode, 
  SUBJECT_METAS, 
  PRIORITY_METAS 
} from '../../types/assignment.types';
import { FilterGroupProps } from './FilterGroup.types';
import './FilterGroup.css';

// -------------------------------------------------------------
// Component Cha: FilterGroup (Compound Component Pattern)
// -------------------------------------------------------------
export const FilterGroup: React.FC<FilterGroupProps> & {
  Status: typeof StatusFilter;
  Subject: typeof SubjectFilter;
  Priority: typeof PriorityFilter;
  Search: typeof SearchFilter;
  Actions: typeof ActionFilter;
} = ({ children, className = '', style, ...contextValue }) => {
  return (
    <FilterContext.Provider value={contextValue}>
      <div 
        className={`filter-group ${className}`} 
        style={style}
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

  return (
    <div>
      <div className="filter-group__section-title">Trạng thái nộp bài</div>
      <Segmented<AssignmentStatusFilter>
        value={statusFilter}
        onChange={(val) => onStatusChange(val)}
        className="filter-group__status-segmented"
        options={[
          {
            label: 'Tất cả',
            value: 'ALL',
            icon: <AppstoreOutlined />,
          },
          {
            label: 'Chưa hoàn thành',
            value: 'PENDING',
            icon: <ClockCircleOutlined style={{ color: '#2563eb' }} />,
          },
          {
            label: 'Quá hạn',
            value: 'OVERDUE',
            icon: <WarningOutlined style={{ color: '#dc2626' }} />,
          },
          {
            label: 'Đã hoàn thành',
            value: 'COMPLETED',
            icon: <CheckCircleOutlined style={{ color: '#16a34a' }} />,
          },
        ]}
      />
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 2: Lọc theo môn học
// -------------------------------------------------------------
const SubjectFilter: React.FC = () => {
  const { subjectFilter, onSubjectChange } = useFilterContext();

  return (
    <div>
      <div className="filter-group__section-title">Môn học</div>
      <Select
        value={subjectFilter}
        onChange={(val) => onSubjectChange(val as SubjectCode | 'ALL')}
        style={{ width: 170 }}
        dropdownMatchSelectWidth={260}
      >
        <Select.Option value="ALL">
          <span style={{ fontWeight: 600 }}>Tất cả môn học</span>
        </Select.Option>
        {(Object.keys(SUBJECT_METAS) as SubjectCode[]).map((code) => {
          const meta = SUBJECT_METAS[code];
          return (
            <Select.Option key={code} value={code}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: meta.textColor,
                    display: 'inline-block' 
                  }} 
                />
                <span>{meta.name}</span>
              </div>
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 3: Lọc theo mức độ ưu tiên
// -------------------------------------------------------------
const PriorityFilter: React.FC = () => {
  const { priorityFilter, onPriorityChange } = useFilterContext();

  return (
    <div>
      <div className="filter-group__section-title">Độ ưu tiên</div>
      <Select
        value={priorityFilter}
        onChange={(val) => onPriorityChange(val as Priority | 'ALL')}
        style={{ width: 150 }}
      >
        <Select.Option value="ALL">
          <span style={{ fontWeight: 600 }}>Tất cả ưu tiên</span>
        </Select.Option>
        {(Object.keys(PRIORITY_METAS) as Priority[]).map((p) => {
          const meta = PRIORITY_METAS[p];
          return (
            <Select.Option key={p} value={p}>
              <span style={{ color: meta.textColor, fontWeight: 600 }}>
                {meta.label}
              </span>
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 4: Tìm kiếm theo từ khoá
// -------------------------------------------------------------
const SearchFilter: React.FC = () => {
  const { searchQuery, onSearchChange } = useFilterContext();

  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      <div className="filter-group__section-title">Tìm kiếm bài tập</div>
      <Input
        placeholder="Nhập tên bài tập hoặc nội dung..."
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        allowClear
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-group__search-input"
      />
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component 5: Nút thao tác (Reset bộ lọc)
// -------------------------------------------------------------
const ActionFilter: React.FC = () => {
  const { onReset } = useFilterContext();

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
      <Button
        icon={<ReloadOutlined />}
        onClick={onReset}
        type="text"
        className="filter-group__reset-btn"
      >
        Đặt lại
      </Button>
    </div>
  );
};

// Gắn các sub-components vào Component cha (Compound Component Pattern)
FilterGroup.Status = StatusFilter;
FilterGroup.Subject = SubjectFilter;
FilterGroup.Priority = PriorityFilter;
FilterGroup.Search = SearchFilter;
FilterGroup.Actions = ActionFilter;
