import dayjs from 'dayjs';
import type { Assignment } from '../types/assignment.types';

/**
 * Kiểm tra xem bài tập có bị quá hạn không (so với ngày mốc)
 */
export function isOverdue(dueDate: string | Date, referenceDate: Date = new Date()): boolean {
  const due = new Date(dueDate).getTime();
  const ref = referenceDate.getTime();
  return due < ref;
}

/**
 * Tính toán số ngày còn lại đến hạn nộp
 * - Dương: còn N ngày
 * - 0: hôm nay
 * - Âm: quá hạn N ngày
 */
export function calcDaysLeft(dueDate: string | Date, referenceDate: Date = new Date()): number {
  const due = dayjs(dueDate).startOf('day');
  const ref = dayjs(referenceDate).startOf('day');
  return due.diff(ref, 'day');
}

/**
 * Định dạng ngày đến hạn thân thiện
 */
export function formatDueDate(dueDate: string | Date): string {
  return dayjs(dueDate).format('DD/MM/YYYY HH:mm');
}

export interface AssignmentStats {
  total: number;
  completed: number;
  overdue: number;
  pending: number;
  urgentCount: number;
  completionRate: number;
}

/**
 * Tính toán thống kê tổng quan cho danh sách bài tập
 */
export function calcStats(assignments: Assignment[], referenceDate: Date = new Date()): AssignmentStats {
  const total = assignments.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      overdue: 0,
      pending: 0,
      urgentCount: 0,
      completionRate: 0,
    };
  }

  let completed = 0;
  let overdue = 0;
  let pending = 0;
  let urgentCount = 0;

  const refTime = referenceDate.getTime();
  const urgentThreshold = refTime + 24 * 3600 * 1000;

  for (const a of assignments) {
    if (a.completed) {
      completed++;
    } else {
      const dueTime = new Date(a.dueDate).getTime();
      if (dueTime < refTime) {
        overdue++;
      } else {
        pending++;
        if (dueTime <= urgentThreshold) {
          urgentCount++;
        }
      }
    }
  }

  const completionRate = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    overdue,
    pending,
    urgentCount,
    completionRate,
  };
}
