import React from "react";
import { requireUserActor } from "@/features/auth/guards";
import { getDeadlines, getUserCompletions } from "@/lib/data";
import { DashboardView } from "@/components/dashboard-view";
import type { Metadata } from "next";

// SSR: Server-Side Rendering
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Tiến Độ Học Tập",
  robots: { index: false, follow: false },
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const actor = await requireUserActor();
  const allDeadlines = await getDeadlines();
  const completedIds = await getUserCompletions(actor.email);

  return (
    <DashboardView
      actor={actor}
      allDeadlines={allDeadlines}
      completedIds={completedIds}
    />
  );
}
