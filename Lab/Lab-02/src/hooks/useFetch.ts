/**
 * useFetch.ts — Bài Thực Hành 3/3
 * Custom Hook useFetch<T> generic để fetch dữ liệu từ API.
 *
 * Nguyên tắc:
 * - Single Responsibility: chỉ lo việc fetch dữ liệu
 * - Generic <T>: dùng được cho mọi kiểu dữ liệu (Product[], User, ...)
 * - Không phụ thuộc UI: hook không biết component sẽ render gì
 * - Dễ test độc lập
 */

import { useState, useEffect } from "react";

// ─── Return type rõ ràng, có generic ───
export interface FetchState<T> {
  /** Dữ liệu nhận được. null khi đang loading hoặc có lỗi */
  data: T | null;
  /** true khi đang fetch */
  loading: boolean;
  /** Message lỗi, null khi thành công */
  error: string | null;
  /** Hàm refetch thủ công */
  refetch: () => void;
}

/**
 * useFetch<T> — Generic data fetching hook
 *
 * @param url - URL API cần fetch
 *
 * @example
 * ```tsx
 * const { data: products, loading, error } = useFetch<Product[]>('/api/products');
 * ```
 */
export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Dùng counter để trigger refetch
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    // AbortController để cancel request khi component unmount
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json() as Promise<T>;
      })
      .then((json) => {
        setData(json);
      })
      .catch((err: Error) => {
        // Bỏ qua lỗi do AbortController cancel
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // Cleanup: cancel request khi url thay đổi hoặc component unmount
    return () => controller.abort();
  }, [url, fetchCount]);

  function refetch() {
    setFetchCount((c) => c + 1);
  }

  return { data, loading, error, refetch };
}
