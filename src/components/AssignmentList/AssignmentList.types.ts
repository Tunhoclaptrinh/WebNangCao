import { Assignment } from '../../types/assignment.types';

export interface AssignmentListProps {
  assignments: Assignment[];
  totalCount: number;
  loading: boolean;
  error?: string | null;
  pinnedIds?: string[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
  onSelectAssignment?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onRetry?: () => void;
}
