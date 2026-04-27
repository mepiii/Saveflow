# SaveFlow SaaS Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working SaveFlow SaaS foundation: Next.js app, Firebase Auth, protected dashboard, upload shell, library shell, media detail shell, settings shell, and Studio OS design tokens.

**Architecture:** Create a Next.js App Router project with TypeScript, Tailwind CSS, Firebase client integration, route protection, and focused feature folders. Phase 1 does not implement Python worker or real media processing; it creates the authenticated SaaS surface and data boundaries those later phases use.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Firebase Auth, Firestore, Firebase Storage, Vitest, Testing Library, Playwright.

---

## File Structure

Create this structure:

```text
package.json
next.config.ts
tsconfig.json
postcss.config.mjs
tailwind.config.ts
vitest.config.ts
playwright.config.ts
.env.example
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/(app)/layout.tsx
src/app/(app)/dashboard/page.tsx
src/app/(app)/upload/page.tsx
src/app/(app)/library/page.tsx
src/app/(app)/media/[mediaId]/page.tsx
src/app/(app)/settings/page.tsx
src/components/app-shell.tsx
src/components/auth-gate.tsx
src/components/button.tsx
src/components/media-card.tsx
src/components/pipeline-strip.tsx
src/components/worker-status.tsx
src/features/auth/firebase.ts
src/features/auth/use-auth.tsx
src/features/media/types.ts
src/features/media/demo-data.ts
src/lib/env.ts
src/lib/routes.ts
tests/unit/pipeline-strip.test.tsx
tests/unit/media-card.test.tsx
tests/unit/env.test.ts
tests/e2e/navigation.spec.ts
```

Responsibilities:

- `src/app/*`: route pages and route-specific composition.
- `src/components/*`: reusable UI primitives and app shell components.
- `src/features/auth/*`: Firebase initialization and auth context.
- `src/features/media/*`: media types and demo records until Firestore queries land.
- `src/lib/*`: typed environment and route constants.
- `tests/*`: unit and browser coverage for phase 1 behavior.

---

### Task 1: Create Next.js Project Skeleton

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`

- [ ] **Step 1: Create package manifest**

Create `package.json`:

```json
{
  "name": "saveflow",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@firebase/app": "latest",
    "@firebase/auth": "latest",
    "@firebase/firestore": "latest",
    "@firebase/storage": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "lucide-react": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "jsdom": "latest",
    "postcss": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Create config files**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      colors: {
        workspace: "oklch(var(--workspace) / <alpha-value>)",
        panel: "oklch(var(--panel) / <alpha-value>)",
        ink: "oklch(var(--ink) / <alpha-value>)",
        muted: "oklch(var(--muted) / <alpha-value>)",
        line: "oklch(var(--line) / <alpha-value>)",
        amber: "oklch(var(--amber) / <alpha-value>)",
        green: "oklch(var(--green) / <alpha-value>)",
        red: "oklch(var(--red) / <alpha-value>)"
      }
    }
  },
  plugins: []
};

export default config;
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["@testing-library/jest-dom/vitest"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
```

Create `.env.example`:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` created and no install errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts vitest.config.ts playwright.config.ts .env.example
git commit -m "chore: scaffold SaveFlow web app"
```

---

### Task 2: Add Studio OS Design Tokens and Landing Page

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Test: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Write e2e test for landing page**

Create `tests/e2e/navigation.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("landing page presents SaveFlow and app entry", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /turn media into searchable/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /open studio/i })).toHaveAttribute("href", "/dashboard");
  await expect(page.getByText(/upload → process → export/i)).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test:e2e -- tests/e2e/navigation.spec.ts
