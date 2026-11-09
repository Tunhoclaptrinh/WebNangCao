import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/login-form";
jest.mock("@/features/auth/actions", () => ({
  loginWithCredentials: jest.fn(),
  loginWithGithub: jest.fn(),
}));
test("login has email/password labels and appropriate autocomplete", () => {
  render(<LoginForm callbackUrl="/dashboard" githubReady oauthError={false} />);
  expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  expect(screen.getByLabelText("Mật khẩu")).toHaveAttribute(
    "autocomplete",
    "current-password",
  );
  expect(
    screen.getByRole("button", { name: /Đăng nhập với GitHub/ }),
  ).toBeEnabled();
});
test("GitHub cannot silently fake login without configured credentials", () => {
  render(
    <LoginForm
      callbackUrl="/dashboard"
      githubReady={false}
      oauthError={false}
    />,
  );
  expect(
    screen.getByRole("button", { name: /Đăng nhập với GitHub/ }),
  ).toBeDisabled();
  expect(screen.getByText(/GitHub chưa được cấu hình/)).toBeInTheDocument();
});
test("user can enter credentials without revealing password by default", async () => {
  const user = userEvent.setup();
  render(<LoginForm callbackUrl="/dashboard" githubReady oauthError={false} />);
  await user.type(screen.getByLabelText("Email"), "user@example.com");
  await user.type(screen.getByLabelText("Mật khẩu"), "Demo@12345");
  expect(screen.getByLabelText("Email")).toHaveValue("user@example.com");
  expect(screen.getByLabelText("Mật khẩu")).toHaveAttribute("type", "password");
});
test("OAuth failure is visible as an accessible alert", () => {
  render(<LoginForm callbackUrl="/dashboard" githubReady oauthError />);
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Không thể đăng nhập GitHub",
  );
});
