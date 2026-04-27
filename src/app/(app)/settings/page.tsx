// Purpose: Render SaveFlow settings and worker setup guidance.
// Callers: Next.js App Router settings route.
// Deps: React.
// API: SettingsPage route component.
// Side effects: None.
import React from "react";

const h = React.createElement;

export default function SettingsPage() {
  return h("section", { className: "page-stack" },
    h("header", { className: "page-header" },
      h("div", null,
        h("p", { className: "sf-kicker" }, "Settings"),
        h("h1", { className: "page-title" }, "Studio setup"),
        h("p", { className: "page-copy" }, "Connect providers, workers, and storage only when the workflow needs persistence or heavy processing.")
      )
    ),
    h("div", { className: "settings-grid" },
      h("section", { className: "settings-card" },
        h("p", { className: "card-label" }, "Provider"),
        h("h2", { className: "card-title" }, "AI provider"),
        h("p", { className: "page-copy" }, "Add Gemini, OpenAI, or local model keys before running transcript and summary exports."),
        h("button", { className: "sf-button-secondary", style: { marginTop: "1.25rem" }, type: "button" }, "Configure provider")
      ),
      h("section", { className: "settings-card" },
        h("p", { className: "card-label" }, "Worker"),
        h("h2", { className: "card-title" }, "Local worker"),
        h("p", { className: "page-copy" }, "Run the worker beside the app to process queued media on CPU or GPU."),
        h("code", { className: "output-list", style: { display: "block", marginTop: "1.25rem" } }, "uv run saveflow-worker")
      )
    )
  );
}
