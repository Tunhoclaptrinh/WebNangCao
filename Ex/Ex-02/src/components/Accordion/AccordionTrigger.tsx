/**
 * AccordionTrigger.tsx
 * Nút bấm để mở/đóng một panel.
 * Tự động kết nối với AccordionContext và AccordionItemContext.
 */

import { type ReactNode } from "react";
import {
  useAccordion,
  useAccordionItem,
} from "../../contexts/AccordionContext";

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

export function AccordionTrigger({
  children,
  className = "",
}: AccordionTriggerProps) {
  const { togglePanel } = useAccordion();
  const { value, isOpen } = useAccordionItem();

  return (
    <button
      className={`accordion-trigger ${className}`}
      onClick={() => togglePanel(value)}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${value}`}
      id={`accordion-trigger-${value}`}
      type="button"
    >
      <span className="accordion-trigger__text">{children}</span>
      <span
        className="accordion-trigger__icon"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </button>
  );
}
