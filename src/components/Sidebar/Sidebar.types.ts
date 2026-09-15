import { AssignmentStatusFilter, SubjectCode } from '../../types/assignment.types';

export interface SidebarStats {
  total: number;
  completed: number;
  overdue: number;
  pending: number;
  completionRate: number;
}

export interface SidebarProps {
  statusFilter: AssignmentStatusFilter;
  subjectFilter: SubjectCode | 'ALL';
  stats: SidebarStats;
  subjectCounts: Record<string, number>;
  loading: boolean;
  onStatusSelect: (status: AssignmentStatusFilter) => void;
  onSubjectSelect: (subject: SubjectCode | 'ALL') => void;
  onOpenCreateModal?: () => void;
  onResetMockData: () => void;
  onOpenTechDrawer: () => void;
}
