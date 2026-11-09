/** @jest-environment node */
import { AuthError } from "next-auth";
import { signIn, signOut, githubConfigured } from "@/auth";
import {
  loginWithCredentials,
  loginWithGithub,
  logout,
} from "@/features/auth/actions";
jest.mock("next-auth", () => ({ AuthError: class AuthError extends Error {} }));
jest.mock("@/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  githubConfigured: true,
}));
const signin = jest.mocked(signIn);
function form(
  email = "user@example.com",
  password = "Demo@12345",
  callback = "/dashboard",
) {
  const data = new FormData();
  data.set("email", email);
  data.set("password", password);
  data.set("callbackUrl", callback);
  return data;
}
beforeEach(() => jest.resetAllMocks());
test("bad login input fails before provider call", async () => {
  expect(await loginWithCredentials({}, form("bad", "short"))).toHaveProperty(
    "error",
  );
  expect(signin).not.toHaveBeenCalled();
});
test("valid input calls credentials and sanitizes external redirect", async () => {
  await loginWithCredentials(
    {},
    form("USER@EXAMPLE.COM", "Demo@12345", "https://evil.example"),
  );
  expect(signin).toHaveBeenCalledWith("credentials", {
    email: "user@example.com",
    password: "Demo@12345",
    redirectTo: "/dashboard",
  });
});
test("authentication failure yields a useful generic error", async () => {
  signin.mockRejectedValue(new AuthError());
  expect(await loginWithCredentials({}, form())).toMatchObject({
    error: expect.stringContaining("Email hoặc mật khẩu không đúng"),
  });
});
test("framework redirect/errors must propagate rather than be swallowed", async () => {
  signin.mockRejectedValue(new Error("NEXT_REDIRECT"));
  await expect(loginWithCredentials({}, form())).rejects.toThrow(
    "NEXT_REDIRECT",
  );
});
test("GitHub sign in requests the actual OAuth provider", async () => {
  expect(githubConfigured).toBe(true);
  await loginWithGithub(form());
  expect(signin).toHaveBeenCalledWith("github", { redirectTo: "/dashboard" });
});
test("logout clears auth session through NextAuth", async () => {
  await logout();
  expect(signOut).toHaveBeenCalledWith({ redirectTo: "/login" });
});
