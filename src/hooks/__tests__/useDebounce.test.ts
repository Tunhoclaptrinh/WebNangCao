import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('Custom Hook Tests: useDebounce (Fake Timers)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('trả về giá trị khởi tạo ngay khi mount', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('không cập nhật giá trị ngay lập tức khi giá trị đầu vào thay đổi', () => {
    let value = 'initial';
    const { result, rerender } = renderHook(() => useDebounce(value, 300));

    value = 'updated_query';
    rerender();

    expect(result.current).toBe('initial');
  });

  it('cập nhật giá trị sau đúng khoảng thời gian chờ (delay = 300ms)', () => {
    let value = 'initial';
    const { result, rerender } = renderHook(() => useDebounce(value, 300));

    value = 'search_react';
    rerender();

    // Advance 150ms -> still old value
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('initial');

    // Advance another 150ms -> updated to new value
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('search_react');
  });
});
