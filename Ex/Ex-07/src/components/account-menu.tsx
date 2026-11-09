"use client";
import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";
function AccountStatus() {
  const { data } = useSession();
  if (!data?.user)
    return (
      <Link className="account-link" href="/login">
        Đăng nhập <span aria-hidden="true">↗</span>
      </Link>
    );
  return (
    <Link className="account-link" href="/dashboard">
      <span className="avatar-mini">{data.user.name?.slice(0, 1) || "D"}</span>
      <span>
        {data.user.name?.split(" ").slice(-2).join(" ")}
        <small>
          {data.user.role === "admin" ? "Quản trị viên" : "Thành viên"}
        </small>
      </span>
    </Link>
  );
}
export function AccountMenu() {
  return (
    <SessionProvider refetchOnWindowFocus>
      <AccountStatus />
    </SessionProvider>
  );
}
