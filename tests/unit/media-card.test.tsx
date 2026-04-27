// Purpose: Verify media card link and status rendering.
// Callers: Vitest unit suite.
// Deps: React Testing Library, Vitest, MediaCard component, and media fixture data.
// API: MediaCard accessibility assertions.
// Side effects: Renders component in jsdom.
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaCard } from "@/components/media-card";
import type { MediaItem } from "@/features/media/types";

const h = React.createElement;

const demoItem: MediaItem = {
  id: "media-1",
  title: "Demo clip",
  mediaType: "video",
  status: "complete",
  duration: 64,
  size: 12_000_000,
  createdAt: "2026-04-20T14:30:00.000Z",
  tags: ["demo"],
  completedStages: ["uploaded", "converted", "transcribed", "summarized", "exported"]
};

describe("MediaCard", () => {
  it("links to the media detail and shows status", () => {
    render(h(MediaCard, { item: demoItem }));

    const link = screen.getByRole("link", { name: /open demo clip/i });
    expect(link).toHaveAttribute("href", "/media/media-1");
    expect(screen.getByText("complete")).toBeInTheDocument();
  });
});
