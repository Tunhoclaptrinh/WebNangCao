/**
 * index.ts — Public API của Accordion Compound Component.
 *
 * Cách dùng:
 * ```tsx
 * import { Accordion } from "@/components/Accordion";
 *
 * <Accordion defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Câu hỏi 1?</Accordion.Trigger>
 *     <Accordion.Content>Trả lời 1...</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */

import { Accordion as AccordionRoot } from "./Accordion";
import { AccordionItem } from "./AccordionItem";
import { AccordionTrigger } from "./AccordionTrigger";
import { AccordionContent } from "./AccordionContent";

// Gắn các sub-component vào root component để dùng dot notation
const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export { Accordion };
export type { } from "./Accordion";
