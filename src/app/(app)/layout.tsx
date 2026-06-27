// Purpose: Wrap app routes with optional Firebase auth and the SaveFlow shell.
// Callers: Next.js App Router for the app route group.
// Deps: React, AuthProvider, AppShell, and React node types.
// API: AppLayout route group layout.
// Side effects: Mounts Firebase auth listener through AuthProvider.
import React, { type ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/features/auth/use-auth";

const h = React.createElement;

export default function AppLayout({ children }: { children: ReactNode }) {
  return h(AuthProvider, null, h(AppShell, null, children));
}
