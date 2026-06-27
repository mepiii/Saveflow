// Purpose: Configure Next.js application behavior.
// Callers: Next.js CLI during dev, build, and start.
// Deps: next config types.
// API: NextConfig export.
// Side effects: Enables typed route validation during builds.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true
};

export default nextConfig;
