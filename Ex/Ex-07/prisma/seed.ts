import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import products from "./products.json";
const db = new PrismaClient();
async function seed() {
  const passwordHash = await hash("Demo@12345", 12);
  for (const user of [
    {
      id: "user-demo-admin",
      email: "admin@devworkspace.local",
      name: "Nguyễn Tiến Tuấn",
      role: "admin",
    },
    {
      id: "user-demo-member",
      email: "user@devworkspace.local",
      name: "Thành viên DevWorkspace",
      role: "user",
    },
  ])
    await db.user.upsert({
      where: { id: user.id },
      create: { ...user, passwordHash },
      update: {},
    });
  for (const product of products)
    await db.product.upsert({
      where: { id: product.id },
      create: product,
      update: {},
    });
  console.log(
    "Đã seed 2 tài khoản mẫu và 8 sản phẩm (không ghi đè dữ liệu đã chỉnh sửa).",
  );
}
seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
