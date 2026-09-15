import React from 'react';
import { Assignment } from '../../types/assignment.types';
import { KanbanColumnConfig } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';

export interface KanbanColumnProps {
  config: KanbanColumnConfig;
  items: Assignment[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectAssignment: (id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  config,
  items,
  onToggleStatus,
  onDelete,
  onSelectAssignment,
}) => {
  return (
    <div className="kanban-column">
      {/* Header cột Kanban */}
      <div className="kanban-column__header">
        <div className="kanban-column__title">
          <span>{config.title}</span>
          {config.key === 'urgent' && items.length > 0 && (
            <span className="pulse-indicator" />
          )}
        </div>
        <span
          className="kanban-column__count"
          style={{
            background: config.badgeBg,
            color: config.badgeColor,
            border: `1px solid ${config.borderColor}`,
          }}
        >
          {items.length}
        </span>
      </div>

      {/* Danh sách thẻ trong cột */}
      <div className="kanban-column__list">
        {items.length === 0 ? (
          <div className="kanban-column__empty">
            Không có bài tập
          </div>
        ) : (
          items.map((assignment) => (
            <KanbanCard
              key={assignment.id}
              assignment={assignment}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onClick={() => onSelectAssignment(assignment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
