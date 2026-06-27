// Purpose: Render the SaveFlow dashboard overview.
// Callers: Next.js App Router dashboard route.
// Deps: React, MediaCard, and demo media records.
// API: DashboardPage route component.
// Side effects: None.
import React from "react";
import { MediaCard } from "@/components/media-card";
import { demoMediaItems } from "@/features/media/demo-data";

const h = React.createElement;

const stats = [
  { label: "Media", value: "2" },
  { label: "Queued jobs", value: "1" },
  { label: "Worker", value: "Offline" }
] as const;

export default function DashboardPage() {
  return h("section", { className: "page-stack" },
    h("header", { className: "page-header" },
      h("div", null,
        h("p", { className: "sf-kicker" }, "SaveFlow Studio"),
        h("h1", { className: "page-title" }, "Studio state"),
        h("p", { className: "page-copy" }, "Track media intake, processing status, and saved outputs from one local-first workspace.")
      )
    ),
    h("div", { className: "stat-grid" }, stats.map((stat) =>
      h("div", { className: "stat-card", key: stat.label },
        h("p", { className: "stat-label" }, stat.label),
        h("p", { className: "stat-value" }, stat.value)
      )
    )),
    h("div", { className: "media-grid" }, demoMediaItems.map((item) => h(MediaCard, { item, key: item.id })))
  );
}
