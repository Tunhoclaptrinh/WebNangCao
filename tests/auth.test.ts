import { verifyCredentials, findUserByEmail, PREDEFINED_USERS } from "@/features/auth/users";

describe("Authentication & RBAC Logic", () => {
  it("should have predefined admin and student accounts", () => {
    expect(PREDEFINED_USERS.length).toBeGreaterThanOrEqual(2);
    const admin = PREDEFINED_USERS.find((u) => u.email === "admin@ptit.edu.vn");
    const student = PREDEFINED_USERS.find((u) => u.email === "sv@ptit.edu.vn");

    expect(admin).toBeDefined();
    expect(admin?.role).toBe("admin");
    expect(student).toBeDefined();
    expect(student?.role).toBe("user");
  });

  it("should find user by email (case-insensitive)", () => {
    const admin = findUserByEmail("ADMIN@PTIT.EDU.VN");
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe("admin");

    const notFound = findUserByEmail("unknown@ptit.edu.vn");
    expect(notFound).toBeNull();
  });

  it("should verify valid admin credentials", () => {
    const user = verifyCredentials("admin@ptit.edu.vn", "admin123");
    expect(user).not.toBeNull();
    expect(user?.role).toBe("admin");
    expect(user?.name).toContain("Lớp trưởng");
  });

  it("should verify valid student credentials", () => {
    const user = verifyCredentials("sv@ptit.edu.vn", "sv123456");
    expect(user).not.toBeNull();
    expect(user?.role).toBe("user");
    expect(user?.studentId).toBe("B23DCCC173");
  });

  it("should reject wrong passwords or non-existent emails", () => {
    const wrongPass = verifyCredentials("admin@ptit.edu.vn", "wrongpass");
    expect(wrongPass).toBeNull();

    const wrongEmail = verifyCredentials("nobody@ptit.edu.vn", "admin123");
    expect(wrongEmail).toBeNull();
  });
});
