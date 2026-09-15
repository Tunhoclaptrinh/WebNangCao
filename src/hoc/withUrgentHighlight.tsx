import React from 'react';
import { Assignment, isOverdueAssignment, isUrgentAssignment } from '../types/assignment.types';

export interface WithUrgentHighlightProps {
  assignment: Assignment;
}

/**
 * Higher-Order Component (HOC) - Buổi 2 React Design Patterns
 * Tự động phân tích mức độ khẩn cấp của bài tập và bọc class làm nổi bật đồng bộ với bo góc
 */
export function withUrgentHighlight<P extends WithUrgentHighlightProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const ComponentWithUrgentHighlight: React.FC<P> = (props) => {
    const { assignment } = props;
    const isOverdue = isOverdueAssignment(assignment);
    const isUrgent = isUrgentAssignment(assignment, 24);

    let highlightClass = '';

    if (isOverdue) {
      highlightClass = 'urgent-highlight-wrapper--overdue';
    } else if (isUrgent) {
      highlightClass = 'urgent-highlight-wrapper--urgent';
    }

    return (
      <div className={`urgent-highlight-wrapper ${highlightClass}`}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  ComponentWithUrgentHighlight.displayName = `withUrgentHighlight(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithUrgentHighlight;
}
