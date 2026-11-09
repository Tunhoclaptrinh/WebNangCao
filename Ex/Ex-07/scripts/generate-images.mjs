import sharp from "sharp";
import { readdir } from "node:fs/promises";
for (const name of await readdir("public/images")) {
  if (!name.endsWith(".svg")) continue;
  await sharp(`public/images/${name}`)
    .webp({ quality: 85, effort: 6 })
    .toFile(`public/images/${name.replace(".svg", ".webp")}`);
}
console.log("Đã xuất WebP từ các minh họa SVG local.");
