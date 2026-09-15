import React from 'react';
import { Select } from 'antd';
import { SubjectCode, SUBJECT_METAS } from '../../types/assignment.types';
import { useFilterContext } from './FilterContext';

export const SubjectFilter: React.FC = () => {
  const { subjectFilter, onSubjectChange } = useFilterContext();

  return (
    <Select
      value={subjectFilter}
      onChange={(val) => onSubjectChange(val as SubjectCode | 'ALL')}
      style={{ minWidth: 180 }}
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
                  display: 'inline-block',
                  flexShrink: 0
                }} 
              />
              <span>{meta.name}</span>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
};
