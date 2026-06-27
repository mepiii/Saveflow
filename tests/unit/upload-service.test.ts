// Purpose: Verify Firebase upload persistence maps files to media and jobs.
// Callers: Vitest unit suite.
// Deps: Vitest, uploadMediaFile, and mocked Firebase SDK boundaries.
// API: uploadMediaFile tests.
// Side effects: None; Firebase calls are mocked.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { uploadMediaFile } from "@/features/media/upload-service";

const state = vi.hoisted(() => ({
  setDoc: vi.fn(),
  uploadBytes: vi.fn(),
  ids: ["media-1", "job-1"],
  calls: 0
}));

vi.mock("@firebase/firestore", () => ({
  collection: vi.fn((_db, ...path: string[]) => ({ path })),
  doc: vi.fn(() => ({ id: state.ids[state.calls++] })),
  serverTimestamp: vi.fn(() => "server-time"),
  setDoc: state.setDoc
}));

vi.mock("@firebase/storage", () => ({
  ref: vi.fn((_storage, path: string) => ({ path })),
  uploadBytes: state.uploadBytes
}));

vi.mock("@/features/auth/firebase", () => ({
  getFirebaseDb: vi.fn(() => ({ app: "db" })),
  getFirebaseStorage: vi.fn(() => ({ app: "storage" }))
}));

describe("uploadMediaFile", () => {
  beforeEach(() => {
    state.calls = 0;
    state.setDoc.mockReset();
    state.uploadBytes.mockReset();
  });

  it("uploads bytes and queues Firestore records", async () => {
    const file = new File(["clip"], "demo clip.mp4", { type: "video/mp4" });
    const result = await uploadMediaFile({ file, user: { uid: "user-1" } as never });

    expect(result.item).toMatchObject({ id: "media-1", mediaType: "video", status: "queued", title: "demo clip.mp4" });
    expect(result.jobId).toBe("job-1");
    expect(state.uploadBytes).toHaveBeenCalledWith(
      { path: "users/user-1/media/media-1/demo-clip.mp4" },
      file,
      { contentType: "video/mp4" }
    );
    expect(state.setDoc).toHaveBeenCalledTimes(2);
  });
});
