import { createDeadlineAction, deleteDeadlineAction, toggleCompletionAction } from "@/features/deadlines/actions";
import { requireAdminActor, requireUserActor } from "@/features/auth/guards";
import { getSubjectById } from "@/lib/data";

jest.mock("@/features/auth/guards", () => ({
  requireAdminActor: jest.fn(),
  requireUserActor: jest.fn(),
}));

describe("Deadline Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fails to create deadline when form data is invalid", async () => {
    (requireAdminActor as jest.Mock).mockResolvedValue({
      id: "admin",
      role: "admin",
      email: "admin@ptit.edu.vn",
    });

    const formData = new FormData();
    formData.set("title", "abc"); // too short
    formData.set("description", "short");

    const result = await createDeadlineAction(formData);
    expect(result.success).toBe(false);
    expect(result.message).toContain("không hợp lệ");
  });

  it("successfully creates deadline when admin submits valid data", async () => {
    (requireAdminActor as jest.Mock).mockResolvedValue({
      id: "admin",
      role: "admin",
      email: "admin@ptit.edu.vn",
    });

    const subject = await getSubjectById("sub_int1411");
    expect(subject).toBeDefined();

    const formData = new FormData();
    formData.set("title", "Bài tập thực hành Server Actions");
    formData.set("description", "Kiểm tra thực thi server action trên Next.js 15 App Router");
    formData.set("subjectId", "sub_int1411");
    formData.set("dueDate", new Date(Date.now() + 86400000 * 4).toISOString());
    formData.set("priority", "urgent");
    formData.set("format", "GitHub Submission");
    formData.set("maxScore", "10");

    const result = await createDeadlineAction(formData);
    expect(result.success).toBe(true);
    expect(result.message).toContain("thành công");
    expect(result.data).toBeDefined();

    // Now delete this created deadline
    const createdId = (result.data as { id: string }).id;
    const deleteRes = await deleteDeadlineAction(createdId);
    expect(deleteRes.success).toBe(true);
  });

  it("toggles completion for student user", async () => {
    (requireUserActor as jest.Mock).mockResolvedValue({
      id: "sv",
      role: "user",
      email: "sv-action-test@ptit.edu.vn",
    });

    const res1 = await toggleCompletionAction("dl_01");
    expect(res1.success).toBe(true);
    expect(res1.message).toContain("hoàn thành");

    const res2 = await toggleCompletionAction("dl_01");
    expect(res2.success).toBe(true);
    expect(res2.message).toContain("hoàn tác");
  });
});
