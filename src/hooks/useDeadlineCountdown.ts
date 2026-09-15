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
  bg: string;
  textColor: string;
  borderColor: string;
}

/**
 * Custom Hook tính toán thời hạn deadline theo thời gian thực (Buổi 2 React Design Pattern)
 * Phục vụ yêu cầu 6: Hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"
 * Thiết kế bảng màu Pastel cao cấp theo chuẩn Minimalist Taste
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
        color: 'default',
        diffDays: 0,
        diffHours: 0,
        isOverdue: false,
        formattedDueDate,
        bg: '#f1f5f9',
        textColor: '#64748b',
        borderColor: '#e2e8f0',
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
        bg: '#fef2f2',
        textColor: '#b91c1c',
        borderColor: '#fecaca',
      };
    }

    // Hôm nay đến hạn (< 24 giờ)
    if (diffHours <= 24) {
      const text = diffHours <= 1 
        ? 'Hạn nộp trong 1 giờ tới' 
        : `Hôm nay (còn ${diffHours} giờ)`;

      return {
        text,
        status: 'urgent',
        color: 'warning',
        diffDays: 0,
        diffHours,
        isOverdue: false,
        formattedDueDate,
        bg: '#fffbeb',
        textColor: '#b45309',
        borderColor: '#fde68a',
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
      bg: diffDays <= 3 ? '#fff7ed' : '#eff6ff',
      textColor: diffDays <= 3 ? '#c2410c' : '#1d4ed8',
      borderColor: diffDays <= 3 ? '#fed7aa' : '#bfdbfe',
    };
  }, [dueDate, isCompleted]);
}
