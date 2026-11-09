import { createOgImage } from "@/components/og-image";
export const alt = "Bộ sưu tập thiết bị DevWorkspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return createOgImage(
    "The workspace collection.",
    "Displays. Keyboards. Audio. Accessories.",
  );
}
