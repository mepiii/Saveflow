// Purpose: Render media detail previews and output actions.
// Callers: Next.js App Router media detail route.
// Deps: React, PipelineStrip, and demo media records.
// API: MediaDetailPage route component with mediaId param.
// Side effects: None.
import React from "react";
import { PipelineStrip } from "@/components/pipeline-strip";
import { demoMediaItems } from "@/features/media/demo-data";

const h = React.createElement;

export default async function MediaDetailPage({ params }: { params: Promise<{ mediaId: string }> }) {
  const { mediaId } = await params;
  const item = demoMediaItems.find((media) => media.id === mediaId) ?? demoMediaItems[0];
  const metadata = [`ID ${mediaId}`, `Type ${item.mediaType}`, `Status ${item.status}`];

  return h("section", { className: "page-stack" },
    h("header", { className: "page-header" },
      h("div", null,
        h("p", { className: "sf-kicker" }, "Preview"),
        h("h1", { className: "page-title" }, item.title),
        h("p", { className: "page-copy" }, "Inspect media state, generated outputs, and pipeline progress before export.")
      )
    ),
    h("div", { className: "detail-grid" },
      h("div", { className: "page-stack" },
        h("section", { className: "detail-card" },
          h("p", { className: "card-label" }, "Media"),
          h("div", { className: "preview-box" }, "Media preview area")
        ),
        h("section", { className: "detail-card" }, h(PipelineStrip, { completedStages: item.completedStages }))
      ),
      h("aside", { className: "page-stack" },
        h("section", { className: "detail-card" },
          h("p", { className: "card-label" }, "Metadata"),
          h("ul", { className: "metadata-list" }, metadata.map((entry) => h("li", { key: entry }, entry)))
        ),
        h("section", { className: "detail-card" },
          h("p", { className: "card-label" }, "Outputs"),
          h("div", { className: "output-list" }, ["Download transcript", "Export summary", "Create share link"].map((label) =>
            h("button", { key: label, type: "button" }, label)
          ))
        )
      )
    )
  );
}
