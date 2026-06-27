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