```

Expected: FAIL because app files do not exist.

- [ ] **Step 3: Create root layout and styles**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaveFlow",
  description: "Save media, convert formats, and understand content with AI."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --workspace: 18% 0.018 255;
  --panel: 24% 0.018 255;
  --ink: 92% 0.014 82;
  --muted: 68% 0.018 248;
  --line: 34% 0.018 255;
  --amber: 78% 0.14 72;
  --green: 74% 0.12 154;
  --red: 67% 0.15 28;
  --font-display: "Azeret Mono", "Arial Narrow", sans-serif;
  --font-body: "Geist", "Segoe UI", sans-serif;
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 0.75rem;
  --space-lg: 1rem;
  --space-xl: 1.5rem;
  --space-2xl: 2rem;
  --space-3xl: 3rem;
  --space-4xl: 4rem;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: oklch(var(--workspace));
  color: oklch(var(--ink));
  font-family: var(--font-body);
}

a {
  color: inherit;
  text-decoration: none;
}

:focus-visible {
  outline: 2px solid oklch(var(--amber));
  outline-offset: 3px;
}
```

- [ ] **Step 4: Create landing page**

Create `src/app/page.tsx`:

```tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-workspace text-ink">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <div className="max-w-3xl">
          <p className="font-display text-sm uppercase tracking-[0.32em] text-amber">SaveFlow Studio OS</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-[-0.08em]">
            Turn media into searchable intelligence.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-8 text-muted">
            Upload video or audio, convert formats, generate transcripts, create subtitles, summarize content, and export the results from one focused media workspace.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link className="rounded-full bg-amber px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-workspace" href="/dashboard">
              Open Studio
            </Link>
            <a className="rounded-full border border-line px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-ink" href="#workflow">
              View Flow
            </a>
          </div>
        </div>

        <div id="workflow" className="rounded-[2rem] border border-line bg-panel p-5 shadow-2xl shadow-black/30">
          <div className="grid gap-3">
            {[
              "Upload media",
              "Convert formats",
              "Transcribe audio",
              "Summarize and tag",
              "Export outputs"
            ].map((step, index) => (
              <div key={step} className="flex items-center justify-between rounded-2xl border border-line bg-workspace/70 px-5 py-4">
                <span className="font-display text-xs text-muted">0{index + 1}</span>
                <span className="font-display text-sm font-bold uppercase tracking-[0.16em]">{step}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-muted">Upload → process → export. Heavy ML runs in an optional local or cloud worker, so the hosted SaaS stays free-deployable.</p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Run e2e test**

Run:

```bash
npm run test:e2e -- tests/e2e/navigation.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css src/app/page.tsx tests/e2e/navigation.spec.ts
git commit -m "feat: add SaveFlow landing page"
```

---

### Task 3: Add Routes, Environment Validation, and Demo Media Types

**Files:**
- Create: `src/lib/env.ts`
- Create: `src/lib/routes.ts`
- Create: `src/features/media/types.ts`
- Create: `src/features/media/demo-data.ts`
- Test: `tests/unit/env.test.ts`

- [ ] **Step 1: Write env validation tests**

Create `tests/unit/env.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFirebaseConfig } from "@/lib/env";

