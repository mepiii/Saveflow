// Purpose: Render a Studio OS media summary card.
// Callers: Dashboard, library, media detail previews, and unit tests.
// Deps: React, Next Link, MediaItem, and PipelineStrip.
// API: MediaCard component with item input.
// Side effects: None.
import React from "react";
import Link from "next/link";
import { PipelineStrip } from "@/components/pipeline-strip";
import type { MediaItem } from "@/features/media/types";
import { mediaRoute } from "@/lib/routes";

const h = React.createElement;

const formatSeconds = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const formatBytes = (bytes: number) => `${Math.round(bytes / 1_000_000)} MB`;

export function MediaCard({ item }: { item: MediaItem }) {
  return h(
    Link,
    {
      "aria-label": `Open ${item.title}`,
      className: "media-card",
      href: mediaRoute(item.id)
    },
    h("div", { className: "media-card-head" },
      h("div", null,
        h("p", { className: "card-label" }, item.mediaType),
        h("h2", { className: "media-card-title" }, item.title)
      ),
      h("span", { className: "status-chip" }, item.status)
    ),
    h("dl", { className: "media-meta" },
      h("div", null, h("dt", null, "Duration"), h("dd", null, formatSeconds(item.duration))),
      h("div", null, h("dt", null, "Size"), h("dd", null, formatBytes(item.size)))
    ),
    h(PipelineStrip, { completedStages: item.completedStages })
  );
}
