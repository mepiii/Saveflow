// Purpose: Verify Firebase environment configuration parsing.
// Callers: Vitest unit suite.
// Deps: Vitest assertions and readFirebaseConfig.
// API: readFirebaseConfig behavior expectations.
// Side effects: None.
import { describe, expect, it } from "vitest";
import { readFirebaseConfig } from "@/lib/env";

const validEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "api-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "saveflow.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "saveflow",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "saveflow.appspot.com",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123",
  NEXT_PUBLIC_FIREBASE_APP_ID: "app-id"
};

describe("readFirebaseConfig", () => {
  it("returns config when all Firebase values exist", () => {
    expect(readFirebaseConfig(validEnv)).toEqual({
      apiKey: "api-key",
      authDomain: "saveflow.firebaseapp.com",
      projectId: "saveflow",
      storageBucket: "saveflow.appspot.com",
      messagingSenderId: "123",
      appId: "app-id"
    });
  });

  it("throws a clear error when a value is missing", () => {
    expect(() => readFirebaseConfig({})).toThrow("Missing Firebase environment variable: NEXT_PUBLIC_FIREBASE_API_KEY");
  });

  it("throws a clear error when a value is blank", () => {
    expect(() => readFirebaseConfig({ ...validEnv, NEXT_PUBLIC_FIREBASE_APP_ID: "   " })).toThrow(
      "Missing Firebase environment variable: NEXT_PUBLIC_FIREBASE_APP_ID"
    );
  });
});
