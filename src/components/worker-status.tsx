// Purpose: Render accessible worker availability indicators.
// Callers: AppShell and status surfaces.
// Deps: React.
// API: WorkerState type and WorkerStatus component.
// Side effects: None.
"use client";

import React from "react";

const h = React.createElement;

export type WorkerState = "online" | "offline" | "busy";

type WorkerStatusProps = {
  compact?: boolean;
  state?: WorkerState;
};

const workerStyles: Record<WorkerState, { dot: string; label: string }> = {
  online: { dot: "bg-green", label: "Worker online" },
  offline: { dot: "bg-muted", label: "Worker offline" },
  busy: { dot: "bg-amber", label: "Worker busy" }
};

export function WorkerStatus({ compact = false, state = "offline" }: WorkerStatusProps) {
  const status = workerStyles[state];

  return h(
    "div",
    {
      "aria-label": status.label,
      className: `worker-status ${compact ? "worker-status-compact" : ""}`.trim()
    },
    h("span", { className: `worker-dot ${status.dot}` }),
    compact ? null : status.label
  );
}
