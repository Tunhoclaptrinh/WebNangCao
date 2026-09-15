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
      {/* 1. Môn học dạng link tinh tế có dot màu (Không dùng tag khối to) */}
      <span className="assignment-card__subject-link">
        <span 
          className="assignment-card__dot" 
          style={{ background: subjectMeta.textColor }} 
        />
        <span className="assignment-card__subject-text">
          {subjectMeta.name}
        </span>
        <span className="assignment-card__subject-code">
          ({subjectMeta.code})
        </span>
      </span>

      <span className="assignment-card__separator">•</span>

      {/* 2. Mức độ ưu tiên dạng text nhẹ nhàng */}
      <span 
        className="assignment-card__priority"
        style={{ color: priorityMeta.textColor }}
      >
        <span>Ưu tiên {priorityMeta.label}</span>
      </span>

      <span className="assignment-card__separator">•</span>

      {/* 3. Tag hạn nộp duy nhất dạng Badge trực quan */}
      <span 
        className="assignment-card__countdown-tag"
        style={{ 
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
