import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce.ts';

describe('useDebounce Custom Hook Tests với Fake Timers (Slide 34)', () => {
  beforeEach(() => {
    // Sử dụng fake timers theo đúng yêu cầu Slide 34
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('trả về giá trị ban đầu ngay khi khởi tạo', () => {
    // Arrange & Act
    const { result } = renderHook(() => useDebounce('hello', 300));

    // Assert: Giá trị ban đầu đúng
    expect(result.current).toBe('hello');
  });

  it('sử dụng giá trị delay mặc định (500ms) khi không truyền tham số delay', () => {
    const { result } = renderHook(() => useDebounce('default-delay-test'));
    expect(result.current).toBe('default-delay-test');
  });

  it('chỉ cập nhật giá trị sau khi thời gian delay 300ms đã trôi qua', () => {
    // Arrange: Bắt đầu với 'initial'
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Act 1: Thay đổi giá trị thành 'updated'
    rerender({ value: 'updated', delay: 300 });

    // Assert 1: Khi chưa hết 300ms (vd mới 150ms), giá trị vẫn là 'initial'
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('initial');

    // Act 2: Tua tiếp 150ms nữa (tổng 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Assert 2: Lúc này giá trị đã được cập nhật thành 'updated'
    expect(result.current).toBe('updated');
  });

  it('hủy bỏ timer cũ và chỉ giữ giá trị cuối cùng khi thay đổi liên tục (Debounce behavior)', () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    // Act: Gõ nhanh liên tiếp a -> ab -> abc
    rerender({ value: 'ab' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'abc' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Lúc này 'abc' mới trôi qua 100ms, giá trị vẫn là 'a'
    expect(result.current).toBe('a');

    // Tua nốt 200ms
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Cuối cùng chỉ cập nhật giá trị cuối 'abc'
    expect(result.current).toBe('abc');
  });
});
