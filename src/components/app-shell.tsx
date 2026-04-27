// Purpose: Render the SaveFlow navigation shell with optional Firebase auth.
// Callers: App route layout.
// Deps: React, next/link, worker status, app route constants, and Firebase auth state.
// API: AppShell component wrapping app route content.
// Side effects: Starts Google sign-in or signs out the current Firebase user on request.
"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import { WorkerStatus } from "@/components/worker-status";
import { useAuth } from "@/features/auth/use-auth";
import { appRoutes } from "@/lib/routes";

const h = React.createElement;
const navigationItems = [
  { label: "Dashboard", href: appRoutes.dashboard },
  { label: "Upload", href: appRoutes.upload },
  { label: "Library", href: appRoutes.library },
  { label: "Settings", href: appRoutes.settings }
] as const;

function NavLinks() {
  return navigationItems.map((item) =>
    h(Link, { className: "app-nav-link", href: item.href, key: item.href }, item.label)
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { signInWithGoogle, signOutUser, status, user } = useAuth();
  const displayName = user?.displayName ?? user?.email ?? "Guest mode";
  const authLabel = user ? "Signed in as" : status === "loading" ? "Checking session" : "Guest workspace";
  const authAction = user
    ? { label: "Sign out", onClick: () => void signOutUser() }
    : { label: "Sign in to save", onClick: () => void signInWithGoogle() };

  return h(
    "div",
    { className: "app-layout" },
    h(
      "aside",
      { className: "app-sidebar" },
      h(Link, { className: "app-logo", href: appRoutes.dashboard }, "SaveFlow"),
      h("nav", { className: "app-nav", "aria-label": "Primary navigation" }, h(NavLinks)),
      h("div", { className: "app-sidebar-bottom" },
        h(WorkerStatus),
        h("div", { className: "auth-panel" },
          h("p", { className: "auth-label" }, authLabel),
          h("p", { className: "auth-name" }, displayName),
          user ? null : h("p", { className: "auth-note" }, "Use tools now. Sign in only when cloud history matters.")
        ),
        h("button", { className: user ? "sf-button-secondary" : "sf-button", onClick: authAction.onClick, type: "button" }, authAction.label)
      )
    ),
    h("header", { className: "mobile-header" },
      h(Link, { className: "app-logo", href: appRoutes.dashboard }, "SaveFlow"),
      h(WorkerStatus, { compact: true }),
      h("button", { className: user ? "sf-button-secondary" : "sf-button", onClick: authAction.onClick, type: "button" }, user ? "Sign out" : "Sign in")
    ),
    h("main", { className: "app-main" }, children),
    h("nav", { className: "mobile-nav", "aria-label": "Mobile navigation" }, h(NavLinks))
  );
}
