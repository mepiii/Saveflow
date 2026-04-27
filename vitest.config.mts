// Purpose: Configure Vitest unit test execution.
// Callers: npm test and Vitest CLI.
// Deps: vitest/config.
// API: Vitest config with jsdom and source aliases.
// Side effects: Excludes Playwright specs and nested agent worktrees from unit runs.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    exclude: ["**/.claude/**", "**/node_modules/**", "**/tests/e2e/**"],
    globals: true,
    setupFiles: ["@testing-library/jest-dom/vitest"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
