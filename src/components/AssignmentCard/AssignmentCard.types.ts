import { Assignment } from '../../types/assignment.types';

export interface AssignmentCardProps {
  assignment: Assignment;
  isPinned?: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}
