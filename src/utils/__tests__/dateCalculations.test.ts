import { isOverdue, calcDaysLeft, formatDueDate, calcStats } from '../dateCalculations';
import type { Assignment } from '../../types/assignment.types';

describe('Unit Tests: Date & Stats Calculations (Pure Functions)', () => {
  const mockNow = new Date('2026-10-06T08:00:00.000Z');

  describe('isOverdue', () => {
    it('trả về true nếu hạn nộp nằm trong quá khứ so với mốc thời gian', () => {
      const pastDate = '2026-10-01T10:00:00.000Z';
      expect(isOverdue(pastDate, mockNow)).toBe(true);
    });

    it('trả về false nếu hạn nộp nằm ở tương lai so với mốc thời gian', () => {
      const futureDate = '2026-10-15T10:00:00.000Z';
      expect(isOverdue(futureDate, mockNow)).toBe(false);
    });
  });

  describe('calcDaysLeft', () => {
    it('tính chính xác số ngày còn lại đến hạn nộp', () => {
      const futureDate = '2026-10-09T08:00:00.000Z';
      expect(calcDaysLeft(futureDate, mockNow)).toBe(3);
    });

    it('trả về số âm nếu đã quá hạn nộp', () => {
      const pastDate = '2026-10-04T08:00:00.000Z';
      expect(calcDaysLeft(pastDate, mockNow)).toBe(-2);
    });

    it('trả về 0 nếu hạn nộp là trong ngày hôm nay', () => {
      const todayDate = '2026-10-06T10:00:00.000Z';
      expect(calcDaysLeft(todayDate, mockNow)).toBe(0);
    });
  });

  describe('formatDueDate', () => {
    it('định dạng ngày tháng chuẩn DD/MM/YYYY HH:mm', () => {
      const dateStr = '2026-10-25T14:30:00.000Z';
      const formatted = formatDueDate(dateStr);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/);
    });
  });

  describe('calcStats', () => {
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Bài tập 1 - Hoàn thành',
        subject: 'LTWNC',
        dueDate: '2026-10-01T12:00:00.000Z',
        priority: 'HIGH',
        completed: true,
        createdAt: '2026-09-20T12:00:00.000Z',
      },
      {
        id: '2',
        title: 'Bài tập 2 - Quá hạn',
        subject: 'CSDL',
        dueDate: '2026-10-02T12:00:00.000Z',
        priority: 'URGENT',
        completed: false,
        createdAt: '2026-09-20T12:00:00.000Z',
      },
      {
        id: '3',
        title: 'Bài tập 3 - Đang chờ',
        subject: 'KTMT',
        dueDate: '2026-10-15T12:00:00.000Z',
        priority: 'MEDIUM',
        completed: false,
        createdAt: '2026-09-20T12:00:00.000Z',
      },
      {
        id: '4',
        title: 'Bài tập 4 - Khẩn cấp trong 24h',
        subject: 'MMT',
        dueDate: '2026-10-06T18:00:00.000Z',
        priority: 'URGENT',
        completed: false,
        createdAt: '2026-09-20T12:00:00.000Z',
      },
    ];

    it('tính toán chính xác các chỉ số tổng quan', () => {
      const stats = calcStats(mockAssignments, mockNow);
      expect(stats.total).toBe(4);
      expect(stats.completed).toBe(1);
      expect(stats.overdue).toBe(1);
      expect(stats.pending).toBe(2);
      expect(stats.urgentCount).toBe(1);
      expect(stats.completionRate).toBe(25);
    });

    it('xử lý an toàn khi danh sách bài tập rỗng', () => {
      const emptyStats = calcStats([], mockNow);
      expect(emptyStats).toEqual({
        total: 0,
        completed: 0,
        overdue: 0,
        pending: 0,
        urgentCount: 0,
        completionRate: 0,
      });
    });
  });
});
