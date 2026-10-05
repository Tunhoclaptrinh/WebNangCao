import { useEffect, useState } from 'react';

/**
 * Custom Hook useDebounce
 * Trì hoãn việc cập nhật giá trị cho tới khi hết khoảng thời gian delay
 * Rất hữu ích cho ô tìm kiếm, auto-suggest, giảm tải gọi API
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
