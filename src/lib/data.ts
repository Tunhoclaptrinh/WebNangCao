import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Subject, Deadline, DeadlineFilterOptions, DeadlineStats } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBJECTS_FILE = path.join(DATA_DIR, "subjects.json");
const DEADLINES_FILE = path.join(DATA_DIR, "deadlines.json");
const COMPLETIONS_FILE = path.join(DATA_DIR, "user-completions.json");

// In-memory fallback caches if filesystem is read-only
let memorySubjects: Subject[] | null = null;
let memoryDeadlines: Deadline[] | null = null;
let memoryCompletions: Record<string, string[]> | null = null;

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  try {
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tempPath, filePath);
  } catch (error) {
    // If running in strict read-only serverless environment
    console.warn("Filesystem write skipped or failed in serverless, falling back to memory:", error);
  }
}

export async function getSubjects(): Promise<Subject[]> {
  if (memorySubjects) return memorySubjects;
  const list = await readJson<Subject[]>(SUBJECTS_FILE, []);
  memorySubjects = list;
  return list;
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug) || null;
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.id === id) || null;
}

export async function getDeadlines(filter?: DeadlineFilterOptions): Promise<Deadline[]> {
  const list = memoryDeadlines || (await readJson<Deadline[]>(DEADLINES_FILE, []));
  memoryDeadlines = list;

  if (!filter) return list;

  const now = new Date();

  return list.filter((item) => {
    // Subject filter
    if (filter.subject && filter.subject !== "all" && item.subjectSlug !== filter.subject && item.subjectId !== filter.subject) {
      return false;
    }

    // Priority filter
    if (filter.priority && filter.priority !== "all" && item.priority !== filter.priority) {
      return false;
    }

    // Search query
    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSubject = item.subjectName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSubject) return false;
    }

    // Status filter
    if (filter.statusFilter && filter.statusFilter !== "all") {
      const due = new Date(item.dueDate);
      const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (filter.statusFilter === "overdue" && diffDays >= 0) return false;
      if (filter.statusFilter === "urgent" && (diffDays < 0 || diffDays > 3)) return false;
      if (filter.statusFilter === "upcoming" && diffDays <= 3) return false;
    }

    return true;
  });
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const deadlines = await getDeadlines();
  return deadlines.find((d) => d.id === id) || null;
}

export async function createDeadline(deadlineData: Omit<Deadline, "id">): Promise<Deadline> {
  const deadlines = await getDeadlines();
  const newId = `dl_${Date.now()}`;
  const newDeadline: Deadline = {
    ...deadlineData,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [newDeadline, ...deadlines];
  memoryDeadlines = updatedList;
  await writeJson(DEADLINES_FILE, updatedList);

  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await getDeadlines();
  const filtered = deadlines.filter((d) => d.id !== id);
  if (filtered.length === deadlines.length) return false;

  memoryDeadlines = filtered;
  await writeJson(DEADLINES_FILE, filtered);

  return true;
}

export async function getUserCompletions(userEmail: string): Promise<string[]> {
  const map = memoryCompletions || (await readJson<Record<string, string[]>>(COMPLETIONS_FILE, {}));
  memoryCompletions = map;
  return map[userEmail] || [];
}

export async function toggleUserCompletion(userEmail: string, deadlineId: string): Promise<boolean> {
  const map = memoryCompletions || (await readJson<Record<string, string[]>>(COMPLETIONS_FILE, {}));
  const userList = map[userEmail] || [];
  const exists = userList.includes(deadlineId);

  const updatedList = exists ? userList.filter((id) => id !== deadlineId) : [...userList, deadlineId];

  map[userEmail] = updatedList;
  memoryCompletions = map;
  await writeJson(COMPLETIONS_FILE, map);

  return !exists; // true if now completed, false if unmarked
}

export function calcDeadlineState(dueDate: string) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      isOverdue: true,
      isUrgent: false,
      isUpcoming: false,
      daysLeft: 0,
      hoursLeft: 0,
      label: overdueDays === 0 ? "Hôm nay hết hạn" : `Quá hạn ${overdueDays} ngày`,
      tagColor: "error" as const,
    };
  }

  if (diffDays <= 3) {
    return {
      isOverdue: false,
      isUrgent: true,
      isUpcoming: false,
      daysLeft: diffDays,
      hoursLeft: diffHours,
      label: diffDays === 0 ? `Hôm nay (${diffHours}h nữa)` : `Còn ${diffDays} ngày (${diffHours}h)`,
      tagColor: "warning" as const,
    };
  }

  return {
    isOverdue: false,
    isUrgent: false,
    isUpcoming: true,
    daysLeft: diffDays,
    hoursLeft: diffHours,
    label: `Còn ${diffDays} ngày`,
    tagColor: "processing" as const,
  };
}

export function calculateStats(deadlines: Deadline[], completedIds: string[] = []): DeadlineStats {
  const now = new Date();
  let urgent = 0;
  let upcoming = 0;
  let overdue = 0;

  for (const d of deadlines) {
    const due = new Date(d.dueDate);
    const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) {
      overdue++;
    } else if (diffDays <= 3) {
      urgent++;
    } else {
      upcoming++;
    }
  }

  const uniqueSubjects = new Set(deadlines.map((d) => d.subjectId));

  return {
    total: deadlines.length,
    urgent,
    upcoming,
    overdue,
    completed: completedIds.length,
    subjectsCount: uniqueSubjects.size,
  };
}
