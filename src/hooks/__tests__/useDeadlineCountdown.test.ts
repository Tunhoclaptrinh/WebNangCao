import { renderHook } from '@testing-library/react';
import { useDeadlineCountdown } from '../useDeadlineCountdown';

describe('Custom Hook Tests: useDeadlineCountdown', () => {
  it('trả về trạng thái completed khi bài tập đã hoàn thành', () => {
    const dueDate = new Date(Date.now() + 86400000).toISOString();
    const { result } = renderHook(() => useDeadlineCountdown(dueDate, true));

    expect(result.current.status).toBe('completed');
    expect(result.current.text).toBe('Đã hoàn thành');
  });

  it('trả về trạng thái overdue khi bài tập đã quá hạn', () => {
    const overdueDate = new Date(Date.now() - 86400000 * 2).toISOString();
    const { result } = renderHook(() => useDeadlineCountdown(overdueDate, false));

    expect(result.current.status).toBe('overdue');
    expect(result.current.text).toContain('Quá hạn');
  });

  it('trả về trạng thái upcoming khi bài tập còn nhiều thời gian', () => {
    const futureDate = new Date(Date.now() + 86400000 * 10).toISOString();
    const { result } = renderHook(() => useDeadlineCountdown(futureDate, false));

    expect(result.current.status).toBe('upcoming');
    expect(result.current.text).toContain('Còn');
  });
});
