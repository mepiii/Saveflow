// Purpose: Define shared media domain primitives.
// Callers: Media feature UI, demo data, and pipeline workflows.
// Deps: None.
// API: MediaStatus, MediaType, PipelineStage, MediaItem.
// Side effects: None.
export type MediaStatus = "uploaded" | "queued" | "processing" | "complete" | "failed";

export type MediaType = "video" | "audio" | "image";

export type PipelineStage = "uploaded" | "converted" | "transcribed" | "summarized" | "exported";

export type MediaItem = {
  id: string;
  title: string;
  mediaType: MediaType;
  status: MediaStatus;
  duration: number;
  size: number;
  createdAt: string;
  tags: string[];
  completedStages: PipelineStage[];
};
