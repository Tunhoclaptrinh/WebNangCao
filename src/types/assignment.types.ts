/**
 * Ứng dụng Student Deadline Tracker - Quản lý Deadline Bài Tập Cá Nhân
 * Học viện Công nghệ Bưu chính Viễn thông (PTIT)
 * 
 * PHẦN 1: TYPESCRIPT NÂNG CAO (BUỔI 1)
 * - Generic types
 * - Utility types (Pick, Omit, Partial, Record)
 * - User-Defined Type Guards
 */

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SubjectCode = 
  | 'LTWNC'   // Lập trình Web Nâng Cao
  | 'CSDL'    // Cơ sở Dữ liệu
  | 'KTMT'    // Kiến trúc Máy tính
  | 'MMT'     // Mạng Máy tính
  | 'OOP'     // Lập trình Hướng đối tượng
  | 'OTHER';  // Môn học khác

export type AssignmentStatusFilter = 'ALL' | 'PENDING' | 'OVERDUE' | 'COMPLETED';

export interface SubjectMeta {
  code: SubjectCode;
  name: string;
  color: string;
  iconText: string;
}

export interface PriorityMeta {
  priority: Priority;
  label: string;
  color: string;
  badgeStatus: 'default' | 'processing' | 'warning' | 'error';
  weight: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: SubjectCode;
  dueDate: string;          // ISO String (YYYY-MM-DDTHH:mm:ss.sssZ)
  priority: Priority;
  completed: boolean;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

// -------------------------------------------------------------
// Utility Types & Generics (Áp dụng lý thuyết Buổi 1)
// -------------------------------------------------------------

// Omit để tạo payload thêm mới (id, createdAt, completed do hệ thống tự sinh)
export type CreateAssignmentPayload = Omit<Assignment, 'id' | 'createdAt' | 'completed' | 'completedAt'>;

// Partial để tạo payload cập nhật bài tập
export type UpdateAssignmentPayload = Partial<Omit<Assignment, 'id' | 'createdAt'>> & { id: string };

// Pick để lấy nhanh thông tin tóm tắt cho thông báo / badge
export type AssignmentSummary = Pick<Assignment, 'id' | 'title' | 'subject' | 'dueDate' | 'priority'>;

// Generic Filter Criteria cho danh sách dữ liệu T
export interface FilterCriteria<T> {
  status: AssignmentStatusFilter;
  subject?: SubjectCode | 'ALL';
  priority?: Priority | 'ALL';
  searchQuery?: string;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}

// Generic API Response chuẩn hoá
export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string;
  statusCode: number;
}

// -------------------------------------------------------------
// Mapping hằng số môn học và độ ưu tiên (Record Utility Type)
// -------------------------------------------------------------

export const SUBJECT_METAS: Record<SubjectCode, SubjectMeta> = {
  LTWNC: { code: 'LTWNC', name: 'Lập trình Web Nâng Cao', color: 'blue', iconText: 'WEB' },
  CSDL: { code: 'CSDL', name: 'Cơ sở Dữ liệu', color: 'green', iconText: 'DB' },
  KTMT: { code: 'KTMT', name: 'Kiến trúc Máy tính', color: 'purple', iconText: 'ARCH' },
  MMT: { code: 'MMT', name: 'Mạng Máy tính', color: 'cyan', iconText: 'NET' },
  OOP: { code: 'OOP', name: 'Lập trình Hướng đối tượng', color: 'orange', iconText: 'OOP' },
  OTHER: { code: 'OTHER', name: 'Môn học khác', color: 'default', iconText: 'GEN' },
};

export const PRIORITY_METAS: Record<Priority, PriorityMeta> = {
  LOW: { priority: 'LOW', label: 'Thấp', color: '#52c41a', badgeStatus: 'default', weight: 1 },
  MEDIUM: { priority: 'MEDIUM', label: 'Trung bình', color: '#1677ff', badgeStatus: 'processing', weight: 2 },
  HIGH: { priority: 'HIGH', label: 'Cao', color: '#fa8c16', badgeStatus: 'warning', weight: 3 },
  URGENT: { priority: 'URGENT', label: 'Khẩn cấp', color: '#f5222d', badgeStatus: 'error', weight: 4 },
};

// -------------------------------------------------------------
// Type Guards Chuyên Biệt (Runtime & Compile-Time Type Safety)
// -------------------------------------------------------------

/**
 * Type Guard: Kiểm tra bài tập đã hoàn thành
 */
export function isCompletedAssignment(assignment: Assignment): boolean {
  return assignment.completed === true;
}

/**
 * Type Guard: Kiểm tra bài tập đã quá hạn nộp
 */
export function isOverdueAssignment(assignment: Assignment, referenceDate: Date = new Date()): boolean {
  if (assignment.completed) return false;
  return new Date(assignment.dueDate).getTime() < referenceDate.getTime();
}

/**
 * Type Guard: Kiểm tra bài tập sắp đến hạn trong ngưỡng số giờ quy định (mặc định 24h)
 */
export function isUrgentAssignment(assignment: Assignment, hoursThreshold: number = 24): boolean {
  if (assignment.completed) return false;
  const now = Date.now();
  const due = new Date(assignment.dueDate).getTime();
  const diff = due - now;
  return diff > 0 && diff <= hoursThreshold * 3600 * 1000;
}
