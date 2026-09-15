import { Assignment } from '../../types/assignment.types';

export interface KanbanBoardProps {
  assignments: Assignment[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectAssignment: (id: string) => void;
}

export interface KanbanCardProps {
  assignment: Assignment;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export interface KanbanColumnConfig {
  key: string;
  title: string;
  badgeBg: string;
  badgeColor: string;
  borderColor: string;
}
