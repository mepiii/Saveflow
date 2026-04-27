// Purpose: Provide sample media records for initial SaveFlow screens.
// Callers: Media feature demos and development placeholders.
// Deps: MediaItem type definitions.
// API: demoMediaItems seed array.
// Side effects: None.
import type { MediaItem } from "./types";

export const demoMediaItems: MediaItem[] = [
  {
    id: "media-demo-1",
    title: "Portfolio clip",
    mediaType: "video",
    status: "complete",
    duration: 96,
    size: 48_000_000,
    createdAt: "2026-04-20T14:30:00.000Z",
    tags: ["portfolio", "short-form"],
    completedStages: ["uploaded", "converted", "transcribed", "summarized", "exported"]
  },
  {
    id: "media-demo-2",
    title: "Lecture audio",
    mediaType: "audio",
    status: "processing",
    duration: 3_420,
    size: 86_000_000,
    createdAt: "2026-04-22T09:15:00.000Z",
    tags: ["lecture", "education"],
    completedStages: ["uploaded", "converted"]
  }
];
