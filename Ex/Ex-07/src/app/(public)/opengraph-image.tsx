import { createOgImage } from "@/components/og-image";
export const alt = "DevWorkspace — Một góc nhỏ, nhiều cảm hứng";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return createOgImage(
    "Make room for better.",
    "Thoughtfully selected. Made for your workspace.",
  );
}
