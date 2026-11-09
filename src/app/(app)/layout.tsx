import React from "react";
import { requireUserActor } from "@/features/auth/guards";
import { Providers } from "@/components/providers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUserActor();

  return (
    <Providers>
      {children}
    </Providers>
  );
}
