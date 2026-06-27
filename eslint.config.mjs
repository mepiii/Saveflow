// Purpose: Configure ESLint for Next.js source validation.
// Callers: npm run lint and editor integrations.
// Deps: ESLint FlatCompat and Node URL/path helpers.
// API: Flat ESLint config export.
// Side effects: Ignores build output, dependencies, and nested agent worktrees.
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url))
});

const config = [
  { ignores: [".claude/**", ".next/**", "next-env.d.ts", "node_modules/**", "playwright-report/**", "test-results/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript")
];

export default config;
