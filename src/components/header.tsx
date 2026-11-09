import React from "react";
import Link from "next/link";
import { getCurrentActor } from "@/features/auth/guards";
import { signOut } from "@/auth";
import {
  CalendarIcon,
  BookIcon,
  DashboardIcon,
  SettingIcon,
  LogoutIcon,
  LoginIcon,
} from "@/components/icons";

export async function Header() {
  const actor = await getCurrentActor();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:bg-blue-700 transition">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition">
              Class Deadline Hub
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              RIPT1411-20261-02 · PTIT
            </div>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition flex items-center gap-1.5">
            Trang chủ
          </Link>
          <Link href="/deadlines" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            Tất cả Deadline
          </Link>
          <Link href="/subjects/lap-trinh-web-nang-cao" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <BookIcon className="w-4 h-4 text-slate-400" />
            Lập trình Web NC
          </Link>

          {actor && (
            <>
              <Link href="/dashboard" className="text-blue-600 font-semibold flex items-center gap-1.5">
                <DashboardIcon className="w-4 h-4" />
                Tiến độ của tôi
              </Link>
              {actor.role === "admin" && (
                <Link href="/admin" className="text-purple-600 font-semibold flex items-center gap-1.5">
                  <SettingIcon className="w-4 h-4" />
                  Quản trị
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User Account / Auth Actions */}
        <div className="flex items-center gap-3">
          {actor ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-semibold text-slate-800">{actor.name}</span>
                <span className="text-slate-500">{actor.email}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  actor.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                {actor.role === "admin" ? "Lớp trưởng" : "Sinh viên"}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md border border-slate-200 transition flex items-center gap-1"
                >
                  <LogoutIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <LoginIcon className="w-4 h-4" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
