import { Dayjs } from 'dayjs';
import { CreateAssignmentPayload, Priority, SubjectCode } from '../../types/assignment.types';

export interface AssignmentFormValues {
  title: string;
  subject: SubjectCode;
  dueDateTime: Dayjs;
  priority: Priority;
  description?: string;
}

export interface AssignmentFormModalProps {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateAssignmentPayload) => void;
}
