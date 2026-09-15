import React from 'react';
import { Select } from 'antd';
import { Priority, PRIORITY_METAS } from '../../types/assignment.types';
import { useFilterContext } from './FilterContext';

export const PriorityFilter: React.FC = () => {
  const { priorityFilter, onPriorityChange } = useFilterContext();

  return (
    <div>
      <div className="filter-group__section-title">Độ ưu tiên</div>
      <Select
        value={priorityFilter}
        onChange={(val) => onPriorityChange(val as Priority | 'ALL')}
        style={{ width: 155 }}
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
