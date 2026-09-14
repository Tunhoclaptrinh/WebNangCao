/**
 * AccordionItem.tsx
 * Đại diện cho một panel trong Accordion.
 * Cung cấp AccordionItemContext cho Trigger và Content bên trong.
 */

import { type ReactNode } from "react";
import {
  AccordionItemContext,
  useAccordion,
} from "../../contexts/AccordionContext";

interface AccordionItemProps {
  /** Định danh duy nhất của panel này (phải unique trong Accordion) */
  value: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({
  value,
  children,
  className = "",
}: AccordionItemProps) {
  const { activePanel } = useAccordion();
  const isOpen = activePanel === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        className={`accordion-item ${isOpen ? "accordion-item--open" : ""} ${className}`}
        data-state={isOpen ? "open" : "closed"}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
