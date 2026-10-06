import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 * Trì hoãn việc cập nhật giá trị đầu vào sau một khoảng thời gian chờ (mặc định 300ms)
 * Giúp tối ưu hóa hiệu năng khi người dùng gõ vào ô tìm kiếm hoặc bộ lọc
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
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

export default useDebounce;
