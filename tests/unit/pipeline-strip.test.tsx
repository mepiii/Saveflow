// Purpose: Verify pipeline strip stage completion rendering.
// Callers: Vitest unit suite.
// Deps: React Testing Library, Vitest, PipelineStrip component.
// API: PipelineStrip accessibility assertions.
// Side effects: Renders component in jsdom.
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PipelineStrip } from "@/components/pipeline-strip";

const h = React.createElement;

describe("PipelineStrip", () => {
  it("marks completed stages", () => {
    render(h(PipelineStrip, { completedStages: ["uploaded", "converted"] }));
    expect(screen.getByLabelText("uploaded complete")).toBeInTheDocument();
    expect(screen.getByLabelText("converted complete")).toBeInTheDocument();
    expect(screen.getByLabelText("transcribed pending")).toBeInTheDocument();
  });
});