describe("readFirebaseConfig", () => {
  it("returns config when all Firebase values exist", () => {
    const config = readFirebaseConfig({
      NEXT_PUBLIC_FIREBASE_API_KEY: "api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "saveflow.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "saveflow",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "saveflow.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123",
      NEXT_PUBLIC_FIREBASE_APP_ID: "app-id"
    });

    expect(config.projectId).toBe("saveflow");
  });

  it("throws a clear error when a value is missing", () => {
    expect(() => readFirebaseConfig({})).toThrow("Missing Firebase environment variable: NEXT_PUBLIC_FIREBASE_API_KEY");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- tests/unit/env.test.ts
```

Expected: FAIL because `@/lib/env` does not exist.

- [ ] **Step 3: Implement env, routes, and media fixtures**

Create `src/lib/env.ts`:

```ts
type FirebaseEnv = Record<string, string | undefined>;

const requiredKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
] as const;

export function readFirebaseConfig(env: FirebaseEnv = process.env) {
  for (const key of requiredKeys) {
    if (!env[key]) throw new Error(`Missing Firebase environment variable: ${key}`);
  }

  return {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID!
  };
}
```

Create `src/lib/routes.ts`:

```ts
export const appRoutes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/library", label: "Library" },
  { href: "/settings", label: "Settings" }
] as const;
```

Create `src/features/media/types.ts`:

```ts
export type MediaStatus = "uploaded" | "queued" | "processing" | "complete" | "failed";
export type MediaType = "video" | "audio" | "image";
export type PipelineStage = "uploaded" | "converted" | "transcribed" | "summarized" | "exported";

export type MediaItem = {
  id: string;
  title: string;
  mediaType: MediaType;
  status: MediaStatus;
  duration: string;
  size: string;
  createdAt: string;
  tags: string[];
  completedStages: PipelineStage[];
};
```

Create `src/features/media/demo-data.ts`:

```ts
import type { MediaItem } from "./types";

export const demoMedia: MediaItem[] = [
  {
    id: "media-demo-1",
    title: "Portfolio walkthrough clip",
    mediaType: "video",
    status: "complete",
    duration: "06:42",
    size: "184 MB",
    createdAt: "2026-04-28",
    tags: ["portfolio", "machine learning", "demo"],
    completedStages: ["uploaded", "converted", "transcribed", "summarized", "exported"]
  },
  {
    id: "media-demo-2",
    title: "Lecture audio sample",
    mediaType: "audio",
    status: "processing",
    duration: "42:10",
    size: "68 MB",
    createdAt: "2026-04-28",
    tags: ["lecture", "notes"],
    completedStages: ["uploaded", "converted", "transcribed"]
  }
];
```

- [ ] **Step 4: Run unit test**

Run:

```bash
npm run test -- tests/unit/env.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/env.ts src/lib/routes.ts src/features/media/types.ts src/features/media/demo-data.ts tests/unit/env.test.ts
git commit -m "feat: define SaveFlow app primitives"
```

---

### Task 4: Add Firebase Auth Context and Protected App Shell

**Files:**
- Create: `src/features/auth/firebase.ts`
- Create: `src/features/auth/use-auth.tsx`
- Create: `src/components/auth-gate.tsx`
- Create: `src/components/app-shell.tsx`
- Create: `src/app/(app)/layout.tsx`

- [ ] **Step 1: Implement Firebase client**

Create `src/features/auth/firebase.ts`:

```ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { readFirebaseConfig } from "@/lib/env";

const app = getApps().at(0) ?? initializeApp(readFirebaseConfig());

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
```

- [ ] **Step 2: Implement auth provider**

Create `src/features/auth/use-auth.tsx`:

```tsx
"use client";

import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider } from "./firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, nextUser => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signIn: async () => {
      await signInWithPopup(auth, googleProvider);
    },
    signOutUser: async () => {
      await signOut(auth);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
```

- [ ] **Step 3: Implement auth gate**

Create `src/components/auth-gate.tsx`:

```tsx
"use client";

import { useAuth } from "@/features/auth/use-auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-workspace text-muted">Checking studio access…</div>;
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-workspace px-6 text-ink">
        <section className="max-w-md rounded-[2rem] border border-line bg-panel p-8">
          <p className="font-display text-sm uppercase tracking-[0.28em] text-amber">Private workspace</p>
          <h1 className="mt-5 font-display text-4xl font-black tracking-[-0.05em]">Sign in to open SaveFlow.</h1>
          <p className="mt-4 text-muted">Your uploads, jobs, transcripts, and exports stay attached to your Firebase account.</p>
          <button className="mt-8 rounded-full bg-amber px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-workspace" onClick={signIn}>
            Continue with Google
          </button>
        </section>
      </main>
    );
  }

  return children;
}
```

- [ ] **Step 4: Implement app shell and layout**

Create `src/components/app-shell.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { useAuth } from "@/features/auth/use-auth";
import { WorkerStatus } from "./worker-status";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();

  return (
    <div className="min-h-screen bg-workspace text-ink">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-line bg-panel px-5 py-6 md:block">
        <Link className="font-display text-2xl font-black tracking-[-0.06em]" href="/dashboard">SaveFlow</Link>
        <nav className="mt-10 grid gap-2">
          {appRoutes.map(route => {
            const active = pathname === route.href;
            return (
              <Link key={route.href} className={`rounded-2xl px-4 py-3 font-display text-sm uppercase tracking-[0.14em] ${active ? "bg-amber text-workspace" : "text-muted hover:bg-workspace hover:text-ink"}`} href={route.href}>
                {route.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 grid gap-4">
          <WorkerStatus state="offline" />
          <button className="text-left text-sm text-muted" onClick={signOutUser}>Sign out {user?.displayName}</button>
        </div>
      </aside>
      <div className="md:pl-72">
        <header className="sticky top-0 z-20 border-b border-line bg-workspace/95 px-5 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <Link className="font-display text-xl font-black" href="/dashboard">SaveFlow</Link>
            <WorkerStatus state="offline" compact />
          </div>
        </header>
        <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-4 border-t border-line bg-panel md:hidden">
          {appRoutes.map(route => (
            <Link key={route.href} className="px-2 py-3 text-center text-xs text-muted" href={route.href}>{route.label}</Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

Create `src/app/(app)/layout.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { AuthProvider } from "@/features/auth/use-auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>
        <AppShell>{children}</AppShell>
      </AuthGate>
    </AuthProvider>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/firebase.ts src/features/auth/use-auth.tsx src/components/auth-gate.tsx src/components/app-shell.tsx 'src/app/(app)/layout.tsx'
git commit -m "feat: add Firebase protected app shell"
```

---

### Task 5: Add Worker Status and Pipeline Strip Components

**Files:**
- Create: `src/components/worker-status.tsx`
- Create: `src/components/pipeline-strip.tsx`
- Test: `tests/unit/pipeline-strip.test.tsx`

- [ ] **Step 1: Write pipeline strip tests**

Create `tests/unit/pipeline-strip.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PipelineStrip } from "@/components/pipeline-strip";

describe("PipelineStrip", () => {
  it("marks completed stages", () => {
    render(<PipelineStrip completedStages={["uploaded", "converted"]} />);

    expect(screen.getByLabelText("uploaded complete")).toBeInTheDocument();
    expect(screen.getByLabelText("converted complete")).toBeInTheDocument();
    expect(screen.getByLabelText("transcribed pending")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- tests/unit/pipeline-strip.test.tsx
```

Expected: FAIL because component does not exist.

- [ ] **Step 3: Implement components**

Create `src/components/worker-status.tsx`:

```tsx
export type WorkerState = "online" | "offline" | "busy";

const labels: Record<WorkerState, string> = {
  online: "Worker online",
  offline: "Worker offline",
  busy: "Worker busy"
};

const dots: Record<WorkerState, string> = {
  online: "bg-green",
  offline: "bg-red",
  busy: "bg-amber"
};

export function WorkerStatus({ state, compact = false }: { state: WorkerState; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-workspace px-3 py-2" aria-label={labels[state]}>
      <span className={`h-2.5 w-2.5 rounded-full ${dots[state]}`} />
      {!compact && <span className="text-sm text-muted">{labels[state]}</span>}
    </div>
  );
}
```

Create `src/components/pipeline-strip.tsx`:

```tsx
import type { PipelineStage } from "@/features/media/types";

const stages: PipelineStage[] = ["uploaded", "converted", "transcribed", "summarized", "exported"];

export function PipelineStrip({ completedStages }: { completedStages: PipelineStage[] }) {
  return (
    <div className="grid grid-cols-5 gap-1" aria-label="Processing pipeline">
      {stages.map(stage => {
        const complete = completedStages.includes(stage);
        return (
          <div key={stage} className={`h-2 rounded-full ${complete ? "bg-green" : "bg-line"}`} aria-label={`${stage} ${complete ? "complete" : "pending"}`} title={stage} />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test**

Run:

```bash
npm run test -- tests/unit/pipeline-strip.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/worker-status.tsx src/components/pipeline-strip.tsx tests/unit/pipeline-strip.test.tsx
git commit -m "feat: add worker and pipeline status components"
```

---

### Task 6: Add Media Card and App Pages

**Files:**
- Create: `src/components/media-card.tsx`
- Create: `src/app/(app)/dashboard/page.tsx`
- Create: `src/app/(app)/upload/page.tsx`
- Create: `src/app/(app)/library/page.tsx`
- Create: `src/app/(app)/media/[mediaId]/page.tsx`
- Create: `src/app/(app)/settings/page.tsx`
- Test: `tests/unit/media-card.test.tsx`

- [ ] **Step 1: Write media card test**

Create `tests/unit/media-card.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaCard } from "@/components/media-card";

const item = {
  id: "media-1",
  title: "Demo Clip",
  mediaType: "video" as const,
  status: "complete" as const,
  duration: "01:20",
  size: "24 MB",
  createdAt: "2026-04-28",
  tags: ["demo", "clip"],
  completedStages: ["uploaded", "converted", "exported"] as const
};

describe("MediaCard", () => {
  it("links to media detail and shows status", () => {
    render(<MediaCard item={item} />);

    expect(screen.getByRole("link", { name: /open demo clip/i })).toHaveAttribute("href", "/media/media-1");
    expect(screen.getByText("complete")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- tests/unit/media-card.test.tsx
```

Expected: FAIL because `MediaCard` does not exist.

- [ ] **Step 3: Implement media card**

Create `src/components/media-card.tsx`:

```tsx
import Link from "next/link";
import type { MediaItem } from "@/features/media/types";
import { PipelineStrip } from "./pipeline-strip";

export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <Link aria-label={`Open ${item.title}`} className="grid gap-5 rounded-[1.5rem] border border-line bg-panel p-5 hover:border-amber" href={`/media/${item.id}`}>
      <div className="aspect-video rounded-[1rem] bg-workspace" />
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-black tracking-[-0.04em]">{item.title}</h2>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">{item.status}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{item.mediaType} · {item.duration} · {item.size}</p>
      </div>
      <PipelineStrip completedStages={item.completedStages} />
    </Link>
  );
}
```

- [ ] **Step 4: Create app pages**

Create `src/app/(app)/dashboard/page.tsx`:

```tsx
import { MediaCard } from "@/components/media-card";
import { demoMedia } from "@/features/media/demo-data";

export default function DashboardPage() {
  return (
    <div className="grid gap-8 pb-20 md:pb-0">
      <section>
        <p className="font-display text-sm uppercase tracking-[0.24em] text-amber">Studio state</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.06em]">Dashboard</h1>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-line bg-panel p-5"><p className="text-muted">Media</p><strong className="font-display text-3xl">2</strong></div>
        <div className="rounded-[1.5rem] border border-line bg-panel p-5"><p className="text-muted">Jobs</p><strong className="font-display text-3xl">1</strong></div>
        <div className="rounded-[1.5rem] border border-line bg-panel p-5"><p className="text-muted">Worker</p><strong className="font-display text-3xl">Offline</strong></div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {demoMedia.map(item => <MediaCard key={item.id} item={item} />)}
      </section>
    </div>
  );
}
```

Create `src/app/(app)/upload/page.tsx`:

```tsx
export default function UploadPage() {
  return (
    <div className="grid gap-8 pb-20 md:grid-cols-[1fr_22rem] md:pb-0">
      <section className="rounded-[2rem] border border-line bg-panel p-8">
        <p className="font-display text-sm uppercase tracking-[0.24em] text-amber">Ingest</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.06em]">Upload media</h1>
        <div className="mt-8 grid min-h-80 place-items-center rounded-[1.5rem] border border-dashed border-line bg-workspace text-center">
          <div>
            <p className="font-display text-xl font-black">Drop video, audio, or image files</p>
            <p className="mt-2 text-muted">MP4, MOV, WEBM, MP3, WAV, JPG, PNG</p>
          </div>
        </div>
      </section>
      <aside className="rounded-[2rem] border border-line bg-panel p-6">
        <h2 className="font-display text-xl font-black">Processing rail</h2>
        <p className="mt-3 text-sm leading-6 text-muted">Worker offline. Files can upload after Firebase Storage is connected; processing jobs will queue until worker setup is complete.</p>
      </aside>
    </div>
  );
}
```

Create `src/app/(app)/library/page.tsx`:

```tsx
import { MediaCard } from "@/components/media-card";
import { demoMedia } from "@/features/media/demo-data";

export default function LibraryPage() {
  return (
    <div className="grid gap-8 pb-20 md:pb-0">
      <section>
        <p className="font-display text-sm uppercase tracking-[0.24em] text-amber">Archive</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.06em]">Library</h1>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoMedia.map(item => <MediaCard key={item.id} item={item} />)}
      </section>
    </div>
  );
}
```

Create `src/app/(app)/media/[mediaId]/page.tsx`:

```tsx
import { PipelineStrip } from "@/components/pipeline-strip";
import { demoMedia } from "@/features/media/demo-data";

export default function MediaDetailPage({ params }: { params: { mediaId: string } }) {
  const item = demoMedia.find(media => media.id === params.mediaId) ?? demoMedia[0];

  return (
    <div className="grid gap-8 pb-20 lg:grid-cols-[1fr_24rem] lg:pb-0">
      <section className="grid gap-6">
        <div className="aspect-video rounded-[2rem] border border-line bg-panel" />
        <div>
          <p className="font-display text-sm uppercase tracking-[0.24em] text-amber">Media detail</p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.06em]">{item.title}</h1>
          <p className="mt-3 text-muted">{item.mediaType} · {item.duration} · {item.size}</p>
        </div>
        <PipelineStrip completedStages={item.completedStages} />
      </section>
      <aside className="grid gap-4 rounded-[2rem] border border-line bg-panel p-6">
        <h2 className="font-display text-xl font-black">Outputs</h2>
        <button className="rounded-full bg-amber px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-workspace">Export MP3</button>
        <button className="rounded-full border border-line px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-ink">Generate transcript</button>
      </aside>
    </div>
  );
}
```

Create `src/app/(app)/settings/page.tsx`:

```tsx
export default function SettingsPage() {
  return (
    <div className="grid max-w-4xl gap-8 pb-20 md:pb-0">
      <section>
        <p className="font-display text-sm uppercase tracking-[0.24em] text-amber">Setup</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.06em]">Settings</h1>
      </section>
      <section className="grid gap-4">
        <div className="rounded-[1.5rem] border border-line bg-panel p-5">
          <h2 className="font-display text-xl font-black">AI provider</h2>
          <p className="mt-2 text-muted">Local models default. Gemini and OpenAI keys can be added in Phase 4.</p>
        </div>
        <div className="rounded-[1.5rem] border border-line bg-panel p-5">
          <h2 className="font-display text-xl font-black">Local worker</h2>
          <code className="mt-3 block rounded-2xl bg-workspace p-4 text-sm text-muted">saveflow-worker start --device auto --model-profile tiny</code>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Run unit tests and e2e test**

Run:

```bash
npm run test -- tests/unit/media-card.test.tsx tests/unit/pipeline-strip.test.tsx
npm run test:e2e -- tests/e2e/navigation.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/media-card.tsx 'src/app/(app)/dashboard/page.tsx' 'src/app/(app)/upload/page.tsx' 'src/app/(app)/library/page.tsx' 'src/app/(app)/media/[mediaId]/page.tsx' 'src/app/(app)/settings/page.tsx' tests/unit/media-card.test.tsx
git commit -m "feat: add SaveFlow app pages"
```

---

## Self-Review

Spec coverage:

- SaaS foundation: covered by Tasks 1, 3, and 4.
- Studio OS UI direction: covered by Tasks 2, 5, and 6.
- Protected app routes: covered by Task 4.
- Dashboard, upload, library, media detail, settings: covered by Task 6.
- Worker visibility: covered by Tasks 4 and 5.
- Firebase env boundary: covered by Tasks 3 and 4.
- Media processing, Firestore persistence, Storage upload, Python worker, AI providers, and security rules are not in this phase and need separate implementation plans.

Placeholder scan:

- No TBD/TODO/fill-in placeholders.
- Deferred work is explicitly scoped out, not left as incomplete steps.

Type consistency:

- `PipelineStage`, `MediaItem`, `MediaStatus`, and routes are defined before use.
- Component props match tests and page usage.
