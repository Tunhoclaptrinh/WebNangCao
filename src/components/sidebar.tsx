"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Tiến độ học tập",
      href: "/dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: "Toàn bộ Deadline",
      href: "/deadlines",
      icon: <ClockCircleOutlined />,
    },
    {
      label: "Danh mục Môn học",
      href: "/subjects/lap-trinh-web-nang-cao",
      icon: <BookOutlined />,
    },
  ];

  if (userRole === "admin") {
    navItems.push({
      label: "Quản trị Lớp học",
      href: "/admin",
      icon: <SettingOutlined />,
    });
  }

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 shrink-0 rounded-xl shadow-sm mb-6 md:mb-0">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
        Không gian cá nhân
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600 pl-2"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
