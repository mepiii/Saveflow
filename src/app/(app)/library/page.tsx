// Purpose: Render the SaveFlow media library.
// Callers: Next.js App Router library route.
// Deps: React, MediaCard, and demo media records.
// API: LibraryPage route component.
// Side effects: None.
import React from "react";
import { MediaCard } from "@/components/media-card";
import { demoMediaItems } from "@/features/media/demo-data";

const h = React.createElement;

export default function LibraryPage() {
  return h("section", { className: "page-stack" },
    h("header", { className: "page-header" },
      h("div", null,
        h("p", { className: "sf-kicker" }, "Library"),
        h("h1", { className: "page-title" }, "Media archive"),
        h("p", { className: "page-copy" }, "Saved media appears here after sign-in. Demo records show the finished workspace shape.")
      )
    ),
    h("div", { className: "media-grid" }, demoMediaItems.map((item) => h(MediaCard, { item, key: item.id })))
  );
}
