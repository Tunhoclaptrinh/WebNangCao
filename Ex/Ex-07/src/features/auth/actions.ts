"use server";
import { AuthError } from "next-auth";
import { signIn, signOut, githubConfigured } from "@/auth";
import { credentialsSchema } from "./validation";
import { safeRedirect } from "@/lib/site";
export interface LoginState {
  error?: string;
}
export async function loginWithCredentials(
  _previous: LoginState,
  form: FormData,
): Promise<LoginState> {
  const parsed = credentialsSchema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });
  if (!parsed.success)
    return { error: "Vui lòng nhập email hợp lệ và mật khẩu từ 8 ký tự." };
  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeRedirect(form.get("callbackUrl")),
    });
  } catch (error) {
    if (error instanceof AuthError)
      return {
        error:
          "Email hoặc mật khẩu không đúng, hoặc đã thử quá nhiều lần. Vui lòng thử lại sau.",
      };
    throw error;
  }
  return {};
}
export async function loginWithGithub(form: FormData) {
  if (!githubConfigured) return;
  await signIn("github", { redirectTo: safeRedirect(form.get("callbackUrl")) });
}
export async function logout() {
  await signOut({ redirectTo: "/login" });
}
