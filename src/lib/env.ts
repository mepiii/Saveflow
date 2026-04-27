// Purpose: Read Firebase client configuration from environment values.
// Callers: Firebase app initialization and env unit tests.
// Deps: Node-compatible process.env shape.
// API: readFirebaseConfig(env?) returns FirebaseConfig.
// Side effects: Throws when required values are absent.
export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

type FirebaseEnv = Record<string, string | undefined>;

const readRequired = (env: FirebaseEnv, key: string) => {
  const value = env[key]?.trim();
  if (!value) throw new Error(`Missing Firebase environment variable: ${key}`);
  return value;
};

export const readFirebaseConfig = (env: FirebaseEnv = process.env): FirebaseConfig => ({
  apiKey: readRequired(env, "NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: readRequired(env, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: readRequired(env, "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: readRequired(env, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readRequired(env, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readRequired(env, "NEXT_PUBLIC_FIREBASE_APP_ID")
});
