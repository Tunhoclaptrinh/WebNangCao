import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export type DeadlineCountdownStatus = 'completed' | 'overdue' | 'today' | 'urgent' | 'upcoming';

export interface DeadlineCountdownResult {
  text: string;
  status: DeadlineCountdownStatus;
  color: string;
  diffDays: number;
  diffHours: number;
  isOverdue: boolean;
  formattedDueDate: string;
}

/**
 * Custom Hook tính toán thời hạn deadline theo thời gian thực (Buổi 2 React Design Pattern)
 * Phục vụ yêu cầu 6: Hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"
 */
export function useDeadlineCountdown(
  dueDate: string, 
  isCompleted: boolean = false
): DeadlineCountdownResult {
  return useMemo(() => {
    const formattedDueDate = dayjs(dueDate).format('DD/MM/YYYY HH:mm');

    // Nếu đã hoàn thành
    if (isCompleted) {
      return {
        text: 'Đã hoàn thành',
        status: 'completed',
        color: 'success',
        diffDays: 0,
        diffHours: 0,
        isOverdue: false,
        formattedDueDate,
      };
    }

    const now = dayjs();
    const target = dayjs(dueDate);
    const diffMillis = target.diff(now);
    const diffHours = Math.round(diffMillis / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMillis / (1000 * 60 * 60 * 24));

    // Đã quá hạn
    if (diffMillis < 0) {
      const overdueDays = Math.abs(Math.floor(diffMillis / (1000 * 60 * 60 * 24)));
      const overdueHours = Math.abs(diffHours);
      
      const text = overdueDays === 0 
        ? `Quá hạn ${overdueHours} giờ` 
        : `Quá hạn ${overdueDays} ngày`;

      return {
        text,
        status: 'overdue',
        color: 'error',
        diffDays,
        diffHours,
        isOverdue: true,
        formattedDueDate,
      };
    }

    // Hôm nay đến hạn (< 24 giờ)
    if (diffHours <= 24) {
      const text = diffHours <= 1 
        ? 'Hạn nộp trong 1 giờ tới!' 
        : `Hôm nay (còn ${diffHours} giờ)`;

      return {
        text,
        status: 'urgent',
        color: 'warning',
        diffDays: 0,
        diffHours,
        isOverdue: false,
        formattedDueDate,
      };
    }

    // Còn X ngày
    return {
      text: `Còn ${diffDays} ngày`,
      status: 'upcoming',
      color: diffDays <= 3 ? 'orange' : 'processing',
      diffDays,
      diffHours,
      isOverdue: false,
      formattedDueDate,
    };
  }, [dueDate, isCompleted]);
}
