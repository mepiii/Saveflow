// Purpose: Render upload intake and processing status rails.
// Callers: Next.js App Router upload route.
// Deps: React, UploadForm, and PipelineStrip.
// API: UploadPage route component.
// Side effects: Renders client upload flow that can persist media to Firebase.
import React from "react";
import { PipelineStrip } from "@/components/pipeline-strip";
import { UploadForm } from "@/components/upload-form";

const h = React.createElement;

export default function UploadPage() {
  return h("section", { className: "page-stack" },
    h("header", { className: "page-header" },
      h("div", null,
        h("p", { className: "sf-kicker" }, "Upload"),
        h("h1", { className: "page-title" }, "Intake bay"),
        h("p", { className: "page-copy" }, "Drop media into a guest session or sign in first to save history to Firebase.")
      )
    ),
    h("div", { className: "upload-grid" },
      h(UploadForm),
      h("aside", { className: "processing-card" },
        h("p", { className: "card-label" }, "Processing rail"),
        h("h2", { className: "card-title" }, "Worker standby"),
        h("p", { className: "page-copy" }, "Local worker offline. New jobs wait safely until processing is available."),
        h("div", { style: { marginTop: "1.5rem" } }, h(PipelineStrip, { completedStages: ["uploaded"] }))
      )
    )
  );
}
