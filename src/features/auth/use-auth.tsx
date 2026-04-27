// Purpose: Provide Firebase Auth state and actions to client components.
// Callers: AuthGate, AppShell, and authenticated feature screens.
// Deps: React context hooks and Firebase Auth helpers.
// API: AuthProvider component and useAuth hook.
// Side effects: Subscribes to Firebase auth state while mounted.
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getFirebaseAuth, googleProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "./firebase";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    try {
      return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
        setUser(nextUser);
        setStatus(nextUser ? "authenticated" : "unauthenticated");
      });
    } catch {
      setStatus("unauthenticated");
      return undefined;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(getFirebaseAuth(), googleProvider);
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  const value = useMemo(
    () => ({ user, status, signInWithGoogle, signOutUser }),
    [signInWithGoogle, signOutUser, status, user]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
