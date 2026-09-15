import { createContext, useContext } from 'react';
import { AssignmentStatusFilter, Priority, SubjectCode } from '../../types/assignment.types';

export interface FilterContextType {
  statusFilter: AssignmentStatusFilter;
  subjectFilter: SubjectCode | 'ALL';
  priorityFilter: Priority | 'ALL';
  searchQuery: string;
  onStatusChange: (status: AssignmentStatusFilter) => void;
  onSubjectChange: (subject: SubjectCode | 'ALL') => void;
  onPriorityChange: (priority: Priority | 'ALL') => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function useFilterContext(): FilterContextType {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('FilterGroup sub-components must be rendered within a FilterGroup parent!');
  }
  return context;
}
