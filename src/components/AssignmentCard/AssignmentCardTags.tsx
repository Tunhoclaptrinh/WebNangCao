import React from 'react';
import { 
  CheckOutlined, 
  ClockCircleOutlined, 
  AlertOutlined 
} from '@ant-design/icons';
import { SUBJECT_METAS, PRIORITY_METAS, SubjectCode, Priority } from '../../types/assignment.types';
import { DeadlineCountdownResult } from '../../hooks/useDeadlineCountdown';

export interface AssignmentCardTagsProps {
  subject: SubjectCode;
  priority: Priority;
  countdown: DeadlineCountdownResult;
}

export const AssignmentCardTags: React.FC<AssignmentCardTagsProps> = ({
  subject,
  priority,
  countdown,
}) => {
  const subjectMeta = SUBJECT_METAS[subject] || SUBJECT_METAS.OTHER;
  const priorityMeta = PRIORITY_METAS[priority];

  return (
    <div className="assignment-card__meta-row">
      <span 
        className="assignment-card__tag"
        style={{ 
          background: subjectMeta.bg, 
          color: subjectMeta.textColor, 
          border: `1px solid ${subjectMeta.borderColor}` 
        }}
      >
        {subjectMeta.name} ({subjectMeta.code})
      </span>

      <span 
        className="assignment-card__tag"
        style={{ 
          background: priorityMeta.bg, 
          color: priorityMeta.textColor, 
          border: `1px solid ${priorityMeta.borderColor}` 
        }}
      >
        Ưu tiên {priorityMeta.label}
      </span>

      <span 
        className="assignment-card__tag"
        style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: countdown.bg, 
          color: countdown.textColor, 
          border: `1px solid ${countdown.borderColor}` 
        }}
      >
        {countdown.status === 'urgent' && <span className="pulse-indicator" />}
        {countdown.status === 'overdue' && <AlertOutlined style={{ fontSize: '11px' }} />}
        {countdown.status === 'upcoming' && <ClockCircleOutlined style={{ fontSize: '11px' }} />}
        {countdown.status === 'completed' && <CheckOutlined style={{ fontSize: '11px' }} />}
        <span>{countdown.text}</span>
      </span>
    </div>
  );
};
