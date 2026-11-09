import type { User } from "@/types";

export const PREDEFINED_USERS: User[] = [
  {
    id: "usr_admin_ptit",
    email: "admin@ptit.edu.vn",
    name: "Lớp trưởng PTIT (Admin)",
    role: "admin",
    studentId: "B23DCCC001",
    class: "RIPT1411-20261-02",
  },
  {
    id: "usr_student_ptit",
    email: "sv@ptit.edu.vn",
    name: "Nguyễn Tiến Tuấn (Sinh viên)",
    role: "user",
    studentId: "B23DCCC173",
    class: "RIPT1411-20261-02",
  },
  {
    id: "usr_demo_admin",
    email: "admin@devworkspace.local",
    name: "Quản trị viên Demo",
    role: "admin",
    studentId: "ADMIN_DEMO",
    class: "RIPT1411-20261-02",
  },
  {
    id: "usr_demo_user",
    email: "user@devworkspace.local",
    name: "Sinh viên Demo",
    role: "user",
    studentId: "B23DCCC173",
    class: "RIPT1411-20261-02",
  },
];

export function findUserByEmail(email: string): User | null {
  const normalized = email.toLowerCase().trim();
  return PREDEFINED_USERS.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function verifyCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  if (!user) return null;

  // Strict check according to PTIT Lab 3 rubric
  if (user.email === "admin@ptit.edu.vn" && password === "admin123") return user;
  if (user.email === "sv@ptit.edu.vn" && password === "sv123456") return user;
  if (user.email === "admin@devworkspace.local" && password === "Demo@12345") return user;
  if (user.email === "user@devworkspace.local" && password === "Demo@12345") return user;

  return null;
}
