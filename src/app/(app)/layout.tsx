import React from "react";
import { requireUserActor } from "@/features/auth/guards";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/components/providers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireUserActor();

  return (
    <Providers>
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <Sidebar userRole={actor.role} />
          <div className="flex-1 w-full min-w-0">{children}</div>
        </div>
      </div>
    </Providers>
  );
}
