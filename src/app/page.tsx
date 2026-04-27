// Purpose: Renders the SaveFlow Studio OS landing page.
// Callers: Next.js App Router root route.
// Deps: next/link and global Studio OS design classes.
// API: Exports the LandingPage route component.
// Side effects: None.
import { appRoutes } from "@/lib/routes";
import Link from "next/link";

const workflowSteps = [
  ["01", "Upload locally", "Guest-ready"],
  ["02", "Convert formats", "Worker queued"],
  ["03", "Transcribe audio", "Local or cloud"],
  ["04", "Summarize and tag", "Reviewable"],
  ["05", "Save history later", "Optional login"]
] as const;

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <section className="landing-frame" aria-label="SaveFlow landing page">
        <div className="landing-hero">
          <p className="sf-kicker">SaveFlow Studio OS</p>
          <h1 className="landing-title">Media intelligence, no gatekeeping.</h1>
          <p className="landing-copy">
            Convert, transcribe, summarize, and export media from one focused control room. Start as a guest; sign in only when cloud history matters.
          </p>
          <div className="landing-actions">
            <Link className="sf-button" href={appRoutes.dashboard}>Start without login</Link>
            <a className="sf-button-secondary" href="#workflow">View flow</a>
          </div>
        </div>

        <div className="landing-console" id="workflow">
          <div className="console-panel">
            <div className="console-topbar">
              <span>Pipeline map</span>
              <span>Local-first</span>
            </div>
            <div className="console-steps">
              {workflowSteps.map(([index, label, state]) => (
                <div className="console-step" key={label}>
                  <span className="console-index">{index}</span>
                  <span className="console-label">{label}</span>
                  <span className="console-pill">{state}</span>
                </div>
              ))}
            </div>
            <p className="console-note">
              Guest sessions stay local-first. Sign in adds cloud history, storage, and cross-device recovery.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
