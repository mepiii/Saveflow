// Purpose: Defines the global Next.js document shell and metadata.
// Callers: Next.js App Router.
// Deps: next metadata types and app-wide CSS.
// API: Exports metadata and RootLayout component.
// Side effects: Loads global styles for every route.
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
