/**
 * AccordionContent.tsx
 * Phần nội dung của panel.
 * Hiển thị/ẩn với animation khi isOpen thay đổi.
 */

import { type ReactNode, useRef, useEffect, useState } from "react";
import { useAccordionItem } from "../../contexts/AccordionContext";

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

export function AccordionContent({
  children,
  className = "",
}: AccordionContentProps) {
  const { value, isOpen } = useAccordionItem();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  // Cập nhật height khi isOpen thay đổi để tạo animation smooth
  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className={`accordion-content ${className}`}
      id={`accordion-content-${value}`}
      role="region"
      aria-labelledby={`accordion-trigger-${value}`}
      style={{
        height: `${height}px`,
        overflow: "hidden",
        transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div ref={contentRef} className="accordion-content__inner">
        {children}
      </div>
    </div>
  );
}
