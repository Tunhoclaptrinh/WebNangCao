/**
 * usePagination.ts
 * Custom hook phân trang generic cho bất kỳ kiểu dữ liệu T nào.
 *
 * @example
 * ```tsx
 * const { currentPage, totalPages, currentData, next, prev, goToPage }
 *   = usePagination(products, 4);
 * ```
 */

import { useState, useMemo } from "react";

export interface UsePaginationReturn<T> {
  /** Trang hiện tại (bắt đầu từ 1) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Dữ liệu của trang hiện tại */
  currentData: T[];
  /** Chuyển sang trang tiếp theo (không vượt quá totalPages) */
  next: () => void;
  /** Quay về trang trước (không nhỏ hơn 1) */
  prev: () => void;
  /** Nhảy đến trang bất kỳ (có kiểm tra biên) */
  goToPage: (page: number) => void;
  /** Kiểm tra có trang tiếp theo không */
  hasNext: boolean;
  /** Kiểm tra có trang trước không */
  hasPrev: boolean;
}

/**
 * usePagination<T> — Hook phân trang generic
 *
 * @param data       - Mảng dữ liệu đầy đủ
 * @param itemsPerPage - Số item hiển thị mỗi trang
 */
export function usePagination<T>(
  data: T[],
  itemsPerPage: number
): UsePaginationReturn<T> {
  // Kiểm tra đầu vào hợp lệ
  if (itemsPerPage <= 0) {
    throw new Error("itemsPerPage phải lớn hơn 0");
  }

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Tính tổng số trang — useMemo để không tính lại khi currentPage thay đổi
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.length / itemsPerPage)),
    [data.length, itemsPerPage]
  );

  // Lấy data slice của trang hiện tại
  const currentData = useMemo<T[]>(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Đảm bảo currentPage không vượt totalPages khi data thay đổi
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  /** Chuyển sang trang tiếp theo */
  function next() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  /** Quay về trang trước */
  function prev() {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  /**
   * Nhảy đến trang bất kỳ
   * @param page - Số trang (1-indexed). Tự clamp về [1, totalPages]
   */
  function goToPage(page: number) {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
  }

  return {
    currentPage,
    totalPages,
    currentData,
    next,
    prev,
    goToPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
