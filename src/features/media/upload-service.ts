// Purpose: Persist uploaded media files and queue metadata in Firebase.
// Callers: UploadForm and upload unit tests.
// Deps: Firebase Firestore/Storage client SDKs and Firebase auth state.
// API: uploadMediaFile(input) returns stored media and job identifiers.
// Side effects: Uploads file bytes to Storage and writes Firestore documents.
import { collection, doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { ref, uploadBytes } from "@firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/features/auth/firebase";
import type { User } from "@/features/auth/firebase";
import type { MediaItem, MediaType } from "@/features/media/types";

export type UploadMediaInput = {
  file: File;
  user: User;
};

export type UploadMediaResult = {
  item: MediaItem;
  jobId: string;
};

const mediaTypeFromMime = (mimeType: string): MediaType => {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "image";
};

const safeFileName = (fileName: string) => fileName.replace(/[^a-zA-Z0-9._-]/g, "-");

export async function uploadMediaFile({ file, user }: UploadMediaInput): Promise<UploadMediaResult> {
  const db = getFirebaseDb();
  const storage = getFirebaseStorage();
  const mediaRef = doc(collection(db, "users", user.uid, "media"));
  const jobRef = doc(collection(db, "users", user.uid, "jobs"));
  const storagePath = `users/${user.uid}/media/${mediaRef.id}/${safeFileName(file.name)}`;
  const item: MediaItem = {
    id: mediaRef.id,
    title: file.name,
    mediaType: mediaTypeFromMime(file.type),
    status: "queued",
    duration: 0,
    size: file.size,
    createdAt: new Date().toISOString(),
    tags: [],
    completedStages: ["uploaded"]
  };

  await uploadBytes(ref(storage, storagePath), file, { contentType: file.type || "application/octet-stream" });
  await setDoc(mediaRef, { ...item, storagePath, ownerId: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await setDoc(jobRef, {
    mediaId: mediaRef.id,
    ownerId: user.uid,
    status: "queued",
    stages: item.completedStages,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return { item, jobId: jobRef.id };
}
