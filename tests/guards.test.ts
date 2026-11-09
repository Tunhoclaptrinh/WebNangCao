import { getCurrentActor, requireUserActor, requireAdminActor } from "@/features/auth/guards";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Auth Guards & Session Actors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when no session is present", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const actor = await getCurrentActor();
    expect(actor).toBeNull();
  });

  it("returns actor with student info when authenticated as user", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: "usr_sv",
        name: "Nguyễn Tiến Tuấn",
        email: "sv@ptit.edu.vn",
        role: "user",
        studentId: "B23DCCC173",
      },
    });

    const actor = await getCurrentActor();
    expect(actor?.name).toBe("Nguyễn Tiến Tuấn");
    expect(actor?.role).toBe("user");
    expect(actor?.studentId).toBe("B23DCCC173");
  });

  it("redirects unauthenticated user to login when requireUserActor is called", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    await requireUserActor();
    expect(redirect).toHaveBeenCalledWith("/login?callbackUrl=/dashboard");
  });

  it("redirects student to 403 when requireAdminActor is called", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: "usr_sv",
        name: "Nguyễn Tiến Tuấn",
        email: "sv@ptit.edu.vn",
        role: "user",
      },
    });

    await requireAdminActor();
    expect(redirect).toHaveBeenCalledWith("/403");
  });

  it("allows admin actor through requireAdminActor", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: "usr_admin",
        name: "Lớp trưởng PTIT",
        email: "admin@ptit.edu.vn",
        role: "admin",
      },
    });

    const actor = await requireAdminActor();
    expect(actor.role).toBe("admin");
    expect(redirect).not.toHaveBeenCalled();
  });
});

