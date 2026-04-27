// Purpose: Define stable application route primitives.
// Callers: Navigation components, tests, and feature links.
// Deps: Next typed route definitions.
// API: appRoutes route path constants and mediaRoute helper.
// Side effects: None.
import type { Route } from "next";

export const appRoutes = {
  dashboard: "/dashboard" as Route,
  upload: "/upload" as Route,
  library: "/library" as Route,
  settings: "/settings" as Route
} as const;

export const mediaRoute = (mediaId: string) => `/media/${mediaId}` as Route;
