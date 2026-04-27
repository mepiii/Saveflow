// Purpose: Let guests preview media locally and signed-in users save uploads to Firebase.
// Callers: Upload page and unit tests.
// Deps: React, AuthProvider state, uploadMediaFile, and PipelineStrip.
// API: UploadForm component.
// Side effects: Starts Firebase Storage upload and Firestore queue writes after signed-in file selection.
"use client";

import React, { useState, type ChangeEvent } from "react";
import { PipelineStrip } from "@/components/pipeline-strip";
import { useAuth } from "@/features/auth/use-auth";
import { uploadMediaFile } from "@/features/media/upload-service";
import type { MediaItem } from "@/features/media/types";

const h = React.createElement;

const mediaTypeFromMime = (mime: string): MediaItem["mediaType"] =>
  mime.startsWith("audio/") ? "audio" : mime.startsWith("image/") ? "image" : "video";

const localMediaItem = (file: File): MediaItem => ({
  id: `guest-${crypto.randomUUID()}`,
  title: file.name,
  mediaType: mediaTypeFromMime(file.type),
  status: "queued",
  duration: 0,
  size: file.size,
  createdAt: new Date().toISOString(),
  tags: ["guest"],
  completedStages: ["uploaded"]
});

export function UploadForm() {
  const { user } = useAuth();
  const [item, setItem] = useState<MediaItem | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      if (!user) {
        setItem(localMediaItem(file));
        setJobId("guest-local");
        return;
      }

      const result = await uploadMediaFile({ file, user });
      setItem(result.item);
      setJobId(result.jobId);
    } catch {
      setError("Upload failed. Check Firebase project settings and storage rules.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return h(
    "div",
    { className: "upload-card" },
    h("p", { className: "card-label" }, user ? "Cloud upload" : "Guest upload"),
    h("h2", { className: "page-title" }, "Drop media here"),
    h(
      "p",
      { className: "page-copy" },
      user
        ? "Queue video, audio, or image files for conversion, transcription, summaries, and saved history."
        : "Queue a local guest preview now. Sign in only when you want cloud history and recovery."
    ),
    h(
      "label",
      { className: "sf-button" },
      isUploading ? "Uploading" : "Choose file",
      h("input", { disabled: isUploading, onChange: (event) => void handleFileChange(event), type: "file" })
    ),
    error ? h("p", { className: "upload-result", role: "alert" }, error) : null,
    item
      ? h(
          "div",
          { className: "upload-result" },
          h("p", { className: "card-label" }, user ? "Queued" : "Guest preview"),
          h("h3", { className: "media-card-title" }, item.title),
          h("p", { className: "page-copy" }, user ? `Job ${jobId}` : "Local-only session. Sign in before upload when you want saved history."),
          h("div", { style: { marginTop: "1rem" } }, h(PipelineStrip, { completedStages: item.completedStages }))
        )
      : null
  );
}
