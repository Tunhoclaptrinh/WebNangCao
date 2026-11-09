import { siteConfig } from "@/lib/site";

describe("Site Configuration", () => {
  it("contains correct PTIT student and course metadata", () => {
    expect(siteConfig.name).toContain("Class Deadline Hub");
    expect(siteConfig.class).toBe("RIPT1411-20261-02");
    expect(siteConfig.student.name).toBe("Nguyễn Tiến Tuấn");
    expect(siteConfig.student.id).toBe("B23DCCC173");
    expect(siteConfig.lecturer).toContain("Ngô Văn Nhận");
  });
});
