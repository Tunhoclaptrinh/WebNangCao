/**
 * Accordion.tsx
 * Root component của Accordion Compound Component.
 * Cung cấp Context cho tất cả component con bên trong.
 */

import { useState, type ReactNode } from "react";
import { AccordionContext } from "../../contexts/AccordionContext";
import "./Accordion.css";

interface AccordionProps {
  children: ReactNode;
  /** Cho phép tất cả panel đều đóng (mặc định true) */
  collapsible?: boolean;
  /** Giá trị mặc định của panel đang mở */
  defaultValue?: string;
  className?: string;
}

/**
 * Accordion — Root component.
 * Quản lý state activePanel, cung cấp togglePanel qua Context.
 */
export function Accordion({
  children,
  collapsible = true,
  defaultValue,
  className = "",
}: AccordionProps) {
  const [activePanel, setActivePanel] = useState<string | null>(
    defaultValue ?? null
  );

  function togglePanel(value: string) {
    setActivePanel((prev) => {
      if (prev === value) {
        // Đang mở → đóng (chỉ nếu collapsible = true)
        return collapsible ? null : prev;
      }
      // Mở panel mới (panel cũ tự đóng vì chỉ lưu 1 giá trị)
      return value;
    });
  }

  return (
    <AccordionContext.Provider value={{ activePanel, togglePanel }}>
      <div className={`accordion ${className}`} role="region">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
