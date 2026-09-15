import React from 'react';
import { SubjectCode, SUBJECT_METAS } from '../../types/assignment.types';

export interface SidebarSubjectNavProps {
  subjectFilter: SubjectCode | 'ALL';
  subjectCounts: Record<string, number>;
  onSelect: (subject: SubjectCode | 'ALL') => void;
}

export const SidebarSubjectNav: React.FC<SidebarSubjectNavProps> = ({
  subjectFilter,
  subjectCounts,
  onSelect,
}) => {
  return (
    <div>
      <div className="app-sidebar__section-header">Môn học</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {(Object.keys(SUBJECT_METAS) as SubjectCode[]).map((code) => {
          const meta = SUBJECT_METAS[code];
          const count = subjectCounts[code] || 0;
          const isActive = subjectFilter === code;

          return (
            <button
              key={code}
              type="button"
              onClick={() => onSelect(isActive ? 'ALL' : code)}
              className={`app-sidebar__nav-item ${isActive ? 'app-sidebar__nav-item--active' : ''}`}
              style={{ fontSize: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span
                  className="app-sidebar__subject-dot"
                  style={{ background: meta.textColor }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <strong>{meta.code}</strong> — {meta.name}
                </span>
              </div>
              <span
                className="app-sidebar__nav-item-badge"
                style={{
                  background: isActive ? '#2563eb' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  marginLeft: '6px',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
