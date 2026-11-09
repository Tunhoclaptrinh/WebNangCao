"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActor, requireUserActor } from "@/features/auth/guards";
import { createDeadline, deleteDeadline, toggleUserCompletion, getSubjectById } from "@/lib/data";
import { createDeadlineSchema } from "./validation";
import type { DeadlinePriority } from "@/types";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export async function createDeadlineAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminActor();

    const raw = {
      title: formData.get("title"),
      description: formData.get("description"),
      subjectId: formData.get("subjectId"),
      dueDate: formData.get("dueDate"),
      priority: formData.get("priority"),
      format: formData.get("format"),
      maxScore: formData.get("maxScore") || 10,
      requirements: formData.get("requirements") || "",
    };

    const parsed = createDeadlineSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Dữ liệu nhập không hợp lệ",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const subject = await getSubjectById(parsed.data.subjectId);
    if (!subject) {
      return { success: false, message: "Môn học không tồn tại" };
    }

    const requirementsList = parsed.data.requirements
      ? String(parsed.data.requirements)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : ["Nộp bài đúng hạn quy định", "Kiểm tra mã nguồn và báo cáo đầy đủ"];

    const created = await createDeadline({
      title: parsed.data.title,
      description: parsed.data.description,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectSlug: subject.slug,
      dueDate: new Date(parsed.data.dueDate).toISOString(),
      priority: parsed.data.priority as DeadlinePriority,
      format: parsed.data.format,
      maxScore: parsed.data.maxScore,
      requirements: requirementsList,
      status: "open",
    });

    // On-demand revalidation according to Lab 3 requirements
    revalidatePath("/");
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${created.id}`);
    revalidatePath(`/subjects/${subject.slug}`);
    revalidatePath("/admin");

    return {
      success: true,
      message: "Thêm deadline mới thành công!",
      data: created,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm deadline",
    };
  }
}

export async function deleteDeadlineAction(id: string): Promise<ActionResult> {
  try {
    await requireAdminActor();

    const deleted = await deleteDeadline(id);
    if (!deleted) {
      return { success: false, message: "Không tìm thấy deadline cần xóa" };
    }

    // On-demand revalidation
    revalidatePath("/");
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${id}`);
    revalidatePath("/admin");

    return {
      success: true,
      message: "Đã xóa deadline thành công!",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xóa deadline",
    };
  }
}

export async function toggleCompletionAction(deadlineId: string): Promise<ActionResult<{ completed: boolean }>> {
  try {
    const actor = await requireUserActor();

    const completed = await toggleUserCompletion(actor.email, deadlineId);

    revalidatePath("/dashboard");
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${deadlineId}`);

    return {
      success: true,
      message: completed ? "Đã đánh dấu hoàn thành bài tập!" : "Đã hoàn tác trạng thái hoàn thành!",
      data: { completed },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Lỗi khi cập nhật trạng thái",
    };
  }
}
