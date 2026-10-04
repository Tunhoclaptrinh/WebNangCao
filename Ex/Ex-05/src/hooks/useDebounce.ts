import { useEffect, useState } from 'react';

/**
 * Custom Hook: useDebounce (Theo Slide 30 - Buổi 5)
 * Trì hoãn việc cập nhật giá trị cho đến khi người dùng ngừng thao tác trong khoảng thời gian delay.
 * Giúp giảm tải CPU, tránh việc lọc 10.000 sản phẩm sau mỗi phím gõ.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
