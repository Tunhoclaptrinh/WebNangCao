import { z } from "zod";

export const createDeadlineSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(150, "Tiêu đề quá dài"),
  description: z.string().min(10, "Mô tả chi tiết phải có ít nhất 10 ký tự"),
  subjectId: z.string().min(1, "Vui lòng chọn môn học"),
  dueDate: z.string().min(1, "Vui lòng chọn hạn nộp bài"),
  priority: z.enum(["urgent", "high", "medium", "low"], {
    message: "Mức độ ưu tiên không hợp lệ",
  }),
  format: z.string().min(2, "Hình thức nộp không được để trống"),
  maxScore: z.coerce.number().min(1).max(10).default(10),
  requirements: z.union([z.string(), z.array(z.string())]).optional(),
});

export const deadlineSchema = createDeadlineSchema;

export type CreateDeadlineInput = z.infer<typeof createDeadlineSchema>;
