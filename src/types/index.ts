export type UserRole = "admin" | "user";

export type DeadlinePriority = "urgent" | "high" | "medium" | "low";

export type DeadlineStatus = "open" | "closed";

export interface Subject {
  id: string;
  code: string;
  slug: string;
  name: string;
  credits: number;
  lecturer: string;
  lecturerEmail: string;
  room: string;
  schedule: string;
  description: string;
  color: string;
  badge: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  subjectSlug: string;
  dueDate: string; // ISO string
  priority: DeadlinePriority;
  format: string;
  maxScore: number;
  requirements: string[];
  status: DeadlineStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  class?: string;
  passwordHash?: string;
}

export type UserActor = User;

export interface DeadlineFilterOptions {
  search?: string;
  subject?: string;
  priority?: string;
  statusFilter?: "all" | "urgent" | "upcoming" | "overdue";
}

export interface DeadlineStats {
  total: number;
  urgent: number;
  upcoming: number;
  overdue: number;
  completed: number;
  subjectsCount: number;
}
