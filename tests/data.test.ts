import {
  getSubjects,
  getSubjectBySlug,
  getSubjectById,
  getDeadlines,
  getDeadlineById,
  calculateStats,
  getUserCompletions,
  toggleUserCompletion,
  createDeadline,
  deleteDeadline,
  calcDeadlineState,
} from "@/lib/data";

describe("Data Access Layer (DAL) & Domain Logic", () => {
  it("should load all subjects", async () => {
    const subjects = await getSubjects();
    expect(subjects.length).toBeGreaterThanOrEqual(4);
    expect(subjects.map((s) => s.code)).toContain("INT1411");
  });

  it("should get subject by slug and by id", async () => {
    const subject = await getSubjectBySlug("lap-trinh-web-nang-cao");
    expect(subject).not.toBeNull();
    expect(subject?.code).toBe("INT1411");

    const subjectById = await getSubjectById(subject!.id);
    expect(subjectById?.code).toBe("INT1411");

    const nonExistent = await getSubjectBySlug("non-existent");
    expect(nonExistent).toBeNull();
  });

  it("should load all deadlines", async () => {
    const deadlines = await getDeadlines();
    expect(deadlines.length).toBeGreaterThanOrEqual(10);
    const dl1 = await getDeadlineById("dl_01");
    expect(dl1).not.toBeNull();
    expect(dl1?.id).toBe("dl_01");
  });

  it("should filter deadlines by subjectId", async () => {
    const subjects = await getSubjects();
    const sub = subjects[0];
    const filtered = await getDeadlines({ subject: sub.id });
    expect(filtered.every((d) => d.subjectId === sub.id)).toBe(true);
  });

  it("should filter deadlines by priority", async () => {
    const urgent = await getDeadlines({ priority: "urgent" });
    expect(urgent.every((d) => d.priority === "urgent")).toBe(true);
  });

  it("should filter deadlines by query search", async () => {
    const result = await getDeadlines({ search: "Next.js" });
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(
      result.some((d) => d.title.toLowerCase().includes("next.js") || d.description.toLowerCase().includes("next.js"))
    ).toBe(true);
  });

  it("should filter deadlines by status (overdue, urgent, upcoming)", async () => {
    const overdue = await getDeadlines({ statusFilter: "overdue" });
    const now = new Date();
    expect(overdue.every((d) => new Date(d.dueDate) < now)).toBe(true);

    const upcoming = await getDeadlines({ statusFilter: "upcoming" });
    expect(upcoming.every((d) => new Date(d.dueDate) >= now)).toBe(true);
  });

  it("should calculate correct deadline statistics", async () => {
    const deadlines = await getDeadlines();
    const stats = calculateStats(deadlines);
    expect(stats.total).toBe(deadlines.length);
    expect(stats.urgent + stats.upcoming + stats.overdue).toBe(deadlines.length);
    expect(stats.subjectsCount).toBeGreaterThanOrEqual(1);
  });

  it("should create and delete deadlines", async () => {
    const newDl = await createDeadline({
      title: "Bài tập thực hành đặc biệt",
      description: "Mô tả bài tập thực hành đặc biệt cho kiểm thử",
      subjectId: "sub_web_nang_cao",
      subjectName: "Lập trình Web nâng cao",
      subjectSlug: "lap-trinh-web-nang-cao",
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      priority: "high",
      format: "Báo cáo PDF",
      maxScore: 10,
      requirements: ["Yêu cầu 1"],
      status: "open",
    });

    expect(newDl.id).toBeDefined();
    const fetched = await getDeadlineById(newDl.id);
    expect(fetched?.title).toBe("Bài tập thực hành đặc biệt");

    const deleted = await deleteDeadline(newDl.id);
    expect(deleted).toBe(true);

    const deletedAgain = await deleteDeadline(newDl.id);
    expect(deletedAgain).toBe(false);
  });

  it("should toggle and persist user completions", async () => {
    const testEmail = "test-student@ptit.edu.vn";
    const initial = await getUserCompletions(testEmail);
    expect(initial).toEqual([]);

    const added = await toggleUserCompletion(testEmail, "dl_01");
    expect(added).toBe(true);
    let current = await getUserCompletions(testEmail);
    expect(current).toContain("dl_01");

    const removed = await toggleUserCompletion(testEmail, "dl_01");
    expect(removed).toBe(false);
    current = await getUserCompletions(testEmail);
    expect(current).not.toContain("dl_01");
  });

  it("should calculate deadline timing state correctly", () => {
    const past = new Date(Date.now() - 86400000 * 2).toISOString();
    const statePast = calcDeadlineState(past);
    expect(statePast.isOverdue).toBe(true);
    expect(statePast.label).toContain("Quá hạn");

    const future = new Date(Date.now() + 86400000 * 5).toISOString();
    const stateFuture = calcDeadlineState(future);
    expect(stateFuture.isOverdue).toBe(false);
    expect(stateFuture.label).toContain("Còn");
  });
});
