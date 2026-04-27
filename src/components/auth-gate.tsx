// Purpose: Block protected application routes until Firebase authentication succeeds.
// Callers: Protected app route layout.
// Deps: React, AuthProvider state, and Tailwind utility classes.
// API: AuthGate component wrapping protected children.
// Side effects: Starts Google popup sign-in when requested.
"use client";

import React, { useState, type ReactNode } from "react";
import { useAuth } from "@/features/auth/use-auth";

const h = React.createElement;

export function AuthGate({ children }: { children: ReactNode }) {
  const { signInWithGoogle, status } = useAuth();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setSignInError(null);

    try {
      await signInWithGoogle();
    } catch {
      setSignInError("Google sign-in failed. Check Firebase config and allowed domains.");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (status === "loading") {
    return h(
      "main",
      { className: "grid min-h-screen place-items-center bg-workspace text-ink" },
      h("p", { className: "font-display text-sm uppercase tracking-[0.24em] text-muted" }, "Checking session")
    );
  }

  if (status === "unauthenticated") {
    return h(
      "main",
      { className: "grid min-h-screen place-items-center bg-workspace px-6 text-ink" },
      h(
        "section",
        { className: "w-full max-w-md rounded-[2rem] border border-line bg-panel p-8 text-center" },
        h("p", { className: "font-display text-sm uppercase tracking-[0.28em] text-amber" }, "SaveFlow Studio OS"),
        h("h1", { className: "mt-5 font-display text-4xl font-black tracking-[-0.06em]" }, "Sign in to continue."),
        h("p", { className: "mt-4 text-sm leading-6 text-muted" }, "Use Google auth to open your protected media workspace."),
        signInError
          ? h(
              "p",
              { className: "mt-5 rounded-2xl border border-red/40 bg-red/10 px-4 py-3 text-sm text-ink", role: "alert" },
              signInError
            )
          : null,
        h(
          "button",
          {
            className:
              "mt-8 w-full rounded-full bg-amber px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-workspace disabled:cursor-not-allowed disabled:opacity-60",
            disabled: isSigningIn,
            onClick: () => void handleSignIn(),
            type: "button"
          },
          isSigningIn ? "Opening Google" : "Continue with Google"
        )
      )
    );
  }

  return children;
}
