import { deadlineSchema } from "@/features/deadlines/validation";

describe("Deadline Zod Validation Schema", () => {
  it("validates valid deadline input successfully", () => {
    const validData = {
      title: "Bài tập lớn phát triển Web",
      description: "Xây dựng ứng dụng hoàn chỉnh bằng Next.js 15 và Ant Design",
      subjectId: "sub_web_nang_cao",
      dueDate: "2026-11-20T23:59:00.000Z",
      priority: "urgent",
      format: "Báo cáo + Source code GitHub",
      maxScore: 10,
      requirements: ["Đúng hạn", "Đầy đủ tài liệu"],
    };

    const parsed = deadlineSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it("fails validation when title is too short", () => {
    const invalidData = {
      title: "B",
      description: "Mô tả bài tập ngắn",
      subjectId: "sub_web_nang_cao",
      dueDate: "2026-11-20T23:59:00.000Z",
      priority: "high",
    };

    const parsed = deadlineSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.path.includes("title"))).toBe(true);
    }
  });

  it("fails validation when priority is invalid", () => {
    const invalidData = {
      title: "Bài tập kiểm thử",
      description: "Mô tả dài đủ tiêu chuẩn bài tập",
      subjectId: "sub_web_nang_cao",
      dueDate: "2026-11-20T23:59:00.000Z",
      priority: "super-extreme",
    };

    const parsed = deadlineSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });
});
