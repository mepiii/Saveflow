// Purpose: Render media pipeline stage completion state.
// Callers: Media cards and pipeline summary surfaces.
// Deps: React and media PipelineStage type.
// API: PipelineStrip component with completedStages input.
// Side effects: None.
import React from "react";
import type { PipelineStage } from "@/features/media/types";

const h = React.createElement;
const pipelineStages: PipelineStage[] = ["uploaded", "converted", "transcribed", "summarized", "exported"];

type PipelineStripProps = {
  completedStages: PipelineStage[];
};

export function PipelineStrip({ completedStages }: PipelineStripProps) {
  const completed = new Set(completedStages);

  return h(
    "div",
    { "aria-label": "Media pipeline progress", className: "pipeline-strip", role: "list" },
    pipelineStages.map((stage) => {
      const isComplete = completed.has(stage);
      return h("span", {
        "aria-label": `${stage} ${isComplete ? "complete" : "pending"}`,
        className: `pipeline-stage ${isComplete ? "pipeline-stage-complete" : "pipeline-stage-pending"}`,
        key: stage,
        role: "listitem",
        title: stage
      });
    })
  );
}
