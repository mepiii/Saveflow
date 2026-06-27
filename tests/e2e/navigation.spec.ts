// Purpose: Verifies primary landing-page navigation and messaging.
// Callers: Playwright test runner.
// Deps: @playwright/test browser fixtures and assertions.
// API: Exports Playwright tests through module side effects.
// Side effects: Opens the local Next.js app during e2e execution.
import { expect, test } from "@playwright/test";

test("landing page presents SaveFlow and app entry", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /media intelligence, no gatekeeping/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /start without login/i })).toHaveAttribute("href", "/dashboard");
  await expect(page.getByText(/guest sessions stay local-first/i)).toBeVisible();
});
