/**
 * TabsContext.ts — Bài Thực Hành 2/3
 * Context API cho Tabs Compound Component.
 */

import { createContext, useContext } from "react";

export interface TabsContextType {
  /** Giá trị tab đang active */
  value: string;
  /** Hàm chuyển tab */
  setValue: (v: string) => void;
}

export const TabsContext = createContext<TabsContextType | null>(null);

/**
 * useTabsContext — Hook lấy context, ném lỗi nếu dùng ngoài <Tabs>
 */
export function useTabsContext(): TabsContextType {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("useTabsContext phải được dùng bên trong <Tabs>");
  }
  return ctx;
}
