import React from 'react';
import { Assignment, isOverdueAssignment, isUrgentAssignment } from '../types/assignment.types';

export interface WithUrgentHighlightProps {
  assignment: Assignment;
}

/**
 * Higher-Order Component (HOC) - Buổi 2 React Design Patterns
 * Tự động phân tích mức độ khẩn cấp của bài tập và bọc style / badge làm nổi bật
 */
export function withUrgentHighlight<P extends WithUrgentHighlightProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const ComponentWithUrgentHighlight: React.FC<P> = (props) => {
    const { assignment } = props;
    const isOverdue = isOverdueAssignment(assignment);
    const isUrgent = isUrgentAssignment(assignment, 24);

    let highlightStyle: React.CSSProperties = {};

    if (isOverdue) {
      highlightStyle = {
        borderLeft: '4px solid #ff4d4f',
        transition: 'all 0.3s ease',
      };
    } else if (isUrgent) {
      highlightStyle = {
        borderLeft: '4px solid #faad14',
        boxShadow: '0 2px 10px rgba(250, 173, 20, 0.15)',
        transition: 'all 0.3s ease',
      };
    }

    return (
      <div style={highlightStyle} className="urgent-highlight-wrapper">
        <WrappedComponent {...props} />
      </div>
    );
  };

  ComponentWithUrgentHighlight.displayName = `withUrgentHighlight(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithUrgentHighlight;
}
