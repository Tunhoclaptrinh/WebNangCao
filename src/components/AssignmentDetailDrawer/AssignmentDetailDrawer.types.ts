import { Assignment } from '../../types/assignment.types';

export interface AssignmentDetailDrawerProps {
  assignment?: Assignment;
  open: boolean;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}
