import { Assignment } from '../../types/assignment.types';

export interface AssignmentListProps {
  assignments: Assignment[];
  totalCount: number;
  loading: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
  onSelectAssignment?: (id: string) => void;
}
