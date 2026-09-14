/**
 * AccordionContext.ts
 * Context API cho Accordion Compound Component.
 * Lưu trữ: panel đang active và hàm thay đổi active panel.
 */

import { createContext, useContext } from "react";

export interface AccordionContextType {
  /** Giá trị của panel đang mở. null = không panel nào mở */
  activePanel: string | null;
  /** Hàm toggle panel: nếu đang mở thì đóng, nếu đang đóng thì mở */
  togglePanel: (value: string) => void;
}

export const AccordionContext = createContext<AccordionContextType | null>(null);

/**
 * Custom hook để lấy AccordionContext.
 * Phải được dùng bên trong <Accordion>.
 */
export function useAccordion(): AccordionContextType {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("useAccordion phải được dùng bên trong <Accordion>");
  }
  return ctx;
}

// ────────────────────────────────────────────────
// AccordionItemContext — mỗi Item cung cấp value
// của chính nó cho Trigger và Content bên trong.
// ────────────────────────────────────────────────

export interface AccordionItemContextType {
  /** Định danh duy nhất của panel này */
  value: string;
  /** Panel này có đang mở không? */
  isOpen: boolean;
}

export const AccordionItemContext =
  createContext<AccordionItemContextType | null>(null);

export function useAccordionItem(): AccordionItemContextType {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      "useAccordionItem phải được dùng bên trong <Accordion.Item>"
    );
  }
  return ctx;
}
