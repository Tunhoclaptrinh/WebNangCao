import { redirect } from "next/navigation";
import { requirePageActor } from "@/features/auth/page-access";
export default async function AdminPage() {
  await requirePageActor("/admin", "product:write");
  redirect("/admin/products");
}
