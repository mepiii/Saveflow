// Purpose: Verify Firebase auth context and protected shell behavior.
// Callers: Vitest unit suite.
// Deps: React Testing Library, Vitest, auth provider, auth gate, app shell.
// API: AuthProvider, AuthGate, and AppShell behavior expectations.
// Side effects: Mocks Firebase auth module calls.
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { AuthProvider, useAuth } from "@/features/auth/use-auth";

const authState = vi.hoisted(() => ({
  currentUser: null as { uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null,
  listeners: [] as ((user: typeof authState.currentUser) => void)[],
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  unsubscribe: vi.fn()
}));

vi.mock("@/features/auth/firebase", () => ({
  getFirebaseAuth: vi.fn(() => ({ app: "firebase-auth" })),
  googleProvider: { providerId: "google.com" },
  onAuthStateChanged: vi.fn((_auth, listener: (user: typeof authState.currentUser) => void) => {
    authState.listeners.push(listener);
    listener(authState.currentUser);
    return authState.unsubscribe;
  }),
  signInWithPopup: authState.signInWithPopup,
  signOut: authState.signOut
}));

const publishUser = (user: typeof authState.currentUser) => {
  authState.currentUser = user;
  authState.listeners.forEach((listener) => listener(user));
};

const signedInUser = {
  uid: "user-1",
  displayName: "Ada Lovelace",
  email: "ada@example.com",
  photoURL: "https://example.com/ada.png"
};

const h = React.createElement;
const renderWithAuth = (element: React.ReactElement) => render(h(AuthProvider, null, element));

beforeEach(() => {
  authState.currentUser = null;
  authState.listeners = [];
  authState.signInWithPopup.mockReset();
  authState.signOut.mockReset();
  authState.unsubscribe.mockReset();
});

describe("AuthProvider", () => {
  it("starts in loading state then exposes the current user", async () => {
    publishUser(signedInUser);

    const Probe = () => {
      const { status, user } = useAuth();
      return h("p", null, `${status}:${user?.email}`);
    };

    renderWithAuth(h(Probe));

    await waitFor(() => expect(screen.getByText("authenticated:ada@example.com")).toBeInTheDocument());
  });

  it("calls Firebase Google popup when signing in", async () => {
    const Probe = () => {
      const { signInWithGoogle } = useAuth();
      return h("button", { onClick: () => void signInWithGoogle() }, "Sign in");
    };

    renderWithAuth(h(Probe));

    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(authState.signInWithPopup).toHaveBeenCalledWith({ app: "firebase-auth" }, { providerId: "google.com" });
  });
});

describe("AuthGate", () => {
  it("shows Google sign-in when unauthenticated", async () => {
    renderWithAuth(h(AuthGate, null, h("p", null, "Protected content")));

    expect(await screen.findByRole("button", { name: "Continue with Google" })).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", async () => {
    publishUser(signedInUser);

    renderWithAuth(h(AuthGate, null, h("p", null, "Protected content")));

    expect(await screen.findByText("Protected content")).toBeInTheDocument();
  });
});

describe("AppShell", () => {
  it("uses app route labels in navigation and shows offline worker status", async () => {
    publishUser(signedInUser);

    renderWithAuth(h(AppShell, null, h("p", null, "Dashboard body")));

    expect((await screen.findAllByRole("link", { name: "Dashboard" }))[0]).toHaveAttribute("href", "/dashboard");
    expect(screen.getAllByRole("link", { name: "Upload" })[0]).toHaveAttribute("href", "/upload");
    expect(screen.getAllByRole("link", { name: "Library" })[0]).toHaveAttribute("href", "/library");
    expect(screen.getAllByRole("link", { name: "Settings" })[0]).toHaveAttribute("href", "/settings");
    expect(screen.getAllByText("Worker offline").length).toBeGreaterThan(0);
    expect(screen.getByText("Dashboard body")).toBeInTheDocument();
  });

  it("signs out through Firebase", async () => {
    publishUser(signedInUser);

    renderWithAuth(h(AppShell, null, h("p", null, "Dashboard body")));

    await userEvent.click((await screen.findAllByRole("button", { name: "Sign out" }))[0]);
    expect(authState.signOut).toHaveBeenCalledWith({ app: "firebase-auth" });
  });
});
